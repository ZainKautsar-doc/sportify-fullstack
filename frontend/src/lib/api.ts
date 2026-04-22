import { clearAuthStorage, getStoredToken } from './storage';

/**
 * Base URL for API requests.
 * MUST be set via VITE_API_URL environment variable in production.
 */
export const API = import.meta.env.VITE_API_URL || '';

if (!API && !import.meta.env.DEV) {
  console.warn('⚠️ [SPORTIFY] VITE_API_URL is NOT defined. API calls will likely fail (404). Check your environment settings.');
}

console.log('API BASE URL:', API || 'http://localhost:5000 (Fallback)');


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

