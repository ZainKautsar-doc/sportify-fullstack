import { useState, useEffect } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { API } from '@/src/lib/api';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';

interface LoginPageProps {
  onLogin: (email?: string, password?: string) => Promise<void>;
}

/** Inline Google logo SVG (no extra dependency needed) */
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.2 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.6-4.7l-6.3-5.2C29.4 35.7 26.8 36 24 36c-5.2 0-9.6-2.8-11.3-7l-6.5 5C9.6 39.6 16.3 44 24 44z" />
      <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.3 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z" />
    </svg>
  );
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchParams] = useSearchParams();

  // Show error if redirected back from a failed OAuth attempt
  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      setErrorMsg('Login dengan Google gagal. Silakan coba lagi.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await onLogin(email, password);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Login gagal');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  return (
    <div className="mx-auto w-full max-w-[420px] py-12 px-4">
      <Card className="relative overflow-hidden bg-white shadow-xl shadow-slate-200/50 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2d5e]/10 text-[#0f2d5e] mb-4">
            <LogIn size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Selamat Datang</h1>
          <p className="mt-2 text-sm text-slate-500">
            Silakan masuk untuk melanjutkan ke Sportify
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#0f2d5e] focus:bg-white focus:ring-1 focus:ring-[#0f2d5e]"
                placeholder="email@contoh.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#0f2d5e] focus:bg-white focus:ring-1 focus:ring-[#0f2d5e]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" fullWidth disabled={loading} className="mt-2 text-sm py-3 bg-[#0f2d5e] hover:bg-[#14407f]">
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>

          {/* Divider */}
          <div className="relative my-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">atau</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
          >
            <GoogleIcon />
            <span>Masuk dengan Google</span>
          </button>

          <div className="mt-4 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-[#0f2d5e] hover:underline">
              Daftar
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
