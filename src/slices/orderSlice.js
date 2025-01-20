import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URLS } from "../Constants";
import { axiosInstance } from "../Utils/axiosInstance";
import { getUserData } from "../Utils/getUserData";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  total: 0,
  paymentProcessing: false,
  paymentError: null,
  lastPaymentResult: null
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      // Get user data and token
      const user = getUserData();
      const token = sessionStorage.getItem('token');
      
      if (!user || !token) {
        throw new Error('Please login to make a booking');
      }

      // Create order with user email as updated_by
      const order = {
        ...orderData,
        roomId: orderData.roomId,
        status: 'confirmed',
        paymentMethod: orderData.paymentMethod,
        paymentDetails: {
          status: 'paid',
          paidAt: new Date().toISOString()
        }
      };

      // Validate required fields
      if (!order.roomId) {
        throw new Error('Room ID is required');
      }

      console.log('Sending booking to API:', JSON.stringify(order, null, 2));
      
      // Include auth token in request headers
      const response = await axiosInstance.post(URLS.BOOKINGS, order, {
        headers: {
          'access_token': token
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      throw new Error(response.data?.msg || 'Failed to create booking');
    } catch (error) {
      console.error('Booking creation error:', error);
      return rejectWithValue(error.response?.data?.msg || error.message || 'Failed to create booking');
    }
  }
);

export const listOrders = createAsyncThunk(
  "orders/list",
  async ({ page = 1, limit = 10, filter = {} } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching orders with params:', { page, limit, filter });
      
      // Get user data to check role
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        throw new Error('User session not found');
      }
      
      const user = JSON.parse(userStr);
      console.log('User data:', user);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add filter parameters
      Object.entries(filter).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      // Determine the base URL based on user role
      let baseUrl = URLS.ORDERS;
      if (user.roles?.includes('admin')) {
        baseUrl = URLS.ADMIN_ORDERS;
      } else {
        baseUrl = `${URLS.ORDERS}/my-orders`;
      }
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log('Making request to:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      
      // Handle empty or invalid response
      if (!response?.data?.data?.data) {
        console.log('Empty or invalid response structure');
        return {
          orders: [],
          currentPage: 1,
          totalPages: 0,
          total: 0
        };
      }

      // Extract orders array from nested data structure
      const responseData = response.data.data;
      console.log('Response data object:', responseData);

      const orders = Array.isArray(responseData.data) ? responseData.data : [];
      console.log('Extracted orders array:', orders);

      const total = responseData.total || 0;
      const totalPages = responseData.totalPages || Math.ceil(total / limit);
      const currentPage = parseInt(page);

      if (!Array.isArray(orders)) {
        console.error('Orders is not an array:', orders);
        return {
          orders: [],
          currentPage,
          totalPages,
          total
        };
      }

      console.log('Processing orders array of length:', orders.length);

      // Map orders to consistent format
      const mappedOrders = orders.map(order => {
        console.log('Processing order:', order);
        return {
          _id: order._id || '',
          orderNo: order.orderNo || order.number || 'N/A',
          room: order.room ? {
            _id: order.room._id || '',
            name: order.room.name || 'N/A',
            type: order.room.type || 'N/A',
            price: order.room.price || 0,
            status: order.room.status || 'N/A',
            totalGuests: order.room.totalGuests || 0
          } : null,
          customer: {
            name: order.customer?.name || order.name || 'N/A',
            email: order.customer?.email || order.email || 'N/A',
            phone: order.customer?.phone || order.phoneNumber || 'N/A'
          },
          amount: order.amount || order.totalAmount || 0,
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || order.payment?.status || 'pending',
          paymentMethod: order.paymentMethod || order.payment?.method || 'N/A',
          checkIn: order.checkIn || order.startDate || null,
          checkOut: order.checkOut || order.endDate || null,
          createdBy: order.created_by ? {
            name: order.created_by.name || 'N/A',
            email: order.created_by.email || 'N/A'
          } : null,
          createdAt: order.createdAt || null,
          updatedAt: order.updatedAt || null
        };
      });

      console.log('Final mapped orders:', mappedOrders);
      
      return {
        orders: mappedOrders,
        currentPage,
        totalPages,
        total
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentPage: 1,
    totalPages: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentResult: (state) => {
      state.lastPaymentResult = null;
    },
    paymentResult: (state, action) => {
      state.paymentProcessing = false;
      state.lastPaymentResult = action.payload;
    },
    resetOrderState: () => initialState,
    clearOrders: (state) => {
      state.orders = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List Orders
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearPaymentResult, paymentResult, resetOrderState, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
