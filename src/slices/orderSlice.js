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
      
      const response = await axiosInstance.post(`${URLS.ORDERS}/createOrder`, order);
      console.log('API Response:', response.data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      throw new Error(response.data?.msg || 'Failed to create order');
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to create order';
      return rejectWithValue({ message: errorMsg });
    }
  }
);

export const listOrders = createAsyncThunk(
  "orders/list",
  async ({ page = 1, limit = 10, filter = {} }, { rejectWithValue }) => {
    try {
      // Get user data to check if admin
      const user = getUserData();
      const isAdmin = user?.roles?.includes('admin');
      
      // Use different endpoint for admin and regular users
      const endpoint = isAdmin ? 'list' : 'my-orders';
      
      const response = await axiosInstance.get(
        `${URLS.ORDERS}/${endpoint}`,
        { 
          params: { 
            page, 
            limit,
            ...filter  // Include all filter parameters
          }
        }
      );
      
      if (!response.data?.data) {
        throw new Error(response.data?.msg || 'No orders found');
      }
      
      // Transform the data to match our component's expectations
      const orders = response.data.data.map(order => ({
        ...order,
        orderNumber: order.orderNo || order._id,
        hotel: order.hotelName || order.hotel || 'N/A',
        room: order.roomNumber || order.room || 'N/A',
        checkIn: order.arrivalDate || order.checkIn,
        checkOut: order.departureDate || order.checkOut,
        totalPrice: order.amount || order.totalPrice || 0,
        status: order.status || 'pending',
        created_by: order.created_by || order.updated_by || 'Unknown',
        createdAt: order.createdAt || new Date().toISOString()
      }));
      
      return {
        data: orders,
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || orders.length
      };
    } catch (error) {
      console.error('List orders error:', error);
      return rejectWithValue({
        message: error.response?.data?.msg || error.message || "Failed to fetch orders"
      });
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    clearPaymentResult: (state) => {
      state.lastPaymentResult = null;
    },
    paymentResult: (state, action) => {
      state.lastPaymentResult = action.payload;
      state.paymentProcessing = false;
      if (!action.payload.success) {
        state.paymentError = action.payload.error;
      }
    },
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentProcessing = true;
        state.paymentError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.paymentProcessing = false;
        state.paymentError = null;
        if (action.payload) {
          state.orders = [action.payload, ...state.orders];
          state.lastPaymentResult = {
            success: true,
            orderId: action.payload._id,
            paymentMethod: action.payload.paymentMethod
          };
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.paymentProcessing = false;
        state.error = action.payload?.message || "Something went wrong";
        state.paymentError = action.payload?.message || "Payment failed";
        state.lastPaymentResult = {
          success: false,
          error: action.payload?.message || "Payment failed"
        };
      })
      // List Orders
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      });
  },
});

export const { clearError, clearPaymentResult, paymentResult, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
