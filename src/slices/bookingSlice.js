import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Utils/axiosInstance';

// Async thunk for fetching bookings
export const getMyBookings = createAsyncThunk(
    'booking/getMyBookings',
    async (_, { rejectWithValue }) => {
        try {
            // Get user data from session storage
            const userStr = sessionStorage.getItem('user');
            if (!userStr) {
                throw new Error('User session not found');
            }
            const user = JSON.parse(userStr);
            
            // Debug logs
            console.log('Fetching bookings for user:', user._id);
            
            const response = await axiosInstance.get(`/bookings/user/${user._id}`);
            console.log('Bookings API Response:', response.data);
            
            if (!response.data?.data) {
                throw new Error('Invalid response format');
            }
            
            return response.data.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch bookings');
        }
    }
);

// Async thunk for creating a booking
export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/bookings', bookingData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
        }
    }
);

const initialState = {
    bookings: [],
    loading: false,
    error: null,
    selectedBooking: null
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setSelectedBooking: (state, action) => {
            state.selectedBooking = action.payload;
        },
        clearSelectedBooking: (state) => {
            state.selectedBooking = null;
        },
        clearBookings: (state) => {
            state.bookings = [];
            state.selectedBooking = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(getMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedBooking, clearSelectedBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
