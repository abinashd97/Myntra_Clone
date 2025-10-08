import {configureStore} from "@reduxjs/toolkit";
import itemsSlice from "./itemsSlice";
import fetchStatusSlice from "./fetchStatusSlice";
import bagSlice from "./bagSlice";
import authSlice from "./authSlice";
import wishlistSlice from "./wishlistSlice";

const myntraStore = configureStore({
  reducer: {
    items: itemsSlice.reducer,
    fetchStatus: fetchStatusSlice.reducer,
    bag: bagSlice.reducer,
    auth: authSlice.reducer,
    wishlist: wishlistSlice.reducer,
  }
});

export default myntraStore;