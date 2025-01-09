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
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id || item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity++;
        state.quantity++;
      } else {
        // new item - ensure we have both id and _id
        const newItem = {
          ...action.payload,
          id: action.payload.id || action.payload._id,
          _id: action.payload._id || action.payload.id,
          quantity: 1
        };
        state.cart.push(newItem);
        state.quantity++;
      }
    },
    removeItem: (state, action) => {
      const newItems = state.cart.filter(
        (item) => item._id !== action.payload && item.id !== action.payload
      );
      state.cart = newItems;
      state.quantity = newItems.reduce(
        (acc, object) => acc + object.quantity,
        0
      );
    },
    increaseQuantity: (state, action) => {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id || item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity++;
        state.quantity++;
      }
    },
    decreaseQuantity: (state, action) => {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id || item.id === action.payload.id
      );
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        state.quantity--;
      }
    },
    removeAll: (state) => {
      state.cart = [];
      state.quantity = 0;
    },
  },
});

export const {
  addToCart,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  removeAll,
} = cartSlice.actions;

export default cartSlice.reducer;
