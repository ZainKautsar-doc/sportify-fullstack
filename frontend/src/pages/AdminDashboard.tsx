import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { format, subDays } from 'date-fns';
import { CheckCircle2, Clock3, Eye, Plus, TrendingUp, Wallet, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminStats, Booking, Field } from '@/src/types/domain';
import { apiRequest } from '@/src/lib/api';
import { formatCurrency } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import Modal from '@/src/components/ui/Modal';
import Skeleton from '@/src/components/ui/Skeleton';
import EmptyState from '@/src/components/ui/EmptyState';
import ErrorState from '@/src/components/ui/ErrorState';
import AdminCalendar from '@/src/components/admin/calendar/AdminCalendar';

const INITIAL_FORM = { name: '', type: 'Futsal', price_per_hour: '' };

interface NewFieldForm {
  name: string;
  type: string;
  price_per_hour: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'fields'>('bookings');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [newField, setNewField] = useState<NewFieldForm>(INITIAL_FORM);
  const [submittingField, setSubmittingField] = useState(false);
  const canUseDummyCalendar = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, bookingsData, fieldsData] = await Promise.all([
        apiRequest<AdminStats>('/api/admin/stats'),
        apiRequest<Booking[]>('/api/bookings'),
        apiRequest<Field[]>('/api/fields'),
      ]);
      setStats(statsData);
      setBookings(bookingsData);
      setFields(fieldsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAllData();
  }, [fetchAllData]);

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => subDays(new Date(), 6 - index));
    return days.map((date) => {
      const key = format(date, 'yyyy-MM-dd');
      const count = bookings.filter((booking) => booking.booking_date === key).length;
      return { label: format(date, 'EEE'), count };
    });
  }, [bookings]);

  const maxWeeklyCount = Math.max(...weeklyData.map((item) => item.count), 1);

  const updateStatus = async (bookingId: number, status: Booking['status']) => {
    try {
      await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking diubah ke ${status}`);
      await fetchAllData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    }
  };

  const openPaymentProof = async (bookingId: number) => {
    try {
      const payment = await apiRequest<{ proof_url: string }>(`/api/payments/${bookingId}`);
      setSelectedProof(payment.proof_url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bukti pembayaran belum tersedia');
    }
  };

  const addField = async (event: FormEvent) => {
    event.preventDefault();
    if (!newField.name || !newField.price_per_hour) {
      toast.error('Nama dan harga lapangan wajib diisi');
      return;
    }

    setSubmittingField(true);
    try {
      await apiRequest('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue_id: 1,
          name: newField.name,
          type: newField.type,
          price_per_hour: Number(newField.price_per_hour),
        }),
      });
      toast.success('Lapangan berhasil ditambahkan');
      setNewField(INITIAL_FORM);
      await fetchAllData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setSubmittingField(false);
    }
  };

  const deleteField = async (fieldId: number) => {
    if (!window.confirm('Yakin mau hapus lapangan ini?')) return;
    try {
      await apiRequest(`/api/fields/${fieldId}`, { method: 'DELETE' });
      toast.success('Lapangan dihapus');
      await fetchAllData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Card className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-20 w-full" />
        </Card>
        <AdminCalendar bookings={[]} isLoading />
      </div>
    );
  }

  if (error || !stats) {
    return <ErrorState message={error ?? 'Ups, coba lagi ya'} onRetry={() => void fetchAllData()} />;
  }

  return (
    <div className="space-y-6 pb-16">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-7 text-white">
        <div className="pointer-events-none absolute -right-12 top-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">Admin command center</p>
            <h1 className="font-display text-3xl font-bold">Dashboard Sportify</h1>
            <p className="mt-2 text-sm text-white/80">Monitor booking mingguan, verifikasi pembayaran, dan kelola lapangan.</p>
          </div>
          <div className="inline-flex rounded-2xl bg-white/10 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'bookings' ? 'bg-white text-slate-900' : 'text-white/80'
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'fields' ? 'bg-white text-slate-900' : 'text-white/80'
              }`}
            >
              Lapangan
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Total Booking" value={String(stats.totalBookings)} icon={<CalendarWidget />} tone="primary" />
        <StatsCard title="Pending" value={String(stats.pendingBookings)} icon={<Clock3 size={20} />} tone="warning" />
        <StatsCard title="Revenue" value={formatCurrency(stats.revenue)} icon={<Wallet size={20} />} tone="success" />
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">Performa Mingguan</h2>
          <Badge variant="neutral">7 hari terakhir</Badge>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyData.map((item) => (
            <div key={item.label} className="space-y-2 text-center">
              <div className="flex h-28 items-end justify-center rounded-2xl bg-slate-100 p-2">
                <div
                  className="w-8 rounded-xl bg-gradient-to-t from-indigo-600 to-blue-500 transition-all"
                  style={{ height: `${Math.max((item.count / maxWeeklyCount) * 100, 8)}%` }}
                  title={`${item.count} booking`}
                />
              </div>
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="text-sm font-bold text-slate-800">{item.count}</p>
            </div>
          ))}
        </div>
      </Card>

      {activeTab === 'bookings' ? (
        <div className="space-y-6">
          <AdminCalendar bookings={bookings} isLoading={isLoading} enableDummyPreview={bookings.length === 0 && canUseDummyCalendar} />
          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-display text-xl font-bold text-slate-900">Daftar Booking</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="p-8">
                <EmptyState title="Belum ada booking dulu" description="Data booking akan muncul di sini setelah user melakukan transaksi." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3 font-semibold">User</th>
                      <th className="px-6 py-3 font-semibold">Lapangan</th>
                      <th className="px-6 py-3 font-semibold">Jadwal</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="text-sm text-slate-700">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{booking.user_name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{booking.field_name}</p>
                          <p className="text-xs text-slate-500">{booking.field_type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p>{booking.booking_date}</p>
                          <p className="text-xs text-slate-500">
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={booking.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void openPaymentProof(booking.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-indigo-600 transition hover:bg-indigo-50"
                              title="Lihat bukti"
                            >
                              <Eye size={16} />
                            </button>
                            {booking.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void updateStatus(booking.id, 'confirmed')}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-emerald-600 transition hover:bg-emerald-50"
                                  title="Approve"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void updateStatus(booking.id, 'rejected')}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 transition hover:bg-rose-50"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.8fr]">
          <Card className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Daftar Lapangan</h2>
            {fields.length === 0 ? (
              <EmptyState title="Belum ada lapangan" description="Tambahkan lapangan pertama untuk mulai menerima booking." />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <Card key={field.id} className="space-y-3 border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{field.name}</p>
                        <p className="text-xs text-slate-500">{field.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteField(field.id)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Hapus
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(field.price_per_hour)}/jam</p>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900">Tambah Lapangan</h3>
            <form className="space-y-3" onSubmit={(event) => void addField(event)}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Nama</label>
                <input
                  value={newField.name}
                  onChange={(event) => setNewField((prev) => ({ ...prev, name: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Contoh: Futsal A"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Tipe</label>
                <select
                  value={newField.type}
                  onChange={(event) => setNewField((prev) => ({ ...prev, type: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="Futsal">Futsal</option>
                  <option value="Mini Soccer">Mini Soccer</option>
                  <option value="Padel">Padel</option>
                  <option value="Badminton">Badminton</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Harga/Jam</label>
                <input
                  value={newField.price_per_hour}
                  onChange={(event) => setNewField((prev) => ({ ...prev, price_per_hour: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="150000"
                  type="number"
                />
              </div>
              <Button fullWidth type="submit" disabled={submittingField}>
                <Plus size={16} />
                {submittingField ? 'Menyimpan...' : 'Tambah Lapangan'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Modal open={Boolean(selectedProof)} title="Bukti Pembayaran" onClose={() => setSelectedProof(null)}>
        {selectedProof ? <img src={selectedProof} alt="Bukti pembayaran" className="max-h-[70vh] w-full rounded-2xl object-contain" /> : null}
      </Modal>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  tone: 'primary' | 'warning' | 'success';
}) {
  const toneClass =
    tone === 'primary'
      ? 'bg-indigo-100 text-indigo-600'
      : tone === 'warning'
        ? 'bg-amber-100 text-amber-600'
        : 'bg-emerald-100 text-emerald-600';

  return (
    <Card className="flex items-center gap-4">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}

function CalendarWidget() {
  return <TrendingUp size={20} />;
}

function StatusPill({ status }: { status: Booking['status'] }) {
  if (status === 'pending') return <Badge variant="pending">Pending</Badge>;
  if (status === 'confirmed') return <Badge variant="confirmed">Confirmed</Badge>;
  if (status === 'rejected') return <Badge variant="rejected">Rejected</Badge>;
  return <Badge variant="neutral">Completed</Badge>;
}


