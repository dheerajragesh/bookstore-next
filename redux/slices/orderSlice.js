import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/url";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await api.post("/orders/place", orderData);

      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Place order failed"));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/my-orders");

      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch orders"));
    }
  }
);

export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/orders/getorder/${id}`);

      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch order"));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/orders/cancelorder/${id}`);

      thunkAPI.dispatch(fetchOrders());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Cancel failed"));
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    singleOrder: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.singleOrder = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
