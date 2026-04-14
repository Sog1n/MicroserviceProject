import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '@/api/adminApi';
import type { AuthUser } from '@/api/authApi';
import type { Product } from '@/api/productApi';
import type { Order } from '@/api/orderApi';
import { normalizeError } from '@/utils/errorUtils';

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface AdminState {
  stats: AdminStats | null;
  users: AuthUser[];
  pendingProducts: Product[];
  products: Product[];
  recentOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  pendingProducts: [],
  products: [],
  recentOrders: [],
  loading: false,
  error: null,
};

export const fetchAdminAllProducts = createAsyncThunk(
  'admin/fetchAllProducts',
  async () => {
    const { data } = await adminApi.getAllProducts();
    return Array.isArray(data) ? data : [];
  },
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_params?: { search?: string }) => {
    const { data } = await adminApi.getAllUsers();
    const users = Array.isArray(data) ? data : [];
    if (_params?.search) {
      const q = _params.search.toLowerCase();
      return users.filter((u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q)
      );
    }
    return users;
  },
);

export const fetchPendingProducts = createAsyncThunk(
  'admin/fetchPendingProducts',
  async () => {
    const { data } = await adminApi.getPendingProducts();
    return Array.isArray(data) ? data : [];
  },
);

// Stats derived from real data fetches
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.allSettled([
        adminApi.getAllUsers(),
        adminApi.getAllProducts(), // just to count products
        adminApi.getAllOrders(),
      ]);

      const users = usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : []) : [];
      const products = productsRes.status === 'fulfilled' ? (Array.isArray(productsRes.value.data) ? productsRes.value.data : []) : [];
      const orders = ordersRes.status === 'fulfilled' ? (Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []) : [];

      return {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: orders.reduce((sum: number, o: Order) => sum + (o.totalAmount ?? 0), 0),
      } as AdminStats;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchAdminRecentOrders = createAsyncThunk(
  'admin/fetchRecentOrders',
  async (_params?: { size?: number }) => {
    const { data } = await adminApi.getAllOrders();
    const orders = Array.isArray(data) ? data : [];
    // Sort by date desc and take recent N
    return orders
      .sort((a: Order, b: Order) => (b.orderDate ?? '').localeCompare(a.orderDate ?? ''))
      .slice(0, _params?.size ?? 5);
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state) => { state.loading = false; });

    builder.addCase(fetchPendingProducts.fulfilled, (state, action) => {
      state.pendingProducts = action.payload;
    });

    builder.addCase(fetchAdminAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });

    builder
      .addCase(fetchAdminStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchAdminRecentOrders.fulfilled, (state, action) => {
      state.recentOrders = action.payload;
    });
  },
});

export default adminSlice.reducer;
