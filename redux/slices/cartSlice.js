import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/url";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/cart/get");

      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch cart"));
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, product, quantity }, thunkAPI) => {
    try {
      const resolvedProductId = productId || product;

      const res = await api.post("/cart/add", {
        productId: resolvedProductId,
        quantity,
      });

      thunkAPI.dispatch(fetchCart());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Add to cart failed"));
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ bookId, quantity }, thunkAPI) => {
    try {
      const res = await api.put(`/cart/update/${bookId}`, { quantity });

      thunkAPI.dispatch(fetchCart());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Update failed"));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (bookId, thunkAPI) => {
    try {
      const res = await api.delete(`/cart/remove/${bookId}`);

      thunkAPI.dispatch(fetchCart());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Remove failed"));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
