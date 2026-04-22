import { clearAuthStorage, getStoredToken } from './storage';

/**
 * Base URL for API requests.
 * Taken from VITE_API_URL environment variable (Vercel/Railway compatible).
 */
export const API = import.meta.env.VITE_API_URL || '';

// Debug log for production connectivity check
if (import.meta.env.DEV) {
  console.log('[API] Base URL:', API || 'UNDEFINED (Check .env)');
} else {
  console.log('API BASE URL:', API);
}

export async function fetchWithAuth<T>(url: string | URL, options: RequestInit = {}) {
  const token = getStoredToken();
  
  // Construct full URL if it's a relative /api path
  let finalUrl = url;
  if (typeof url === 'string' && url.startsWith('/api')) {
    finalUrl = `${API}${url}`;
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized -> Auto Logout
  if (response.status === 401) {
    clearAuthStorage();
    throw new Error('Sesi berakhir atau tidak memiliki akses (Unauthorized)');
  }

  const data = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && data.error
        ? data.error
        : 'Ups, terjadi kesalahan pada server';
    throw new Error(message);
  }

  return data as T;
}

// Keep apiRequest as an alias for compatibility
export const apiRequest = fetchWithAuth;

