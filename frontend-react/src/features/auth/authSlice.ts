import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authApi, { type AuthUser, type LoginPayload, type RegisterPayload } from '@/api/authApi';
import { normalizeError } from '@/utils/errorUtils';
import { getItem, setItem, removeItem } from '@/utils/storage';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getItem<AuthUser>('user'),
  accessToken: getItem<string>('accessToken'),
  refreshToken: getItem<string>('refreshToken'),
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(payload);
      // data = { accessToken, refreshToken, user }
      return data;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(payload);
      // Backend returns the created User (no tokens), user needs to login after
      return data;
    } catch (err) {
      return rejectWithValue(normalizeError(err).message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      removeItem('user');
      removeItem('accessToken');
      removeItem('refreshToken');
    },
    clearError(state) {
      state.error = null;
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setItem('accessToken', action.payload.accessToken);
      setItem('refreshToken', action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        setItem('user', action.payload.user);
        setItem('accessToken', action.payload.accessToken);
        setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
        // Registration does not auto-login — user must login after
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
