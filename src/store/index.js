import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  REGISTER,
  REHYDRATE,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; //LS
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import { cartReducer } from "../slices/cartSlice";
import roomReducer from "../slices/roomSlice";
import userReducer from "../slices/userSlice";
import orderReducer from "../slices/orderSlice";
import bookingReducer from "../slices/bookingSlice";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['cart', 'user'] // Only persist cart and user state
};

const persistedReducers = {
  cart: persistReducer({ ...persistConfig, key: 'cart' }, cartReducer),
  rooms: roomReducer,
  users: userReducer,
  orders: orderReducer,
  booking: bookingReducer
};

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);
