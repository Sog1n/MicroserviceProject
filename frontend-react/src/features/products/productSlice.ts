import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi, { type Product } from '@/api/productApi';
import { normalizeError } from '@/utils/errorUtils';

interface ProductState {
  items: Product[];
  current: Product | null;
  categories: { id: number; name: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  current: null,
  categories: [],
  loading: false,
  error: null,
};

// Backend returns a plain array — we handle filtering/sorting client-side
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_params: { page?: number; size?: number; search?: string; sortBy?: string } | undefined, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getAll();
      return data; // Product[]
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getCategories();
      return data;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns a plain array
        const data = action.payload;
        state.items = Array.isArray(data) ? data : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = Array.isArray(action.payload) ? action.payload : [];
    });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
