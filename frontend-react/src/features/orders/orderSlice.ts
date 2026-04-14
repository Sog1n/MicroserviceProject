import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi, { type Order, type CreateOrderPayload } from '@/api/orderApi';
import { normalizeError } from '@/utils/errorUtils';
import type { RootState } from '@/app/store';

interface OrderState {
  items: Order[];
  current: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

// Fetch orders for the logged-in user
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      if (!userId) return [];
      const { data } = await orderApi.getByUserId(userId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      // Backend doesn't have GET /api/orders/:id — we fetch all user orders and find
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      if (!userId) return null;
      const { data } = await orderApi.getByUserId(userId);
      const orders = Array.isArray(data) ? data : [];
      return orders.find((o) => String(o.id) === id) || null;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.create(payload);
      return data;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId: number, { rejectWithValue }) => {
    try {
      await orderApi.delete(orderId);
      return orderId;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state) => { state.loading = false; });

    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.items = state.items.filter((o) => o.id !== action.payload);
    });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
