import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/url";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/wishlist/getwishlist");

      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch wishlist"));
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (bookId, thunkAPI) => {
    try {
      const res = await api.post(`/wishlist/addwishlist/${bookId}`);

      await thunkAPI.dispatch(fetchWishlist()).unwrap();

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to add to wishlist"));
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (bookId, thunkAPI) => {
    try {
      const res = await api.delete(`/wishlist/removewishlist/${bookId}`);

      await thunkAPI.dispatch(fetchWishlist()).unwrap();

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to remove from wishlist"));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
