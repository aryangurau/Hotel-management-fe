import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Utils/axiosInstance';
import { getToken } from '../Utils/session';

// Async thunk for fetching bookings
export const getMyBookings = createAsyncThunk(
    'booking/getMyBookings',
    async (_, { rejectWithValue }) => {
        try {
            // Debug logs
            console.log('Starting to fetch bookings');
            const token = getToken();
            console.log('Current token:', token);
            
            const response = await axiosInstance.get('/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Bookings API Response:', response);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            console.error('Error response:', error.response);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

// Async thunk for creating a booking
export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const token = getToken();
            const response = await axiosInstance.post('/bookings', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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

export const { setSelectedBooking, clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
