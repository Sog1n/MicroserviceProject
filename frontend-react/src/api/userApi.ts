import axiosClient from './axiosClient';
import type { AuthUser } from './authApi';

const userApi = {
  getById: (id: number) =>
    axiosClient.get<AuthUser>(`/api/users/${id}`),

  updateProfile: (id: number, data: Partial<AuthUser>) =>
    axiosClient.patch<AuthUser>(`/api/users/${id}`, data),

  search: (q?: string) =>
    axiosClient.get<AuthUser[]>('/api/users/search', { params: { q } }),

  changePassword: (_payload: { currentPassword: string; newPassword: string }) => {
    // Backend doesn't have a dedicated password-change endpoint yet
    // This is a placeholder for future implementation
    return Promise.reject(new Error('Password change not implemented on backend'));
  },
};

export default userApi;
