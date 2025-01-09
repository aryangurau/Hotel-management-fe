import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import roomReducer from './slices/roomSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cart'] // also persist cart state
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    booking: bookingReducer,
    user: userReducer,
    cart: persistedCartReducer,
    orders: orderReducer,
    rooms: roomReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
