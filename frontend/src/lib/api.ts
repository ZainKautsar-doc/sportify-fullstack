import { clearAuthStorage, getStoredToken } from './storage';

export async function fetchWithAuth<T>(url: string | URL, options: RequestInit = {}) {
  const token = getStoredToken();
  console.log('[fetchWithAuth] sending token:', token);
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized -> Auto Logout
  if (response.status === 401) {
    clearAuthStorage();
    // Use window.location as we're outside React's context here usually
    // or just let it be handled by the next UI render if we use state.
    // Setting href is a sure way to reset everything.
    window.location.href = '/login?error=session_expired';
    throw new Error('Sesi berakhir, silakan login kembali');
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

// Keep apiRequest as an alias for compatibility during migration if needed,
// but let's shift to fetchWithAuth as requested.
export const apiRequest = fetchWithAuth;
