import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../slices/bookingSlice';
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
