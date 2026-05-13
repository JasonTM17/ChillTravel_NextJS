import type { ApiSuccess, UserProfile, AuthResponse } from '@vietwander/shared';
import { api } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { UserProfile, AuthResponse } from '@vietwander/shared';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

export const authApi = {
  login: (data: LoginRequest) => api.post<ApiSuccess<AuthResponse>>('/auth/login', data),

  register: (data: RegisterRequest) => api.post<ApiSuccess<AuthResponse>>('/auth/register', data),

  refresh: (refreshToken: string) =>
    api.post<ApiSuccess<AuthResponse>>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post<ApiSuccess<{ revoked: boolean }>>('/auth/logout', { refreshToken }),

  getMe: () => api.get<ApiSuccess<UserProfile>>('/auth/me'),

  updateMe: (data: Partial<UserProfile>) => api.put<ApiSuccess<UserProfile>>('/auth/me', data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put<ApiSuccess<{ changed: boolean }>>('/auth/change-password', data),

  forgotPassword: (data: { email: string }) =>
    api.post<ApiSuccess<{ sent: boolean }>>('/auth/forgot-password', data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post<ApiSuccess<{ reset: boolean }>>('/auth/reset-password', data),

  verifyEmail: (token: string) =>
    api.get<ApiSuccess<{ verified: boolean }>>('/auth/verify-email', { token }),

  resendVerification: () => api.post<ApiSuccess<{ sent: boolean }>>('/auth/resend-verification'),
};
