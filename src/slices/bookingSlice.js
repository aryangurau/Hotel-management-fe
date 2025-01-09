import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Utils/axiosInstance';
import RoomServices from '../services/rooms';

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
            // First create the booking
            const response = await axiosInstance.post('/bookings', bookingData);
            
            if (!response.data?.data) {
                throw new Error('Invalid booking response');
            }
            
            const booking = response.data.data;
            
            // Then update the room status to "booked"
            try {
                await RoomServices.updateRoomStatus(booking.roomId, { status: 'booked' });
                console.log('Room status updated to booked');
            } catch (error) {
                console.error('Error updating room status:', error);
                // Don't reject here, just log the error
            }
            
            return booking;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
        }
    }
);

// Async thunk for checking in
export const checkIn = createAsyncThunk(
    'booking/checkIn',
    async ({ bookingId, roomId }, { rejectWithValue }) => {
        try {
            // Update booking status
            const bookingResponse = await axiosInstance.patch(`/bookings/${bookingId}`, {
                status: 'checked-in'
            });
            
            // Update room status to "occupied"
            await RoomServices.updateRoomStatus(roomId, { status: 'occupied' });
            
            return bookingResponse.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to check in');
        }
    }
);

// Async thunk for checking out
export const checkOut = createAsyncThunk(
    'booking/checkOut',
    async ({ bookingId, roomId }, { rejectWithValue }) => {
        try {
            // Update booking status
            const bookingResponse = await axiosInstance.patch(`/bookings/${bookingId}`, {
                status: 'completed'
            });
            
            // Update room status back to "available"
            await RoomServices.updateRoomStatus(roomId, { status: 'available' });
            
            return bookingResponse.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to check out');
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
            })
            .addCase(checkIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkIn.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            .addCase(checkIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(checkOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            .addCase(checkOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedBooking, clearSelectedBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
