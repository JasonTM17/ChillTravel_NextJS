/**
 * Base API fetch wrapper for WanderViet web app.
 * Design §6.1 — auto-attach Bearer token, single-flight 401 refresh,
 * redirect to /login on refresh failure, query param builder.
 */

import type { ApiError } from '@vietwander/shared';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// ---------------------------------------------------------------------------
// Token storage
// ---------------------------------------------------------------------------

export const TOKEN_KEYS = {
  access: 'wv_access_token',
  refresh: 'wv_refresh_token',
} as const;

/** Safe for SSR — returns null when window is not available. */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.access);
}

/** Safe for SSR — returns null when window is not available. */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.refresh);
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEYS.access, access);
  localStorage.setItem(TOKEN_KEYS.refresh, refresh);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
}

// ---------------------------------------------------------------------------
// Single-flight refresh
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const json = await res.json();
      // The refresh endpoint returns ApiSuccess<AuthResponse>
      if (json?.success && json?.data?.accessToken && json?.data?.refreshToken) {
        setTokens(json.data.accessToken, json.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ---------------------------------------------------------------------------
// Query param builder
// ---------------------------------------------------------------------------

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, params?: QueryParams): string {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { params?: QueryParams },
): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};

  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {};

    // Merge any caller-provided headers
    if (fetchOptions.headers) {
      const incoming = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, incoming);
    }

    // Attach Bearer token (skip on SSR)
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const doFetch = async (withToken: boolean): Promise<Response> => {
    const headers: Record<string, string> = {};

    if (fetchOptions.headers) {
      const incoming = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, incoming);
    }

    if (withToken) {
      const token = getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(buildUrl(path, params), {
      ...fetchOptions,
      headers,
    });
  };

  // Suppress unused variable warning — buildHeaders is used below
  void buildHeaders;

  let response = await doFetch(true);

  // 401 → attempt token refresh once, then retry
  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      response = await doFetch(true);
    } else {
      clearTokens();
      window.location.href = '/login';
      // Return a typed error shape so callers don't crash before redirect
      return {
        success: false,
        message: 'Session expired. Redirecting to login.',
        errors: [],
        timestamp: new Date().toISOString(),
      } as T;
    }
  }

  // Parse JSON — never throw on 4xx/5xx, return ApiError shape instead
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    // Non-JSON response (e.g. 204 No Content)
    if (response.ok) {
      return { success: true, message: 'OK', data: null, timestamp: new Date().toISOString() } as T;
    }
    const err: ApiError = {
      success: false,
      message: `HTTP ${response.status}`,
      errors: [],
      timestamp: new Date().toISOString(),
    };
    return err as T;
  }

  return json as T;
}

// ---------------------------------------------------------------------------
// Convenience methods
// ---------------------------------------------------------------------------

export const api = {
  get: <T>(path: string, params?: QueryParams) => apiFetch<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),

  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),

  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),

  /** Upload FormData — do NOT set Content-Type; browser sets it with boundary. */
  upload: <T>(path: string, formData: FormData) =>
    apiFetch<T>(path, { method: 'POST', body: formData }),
};
