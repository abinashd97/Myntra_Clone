import {createSlice} from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      const itemId = action.payload;
      if (!state.includes(itemId)) {
        state.push(itemId);
      }
    },
    removeFromWishlist: (state, action) => {
      const itemId = action.payload;
      return state.filter(id => id !== itemId);
    },
    clearWishlist: (state) => {
      return [];
    }
  }
});

export const wishlistActions = wishlistSlice.actions;

export default wishlistSlice;
