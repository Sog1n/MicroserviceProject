import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import productReducer from '@/features/products/productSlice';
import cartReducer from '@/features/cart/cartSlice';
import orderReducer from '@/features/orders/orderSlice';
import adminReducer from '@/features/admin/adminSlice';
import sellerReducer from '@/features/seller/sellerSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    admin: adminReducer,
    seller: sellerReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
