import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  setStoredToken,
  setStoredUser,
  setStoredRole,
} from '@/src/lib/storage';
import type { User } from '@/src/types/domain';

/**
 * Landing page after Google OAuth redirect.
 * URL format: /oauth-success?token=JWT_TOKEN
 *
 * Decodes the JWT payload to get user info, persists everything to
 * localStorage, then redirects to the appropriate dashboard.
 */
export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Token tidak ditemukan. Silakan coba login kembali.');
      setTimeout(() => navigate('/login?error=oauth_failed'), 2000);
      return;
    }

    try {
      // Decode JWT payload (base64) – no signature verification needed on client
      const base64Payload = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Payload)) as {
        id: number;
        email: string;
        role: 'user' | 'admin';
        iat?: number;
        exp?: number;
      };

      if (!decoded.id || !decoded.email || !decoded.role) {
        throw new Error('Payload tidak valid');
      }

      // We only have id/email/role from the JWT payload.
      // Build a minimal User object; name will be refreshed from profile fetch if needed.
      const user: User = {
        id: decoded.id,
        name: decoded.email.split('@')[0], // placeholder until re-fetched
        email: decoded.email,
        role: decoded.role,
      };

      // ---------- persist to localStorage ----------
      setStoredToken(token);
      setStoredUser(user);
      setStoredRole(decoded.role);

      // Reload page so useAuth() picks up the new localStorage values
      // then navigate to correct dashboard
      const destination = decoded.role === 'admin' ? '/admin' : '/';
      // Use replace so user can't back-navigate to this ephemeral page
      window.location.replace(destination);
    } catch {
      setError('Gagal memproses login Google. Silakan coba lagi.');
      setTimeout(() => navigate('/login?error=oauth_failed'), 2500);
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center text-red-600 text-sm max-w-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f2d5e]/20 border-t-[#0f2d5e]" />
      <p className="text-sm text-slate-500">Memproses login Google…</p>
    </div>
  );
}
