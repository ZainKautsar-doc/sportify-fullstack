import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';

interface LoginPageProps {
  onLogin: (email?: string, password?: string) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

          <div className="mt-6 text-center text-sm text-slate-500">
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
