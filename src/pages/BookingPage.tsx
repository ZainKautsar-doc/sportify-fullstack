import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, Field, User } from '@/src/types/domain';
import { apiRequest } from '@/src/lib/api';
import { formatCurrency, formatDateLabel, toImageByFieldType } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import Badge from '@/src/components/ui/Badge';
import Skeleton from '@/src/components/ui/Skeleton';
import EmptyState from '@/src/components/ui/EmptyState';
import ErrorState from '@/src/components/ui/ErrorState';

const SLOT_TIMES = Array.from({ length: 7 }, (_, i) => `${(i + 13).toString().padStart(2, '0')}:00`);
const SLOT_GROUPS = [
  { label: 'Pagi', slots: [] as string[], hint: 'Belum tersedia, operasional mulai 13:00' },
  { label: 'Siang', slots: SLOT_TIMES.filter((time) => Number(time.split(':')[0]) < 17), hint: '' },
  { label: 'Malam', slots: SLOT_TIMES.filter((time) => Number(time.split(':')[0]) >= 17), hint: '' },
];

interface BookingPageProps {
  user: User;
}

export default function BookingPage({ user }: BookingPageProps) {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [searchParams] = useSearchParams();
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(fieldId ? Number(fieldId) : null);
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') ?? '');
  const [submitting, setSubmitting] = useState(false);

  const loadFields = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Field[]>('/api/fields');
      setFields(data);
      if (!selectedFieldId && data.length > 0) {
        setSelectedFieldId(data[0].id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ups, coba lagi ya';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFieldId]);

  const loadSlots = useCallback(async () => {
    if (!selectedFieldId || !selectedDate) return;
    setIsSlotLoading(true);
    try {
      const data = await apiRequest<Booking[]>(`/api/bookings?field_id=${selectedFieldId}&date=${selectedDate}`);
      setBookings(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat slot');
    } finally {
      setIsSlotLoading(false);
    }
  }, [selectedDate, selectedFieldId]);

  useEffect(() => {
    void loadFields();
  }, [loadFields]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  );

  const bookedTimes = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.status !== 'rejected') set.add(booking.start_time);
    });
    return set;
  }, [bookings]);

  const quickDates = useMemo(
    () => [new Date(), addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 3)],
    [],
  );

  const canSubmit = Boolean(selectedField && selectedDate && selectedTime) && !submitting;

  const handleSubmit = async () => {
    if (!selectedField || !selectedTime) {
      toast.error('Lengkapi tanggal dan jam dulu ya');
      return;
    }

    setSubmitting(true);
    const endHour = Number(selectedTime.split(':')[0]) + 1;

    try {
      const result = await apiRequest<{ id: number }>('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          field_id: selectedField.id,
          booking_date: selectedDate,
          start_time: selectedTime,
          end_time: `${String(endHour).padStart(2, '0')}:00`,
        }),
      });

      toast.success('Booking berhasil dibuat. Lanjut upload pembayaran, ya');
      navigate(`/payment/${result.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <Card className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </Card>
        <Card className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadFields()} />;
  }

  if (fields.length === 0) {
    return (
      <EmptyState
        title="Belum ada lapangan nih 😅"
        description="Admin belum menambahkan lapangan. Coba cek lagi sebentar ya."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[1.5fr_0.8fr]">
      <section className="space-y-6">
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Step 1</p>
            <h1 className="font-display text-2xl font-bold text-slate-900">Pilih lapangan dulu</h1>
            <p className="text-sm text-slate-500">Cari lapangan yang paling cocok sama tim kamu.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const active = field.id === selectedFieldId;
              return (
                <button
                  type="button"
                  key={field.id}
                  onClick={() => {
                    setSelectedFieldId(field.id);
                    setSelectedTime('');
                  }}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    active
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-[0_16px_35px_-28px_rgba(79,70,229,0.8)]'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <img src={toImageByFieldType(field.type)} alt={field.name} className="h-28 w-full object-cover" />
                  <div className="space-y-2 p-4">
                    <p className="font-semibold text-slate-900">{field.name}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={14} />
                      Sportify Arena
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="primary">{field.type}</Badge>
                      <span className="text-sm font-semibold text-slate-700">{formatCurrency(field.price_per_hour)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Step 2</p>
            <h2 className="font-display text-xl font-bold text-slate-900">Pilih tanggal main</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickDates.map((dateItem) => {
              const value = format(dateItem, 'yyyy-MM-dd');
              const active = value === selectedDate;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSelectedDate(value);
                    setSelectedTime('');
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {format(dateItem, 'EEE, d MMM')}
                </button>
              );
            })}
          </div>
          <input
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setSelectedTime('');
            }}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="text-sm text-slate-500">{formatDateLabel(selectedDate)}</p>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Step 3</p>
            <h2 className="font-display text-xl font-bold text-slate-900">Pilih slot jam</h2>
          </div>

          <div className="space-y-4">
            {SLOT_GROUPS.map((group) => (
              <div key={group.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{group.label}</p>
                  {group.hint ? <p className="text-xs text-slate-500">{group.hint}</p> : null}
                </div>

                {isSlotLoading ? (
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                    {Array.from({ length: group.label === 'Pagi' ? 2 : group.slots.length || 3 }).map((_, index) => (
                      <div key={`${group.label}-${index}`}>
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : group.slots.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    Slot pagi belum buka. Kamu bisa pilih mulai jam 13:00.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                    {group.slots.map((time) => {
                      const isBooked = bookedTimes.has(time);
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          disabled={isBooked}
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            isBooked
                              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70'
                              : isSelected
                                ? 'border-indigo-700 bg-indigo-700 text-white shadow-[0_14px_26px_-16px_rgba(55,48,163,0.9)]'
                                : 'border-indigo-100 bg-indigo-50 text-indigo-700 hover:border-indigo-300'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">Legend Slot</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Available
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-700" />
                Selected
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Booked
              </span>
            </div>
          </div>
        </Card>
      </section>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Ringkasan Booking</h2>
          <SummaryItem label="Lapangan" value={selectedField?.name ?? '-'} />
          <SummaryItem label="Tanggal" value={selectedDate ? formatDateLabel(selectedDate) : '-'} />
          <SummaryItem label="Jam" value={selectedTime || '-'} />
          <SummaryItem label="Total harga" value={selectedField ? formatCurrency(selectedField.price_per_hour) : '-'} highlight />

          <Button fullWidth onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? 'Menyimpan booking...' : 'Gas Booking! 🚀'}
          </Button>
          <p className="text-xs text-slate-500">Setelah ini kamu akan lanjut ke upload bukti pembayaran.</p>
        </Card>
      </aside>
    </div>
  );
}

function SummaryItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>{value}</span>
    </div>
  );
}
