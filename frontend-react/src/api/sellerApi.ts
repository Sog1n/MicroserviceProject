import axiosClient from './axiosClient';
import type { Product } from './productApi';

// Seller endpoints — uses product-service routes
const sellerApi = {
  // GET /api/products/seller/:sellerId
  getProducts: (sellerId: number) =>
    axiosClient.get<Product[]>(`/api/products/seller/${sellerId}`),

  // POST /api/products
  createProduct: (product: Partial<Product>) =>
    axiosClient.post<Product>('/api/products', product),

  // PUT /api/products/:id
  updateProduct: (id: number | string, product: Partial<Product>) =>
    axiosClient.put<Product>(`/api/products/${id}`, product),

  // DELETE /api/products/:id
  deleteProduct: (id: number | string) =>
    axiosClient.delete(`/api/products/${id}`),

  // Orders for seller — backend doesn't have seller-specific order endpoint
  // This would need to be implemented; for now uses all orders
  getOrders: () =>
    axiosClient.get('/api/orders'),

  // PUT /api/orders/:id/status?status=...
  updateOrderStatus: (orderId: number | string, status: string) =>
    axiosClient.put(`/api/orders/${orderId}/status`, null, { params: { status } }),
};

export default sellerApi;
