import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, LogOut, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, User } from '@/src/types/domain';
import { fetchWithAuth } from '@/src/lib/api';
import { formatDateLabel } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import Badge from '@/src/components/ui/Badge';
import Skeleton from '@/src/components/ui/Skeleton';
import EmptyState from '@/src/components/ui/EmptyState';
import ErrorState from '@/src/components/ui/ErrorState';

interface UserProfilePageProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfilePage({ user, onLogout }: UserProfilePageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<Booking[]>('/api/bookings');
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    void loadProfileStats();
  }, [loadProfileStats]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed').length;
    const history = bookings.filter((booking) => booking.status === 'rejected' || booking.status === 'completed').length;
    return { total, active, history };
  }, [bookings]);

  const recentBookings = useMemo(() => bookings.slice(0, 4), [bookings]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Card className="space-y-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </Card>
        <Card className="space-y-3">
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadProfileStats()} />;
  }

  return (
    <div className="space-y-5 pb-16">
      <Card className="relative overflow-hidden border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="pointer-events-none absolute -right-12 -top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <UserRound size={30} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500">Profil Saya</p>
              <Badge variant="neutral" className="mt-2">
                Role: User
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                toast('Fitur edit profil akan segera hadir');
              }}
            >
              <Edit3 size={15} />
              Edit Profil
            </Button>
            <Button variant="secondary" size="sm" onClick={onLogout}>
              <LogOut size={15} />
              Logout
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Booking" value={stats.total} />
        <StatCard label="Booking Aktif" value={stats.active} />
        <StatCard label="Riwayat Booking" value={stats.history} />
      </div>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Aktivitas Terbaru</h2>
        {recentBookings.length === 0 ? (
          <EmptyState title="Belum ada booking nih 😅" description="Mulai booking lapangan pertama kamu dan riwayat akan tampil di sini." />
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                <div>
                  <p className="font-semibold text-slate-900">{booking.field_name}</p>
                  <p className="text-sm text-slate-500">{formatDateLabel(booking.booking_date)}</p>
                  <p className="text-xs text-slate-500">
                    {booking.start_time} - {booking.end_time}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-slate-200 bg-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  if (status === 'pending') return <Badge variant="pending">Pending</Badge>;
  if (status === 'confirmed') return <Badge variant="confirmed">Confirmed</Badge>;
  if (status === 'rejected') return <Badge variant="rejected">Rejected</Badge>;
  return <Badge variant="neutral">Completed</Badge>;
}
