'use client';

/**
 * AuthProvider and useAuth hook — WanderViet frontend auth state.
 * Design §6.2 — React Context with localStorage persistence.
 *
 * Security note: Storing tokens in localStorage is a demo-scope decision.
 * In production, prefer httpOnly cookies for refresh tokens.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, type UserProfile, type LoginRequest, type RegisterRequest } from '@/lib/api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/api/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

/**
 * Parse the expiry timestamp (ms) from a JWT access token.
 * Returns null if the token is malformed.
 */
function getTokenExpiry(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const part = parts[1];
    if (!part) return null;
    const payload = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(payload)) as { exp?: number };
    if (typeof json.exp !== 'number') return null;
    return json.exp * 1000;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      authApi
        .getMe()
        .then((res) => {
          if (res.success) {
            setUser(res.data);
          } else {
            clearTokens();
          }
        })
        .catch(() => clearTokens())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh interval (every 5 min, refresh when < 3 min remaining)
  useEffect(() => {
    const interval = setInterval(
      () => {
        const token = getAccessToken();
        if (!token) return;

        const expiry = getTokenExpiry(token);
        const THREE_MINUTES = 3 * 60 * 1000;

        if (expiry !== null && expiry - Date.now() < THREE_MINUTES) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) return;

          authApi
            .refresh(refreshToken)
            .then((res) => {
              if (res.success) {
                setTokens(res.data.accessToken, res.data.refreshToken);
                setUser(res.data.user);
              } else {
                clearTokens();
                setUser(null);
              }
            })
            .catch(() => {
              clearTokens();
              setUser(null);
            });
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  // Actions

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    if (res.success) {
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await authApi.register(data);
    if (res.success) {
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }
    clearTokens();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const res = await authApi.updateMe(data);
    if (res.success) {
      setUser(res.data);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.getMe();
    if (res.success) {
      setUser(res.data);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'STAFF' || user?.role === 'ADMIN',
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
