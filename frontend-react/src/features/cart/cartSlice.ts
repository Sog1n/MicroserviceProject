import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import STORAGE_KEYS, { getItem, setItem } from '@/utils/storage';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  sellerId?: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: getItem<CartItem[]>(STORAGE_KEYS.CART) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock);
      } else {
        state.items.push(action.payload);
      }
      setItem(STORAGE_KEYS.CART, state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      setItem(STORAGE_KEYS.CART, state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
      setItem(STORAGE_KEYS.CART, state.items);
    },
    clearCart(state) {
      state.items = [];
      setItem(STORAGE_KEYS.CART, []);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
