import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URLS } from "../Constants/index";
import { getToken } from "../Utils/session";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

// Get my bookings
export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching bookings...');
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${URLS.ORDERS}/my-orders`, {
        headers: {
          access_token: token
        },
      });

      console.log('Raw API response:', response.data);

      // Handle different response structures
      let bookings = [];
      if (response.data?.data) {
        bookings = response.data.data;
      } else if (Array.isArray(response.data)) {
        bookings = response.data;
      }

      // Map the bookings to ensure consistent structure
      const processedBookings = bookings.map(booking => ({
        _id: booking._id,
        orderNo: booking.orderNo || booking.number,
        hotelName: booking.hotelDetails?.name || booking.hotelName || 'N/A',
        roomType: booking.roomDetails?.roomType || booking.roomType || 'Standard Room',
        roomNumber: booking.roomDetails?.roomNumber || booking.roomNumber,
        amount: booking.amount || booking.price,
        status: booking.status || 'confirmed',
        paymentMethod: booking.paymentMethod,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate,
        created_at: booking.created_at || booking.createdAt,
        totalGuests: booking.roomDetails?.totalGuests || booking.totalGuests
      }));

      console.log('Processed bookings:', processedBookings);
      return { data: processedBookings };
    } catch (error) {
      console.error('Error fetching bookings:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch bookings";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Create booking with payment
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue, dispatch }) => {
    try {
      console.log('Creating booking with data:', bookingData);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const orderData = {
        room: bookingData.roomId,
        amount: bookingData.amount,
        receiver: bookingData.receiver || "Guest",
        paymentMethod: bookingData.paymentMethod,
        arrivalDate: bookingData.arrivalDate || new Date(),
        departureDate: bookingData.departureDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "confirmed"
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post(`${URLS.ORDERS}/createOrder`, orderData, {
        headers: {
          access_token: token
        },
      });

      console.log('Create booking response:', response.data);

      // Show success toast
      toast.success('Payment successful! Your booking has been confirmed.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Refresh bookings list after successful creation
      dispatch(getMyBookings());
      
      return response.data;
    } catch (error) {
      console.error('Booking creation error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create booking";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || [];
        console.log('Updated bookings state:', state.bookings);
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        console.error('Bookings fetch error:', state.error);
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        const newBooking = action.payload.data;
        console.log('New booking to add:', newBooking);
        if (newBooking) {
          state.bookings = [...state.bookings, newBooking];
        }
        console.log('Updated bookings after adding:', state.bookings);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        console.error('Booking creation error:', state.error);
      });
  },
});

export default bookingSlice.reducer;
