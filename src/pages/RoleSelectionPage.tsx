import { useState } from 'react';
import { ShieldCheck, UserRound, Sparkles } from 'lucide-react';
import type { UserRole } from '@/src/types/domain';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => Promise<void>;
}

export default function RoleSelectionPage({ onSelectRole }: RoleSelectionPageProps) {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const pickRole = async (role: UserRole) => {
    setLoadingRole(role);
    await onSelectRole(role);
    setLoadingRole(null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 p-8 text-white">
        <div className="pointer-events-none absolute -right-10 -top-8 h-40 w-40 rounded-full bg-white/20 blur-xl" />
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Sparkles size={14} />
            5 detik lagi main
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold">Pilih mode kamu dulu, yuk</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">
            Biar alurnya pas, pilih dulu mau masuk sebagai User atau Admin. User akan masuk ke Beranda, sedangkan Admin langsung ke Dashboard.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card hoverable className="space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <UserRound size={26} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Masuk sebagai User</h2>
            <p className="mt-1 text-sm text-slate-500">Buat kamu yang mau booking lapangan, upload pembayaran, dan cek jadwal main.</p>
          </div>
          <Button fullWidth onClick={() => void pickRole('user')} disabled={loadingRole !== null}>
            {loadingRole === 'user' ? 'Sebentar, siapin akun...' : 'Yuk jadi User'}
          </Button>
        </Card>

        <Card hoverable className="space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Masuk sebagai Admin</h2>
            <p className="mt-1 text-sm text-slate-500">Kelola booking, validasi pembayaran, dan pantau performa venue mingguan.</p>
          </div>
          <Button variant="secondary" fullWidth onClick={() => void pickRole('admin')} disabled={loadingRole !== null}>
            {loadingRole === 'admin' ? 'Sebentar, buka dashboard...' : 'Masuk Admin'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
