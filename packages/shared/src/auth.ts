/**
 * Shared authentication types used by both `apps/api` and `apps/web`.
 *
 * These interfaces define the canonical shapes for auth responses.
 * The API's class-based DTOs implement these interfaces; the web client
 * consumes them directly.
 */

/**
 * User profile shape returned by auth endpoints and `/auth/me`.
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string | Date;
}

/**
 * Auth response returned after login, register, or token refresh.
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}
