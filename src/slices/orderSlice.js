import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URLS } from "../Constants";
import { axiosInstance } from "../Utils/axiosInstance";
import { getUserData } from "../Utils/getUserData";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  total: 0,
  paymentProcessing: false,
  paymentError: null,
  lastPaymentResult: null
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      // Get user data
      const user = getUserData();
      
      // Create order with user email as updated_by
      const order = {
        ...orderData,
        updated_by: user.email,
        status: 'confirmed',
        paymentDetails: {
          ...orderData.paymentDetails,
          paidAt: new Date().toISOString()
        }
      };

      console.log('Sending order to API:', JSON.stringify(order, null, 2));
      
      const response = await axiosInstance.post(URLS.BOOKINGS, order);
      console.log('API Response:', response.data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      throw new Error(response.data?.msg || 'Failed to create order');
    } catch (error) {
      console.error('Order creation error:', error);
      return rejectWithValue(error.response?.data?.msg || error.message || 'Failed to create order');
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
      
      // Add filter parameters if they exist
      Object.entries(filter).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      // Use admin bookings endpoint for admin users
      let url;
      if (user.roles.includes('admin')) {
        url = `${URLS.ADMIN_BOOKINGS}?${queryParams.toString()}`;
      } else {
        url = `${URLS.BOOKINGS}/user/${user._id}?${queryParams.toString()}`;
      }
      
      console.log('Making request to:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Orders response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Map the response data to match our state structure
      const bookings = response.data.data || [];
      const total = response.data.total || 0;
      const totalPages = response.data.pages || Math.ceil(total / limit);
      
      return {
        orders: bookings.map(booking => ({
          _id: booking._id,
          roomId: booking.roomId,
          userId: booking.userId,
          guestName: booking.guestName || 'N/A',
          phoneNumber: booking.phoneNumber || 'N/A',
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status || 'pending',
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus || 'pending',
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        })),
        currentPage: page,
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
  initialState,
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
    resetOrderState: () => initialState
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

export const { clearError, clearPaymentResult, paymentResult, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
