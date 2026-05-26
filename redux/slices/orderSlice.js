import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/url";

// ======================================
// PLACE ORDER
// ======================================
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await api.post("/orders/place", orderData);
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Place order failed")
      );
    }
  }
);

// ======================================
// FETCH USER ORDERS
// ======================================
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/my-orders");
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to fetch orders")
      );
    }
  }
);

// ======================================
// FETCH SINGLE ORDER
// ======================================
export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/orders/getorder/${id}`);
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to fetch order")
      );
    }
  }
);

// ======================================
// CANCEL ORDER
// ======================================
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(
        `/orders/cancelorder/${id}`
      );

      thunkAPI.dispatch(fetchOrders());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Cancel failed")
      );
    }
  }
);

// ======================================
// FETCH SELLER ORDERS
// ======================================
export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchSellerOrders",
  async (_, thunkAPI) => {
    try {
      const res = await api.get(
        "/orders/seller-orders"
      );

      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          err,
          "Failed to fetch seller orders"
        )
      );
    }
  }
);

// ======================================
// UPDATE ORDER STATUS (FIXED)
// ======================================
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      // ✅ FIX: backend expects orderStatus, NOT status
      const res = await api.patch(
        `/orders/updatestatus/${orderId}`,
        {
          orderStatus: status,
        }
      );

      thunkAPI.dispatch(fetchSellerOrders());

      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          err,
          "Failed to update order status"
        )
      );
    }
  }
);

// ======================================
// SLICE
// ======================================
const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    sellerOrders: [],
    singleOrder: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH ORDERS
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

      // SINGLE ORDER
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.singleOrder = action.payload;
      })

      // PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.orders.push(action.payload);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL ORDER
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
      })

      // SELLER ORDERS
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE ORDER STATUS (OPTIMIZED)
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        // optional optimization instead of full refetch
        if (action.payload) {
          const index = state.sellerOrders.findIndex(
            (o) => o._id === action.payload._id
          );

          if (index !== -1) {
            state.sellerOrders[index] = action.payload;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;