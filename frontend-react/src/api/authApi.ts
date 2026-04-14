import axiosClient from './axiosClient';

// ── Types matching actual Java backend ──────────────────
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  fullName: string;
  address: string | null;
  role: 'USER' | 'ADMIN' | 'SELLER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role?: string;
}

const authApi = {
  login: (payload: LoginPayload) =>
    axiosClient.post<AuthResponse>('/api/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosClient.post<AuthUser>('/api/auth/register', payload),

  googleAuth: (idToken: string) =>
    axiosClient.post<AuthResponse>('/api/auth/google', { idToken }),

  sendOtp: (loginKey: string) =>
    axiosClient.post<{ message: string }>('/api/auth/otp/send', { loginKey }),

  verifyOtp: (loginKey: string, code: string) =>
    axiosClient.post<{ message: string }>('/api/auth/otp/verify', { loginKey, code }),
};

export default authApi;
