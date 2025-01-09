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
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
        ...filter
      }).toString();
      
      const response = await axiosInstance.get(`${URLS.ORDERS}/list?${queryParams}`);
      
      if (response.data?.data) {
        return {
          orders: response.data.data.orders,
          currentPage: page,
          totalPages: Math.ceil(response.data.data.total / limit),
          total: response.data.data.total
        };
      }
      throw new Error(response.data?.msg || 'Failed to fetch orders');
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.msg || error.message });
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
        state.orders = action.payload.orders;
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
