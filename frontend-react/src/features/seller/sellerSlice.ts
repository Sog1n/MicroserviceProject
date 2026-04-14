import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerApi from '@/api/sellerApi';
import orderApi, { type Order } from '@/api/orderApi';
import type { Product } from '@/api/productApi';
import { normalizeError } from '@/utils/errorUtils';
import type { RootState } from '@/app/store';

interface SellerStats {
  totalProducts: number;
  totalSold: number;
  totalRevenue: number;
  lowStockCount: number;
}

interface SellerState {
  stats: SellerStats | null;
  products: Product[];
  orders: Order[];
  lowStockProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerState = {
  stats: null,
  products: [],
  orders: [],
  lowStockProducts: [],
  loading: false,
  error: null,
};

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sellerId = state.auth.user?.id;
      if (!sellerId) return [];
      const { data } = await sellerApi.getProducts(sellerId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchSellerStats = createAsyncThunk(
  'seller/fetchStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sellerId = state.auth.user?.id;
      if (!sellerId) return { totalProducts: 0, totalSold: 0, totalRevenue: 0, lowStockCount: 0 };

      const { data: products } = await sellerApi.getProducts(sellerId);
      const prods = Array.isArray(products) ? products : [];

      return {
        totalProducts: prods.length,
        totalSold: prods.reduce((sum, p) => sum + (p.sold ?? 0), 0),
        totalRevenue: prods.reduce((sum, p) => sum + (p.price ?? 0) * (p.sold ?? 0), 0),
        lowStockCount: prods.filter((p) => (p.stockQuantity ?? 0) < 10).length,
      } as SellerStats;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchOrders',
  async (_params: { size?: number } | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const sellerId = state.auth.user?.id;
      if (!sellerId) return [];

      const { data } = await orderApi.getBySellerId(sellerId);
      const orders = Array.isArray(data) ? data : [];
      if (_params?.size) return orders.slice(0, _params.size);
      return orders;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchLowStockProducts = createAsyncThunk(
  'seller/fetchLowStock',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const sellerId = state.auth.user?.id;
    if (!sellerId) return [];
    const { data } = await sellerApi.getProducts(sellerId);
    const prods = Array.isArray(data) ? data : [];
    return prods.filter((p) => (p.stockQuantity ?? 0) < 10);
  },
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchSellerStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSellerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchSellerOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });

    builder.addCase(fetchLowStockProducts.fulfilled, (state, action) => {
      state.lowStockProducts = action.payload;
    });
  },
});

export default sellerSlice.reducer;
