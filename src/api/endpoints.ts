/**
 * Every call the app makes, named and typed.
 *
 * The shapes below were read off the live API rather than assumed. Note the
 * snake_case: the server speaks it, so the types speak it too. Renaming at the
 * boundary would mean a second vocabulary to keep in step for no benefit.
 */
import { request } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
  role: string;
  full_name: string;
  phone_verified: boolean;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

/** What `GET /api/auth/me` returns once a token is attached. */
export interface Profile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  avatar_url: string | null;
  rating: number;
  is_verified: boolean;
  is_active: boolean;
  phone_verified: boolean;
  kyc_complete: boolean;
  nin_verified: boolean;
  bank_verified: boolean;
  corporate_id: number | null;
}

export const login = (body: LoginRequest): Promise<AuthSession> =>
  request<AuthSession>('/api/auth/login', { method: 'POST', body });

export const register = (body: RegisterRequest): Promise<AuthSession> =>
  request<AuthSession>('/api/auth/register', { method: 'POST', body });

export const refresh = (refresh_token: string): Promise<AuthSession> =>
  request<AuthSession>('/api/auth/refresh', { method: 'POST', body: { refresh_token } });

/**
 * Used on launch to decide whether a stored token is still good. A 401 here is
 * the honest answer to "am I still signed in", and cheaper than decoding the
 * JWT ourselves and trusting our own clock.
 */
export const me = (token: string): Promise<Profile> =>
  request<Profile>('/api/auth/me', { token });
