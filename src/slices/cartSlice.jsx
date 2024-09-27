
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  quantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // if item exist
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity++;
        state.quantity++;
      } else {
        // new item
        state.cart.push({ ...action.payload, quantity: 1 });
        state.quantity++;
      }
    },
    removeItem: (state, action) => {
      const newItems = state.cart.filter((item) => item._id !== action.payload);
      state.cart = newItems;
      state.quantity = newItems.reduce(
        (acc, object) => acc + object.quantity,
        0
      );
    },
    increaseQuantity: () => {},
    decreaseQuantity: () => {},
    updateCart: () => {},
    removeAll: () => {},
  },
});

export const {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeAll,
  removeItem,
  updateCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
