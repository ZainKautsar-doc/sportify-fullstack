import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, Payment, User } from '@/src/types/domain';
import { fetchWithAuth } from '@/src/lib/api';
import { formatDateLabel } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import Skeleton from '@/src/components/ui/Skeleton';
import EmptyState from '@/src/components/ui/EmptyState';
import ErrorState from '@/src/components/ui/ErrorState';

interface UserSchedulePageProps {
  user: User;
}

type TabMode = 'aktif' | 'riwayat';

export default function UserSchedulePage({ user }: UserSchedulePageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabMode>('aktif');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [paymentMap, setPaymentMap] = useState<Record<number, Payment | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<Booking[]>('/api/bookings');
      setBookings(data);

      const pendingBookings = data.filter((booking) => booking.status === 'pending');
      const paymentPairs = await Promise.all(
        pendingBookings.map(async (booking) => {
          try {
            const payment = await fetchWithAuth<Payment>(`/api/payments/${booking.id}`);
            return [booking.id, payment] as const;
          } catch {
            return [booking.id, null] as const;
          }
        }),
      );

      setPaymentMap(Object.fromEntries(paymentPairs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    if (tab === 'aktif') {
      return bookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed');
    }
    return bookings.filter((booking) => booking.status === 'rejected' || booking.status === 'completed');
  }, [bookings, tab]);

  const cancelBooking = async (bookingId: number) => {
    if (!window.confirm('Yakin mau batalin booking ini?')) return;
    try {
      await fetchWithAuth(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      toast.success('Booking berhasil dibatalkan');
      await loadBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="space-y-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-full" />
        </Card>
        <Card className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadBookings()} />;
  }

  return (
    <div className="space-y-5 pb-16">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Jadwal Kamu</h1>
            <p className="text-sm text-slate-500">Pantau booking aktif dan riwayat main kamu di sini.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/booking')}>
            Booking Lagi
          </Button>
        </div>

        <div className="inline-flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab('aktif')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'aktif' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Aktif
          </button>
          <button
            type="button"
            onClick={() => setTab('riwayat')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'riwayat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Riwayat
          </button>
        </div>
      </Card>

      {filteredBookings.length === 0 ? (
        <EmptyState
          title="Belum ada booking nih 😅"
          description="Yuk pilih lapangan favoritmu dan mulai booking pertamamu."
          action={<Button onClick={() => navigate('/booking')}>Cari Lapangan</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredBookings.map((booking) => {
            const payment = paymentMap[booking.id];
            const canPay = booking.status === 'pending' && !payment;
            const hasPaymentProof = booking.status === 'pending' && Boolean(payment);
            return (
              <Card key={booking.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900">{booking.field_name}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                      <CalendarDays size={14} />
                      {formatDateLabel(booking.booking_date)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{booking.start_time} - {booking.end_time}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                {hasPaymentProof ? (
                  <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                    Bukti pembayaran sudah terkirim. Lagi dicek admin ya 👀
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {canPay ? (
                    <Button size="sm" onClick={() => navigate(`/payment/${booking.id}`)}>
                      Bayar
                    </Button>
                  ) : null}

                  {booking.status === 'pending' ? (
                    <Button size="sm" variant="secondary" onClick={() => void cancelBooking(booking.id)}>
                      Batal
                    </Button>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  if (status === 'confirmed') {
    return (
      <Badge variant="confirmed" className="gap-1">
        <CheckCircle2 size={13} />
        Confirmed
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge variant="rejected" className="gap-1">
        <XCircle size={13} />
        Rejected
      </Badge>
    );
  }
  if (status === 'completed') {
    return <Badge variant="neutral">Completed</Badge>;
  }
  return (
    <Badge variant="pending" className="gap-1">
      <Clock3 size={13} />
      Pending
    </Badge>
  );
}
