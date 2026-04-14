import axiosClient from './axiosClient';
import type { AuthUser } from './authApi';

// Admin endpoints — actual backend routes
const adminApi = {
  // GET /api/admin/users — list all users (requires ADMIN role)
  getAllUsers: () =>
    axiosClient.get<AuthUser[]>('/api/admin/users'),

  // DELETE /api/admin/users/:id
  deleteUser: (id: number) =>
    axiosClient.delete<{ message: string }>(`/api/admin/users/${id}`),

  // Admin uses product-service endpoints for moderation
  getPendingProducts: () =>
    axiosClient.get('/api/products/status/PENDING'),

  getAllProducts: () =>
    axiosClient.get('/api/products'),

  moderateProduct: (productId: number | string, action: 'APPROVE' | 'REJECT') => {
    const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    return axiosClient.patch(`/api/products/${productId}/status`, { status });
  },

  deleteProduct: (id: number) =>
    axiosClient.delete(`/api/products/${id}`),

  // Admin: get all orders
  getAllOrders: () =>
    axiosClient.get('/api/orders'),

  // Not a real backend endpoint – stats would need to be computed client-side
  // or added to backend later. For now, derive from user/product/order lists.
  updateUserStatus: (_userId: string, _status: 'ACTIVE' | 'SUSPENDED') => {
    // Backend doesn't support status field on User yet
    return Promise.reject(new Error('User status management not implemented on backend'));
  },
};

export default adminApi;
