'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
}

const USER_STORAGE_KEY = 'march_coffee_user';
const TOKEN_STORAGE_KEY = 'march_coffee_token';

const DEFAULT_USER: AuthUser = {
  id: 'USR-ADMIN',
  username: 'admin',
  name: 'แอดมินสุดเท่',
  role: 'ADMIN',
};

const DEFAULT_SESSION: AuthSession = {
  user: DEFAULT_USER,
  token: null,
  isAuthenticated: false,
};

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('march_auth_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('march_auth_change', callback);
  };
}

let cachedSession: AuthSession = DEFAULT_SESSION;
let lastRawUser: string | null = null;
let lastRawToken: string | null = null;

function getSnapshot(): AuthSession {
  if (typeof window === 'undefined') return DEFAULT_SESSION;
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    const rawToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (rawUser !== lastRawUser || rawToken !== lastRawToken) {
      lastRawUser = rawUser;
      lastRawToken = rawToken;

      const parsedUser = rawUser ? (JSON.parse(rawUser) as AuthUser) : DEFAULT_USER;
      cachedSession = {
        user: parsedUser,
        token: rawToken,
        isAuthenticated: !!rawToken,
      };
    }
    return cachedSession;
  } catch {
    return DEFAULT_SESSION;
  }
}

function getServerSnapshot(): AuthSession {
  return DEFAULT_SESSION;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthSession(user: AuthUser, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    document.cookie = `march_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `march_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;

    window.dispatchEvent(new Event('march_auth_change'));
  } catch (e) {
    console.error('Failed to store auth session:', e);
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    document.cookie = 'march_token=; path=/; max-age=0';
    document.cookie = 'march_user=; path=/; max-age=0';

    window.dispatchEvent(new Event('march_auth_change'));
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

// Backward compatibility alias
export const setStoredUser = (user: AuthUser, token?: string) => {
  if (token) {
    setAuthSession(user, token);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('march_auth_change'));
    }
  }
};

export const clearStoredUser = clearAuthSession;

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function useAuthUser() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const logout = useCallback(() => {
    clearAuthSession();
    router.push('/login');
  }, [router]);

  return {
    user: session.user,
    token: session.token,
    isAuthenticated: session.isAuthenticated,
    logout,
  };
}
