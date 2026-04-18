import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { AvailabilitySlot, Booking, Field, User } from '@/src/types/domain';
import { fetchWithAuth } from '@/src/lib/api';
import { formatCurrency, formatDateLabel, toImageByFieldType } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import Badge from '@/src/components/ui/Badge';
import Skeleton from '@/src/components/ui/Skeleton';
import EmptyState from '@/src/components/ui/EmptyState';
import ErrorState from '@/src/components/ui/ErrorState';

const SLOT_GROUPS = [
  { label: 'Siang', hoursRange: [13, 17] },
  { label: 'Malam', hoursRange: [17, 20] },
];

interface BookingPageProps {
  user: User | null;
}

export default function BookingPage({ user }: BookingPageProps) {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [searchParams] = useSearchParams();

  const [fields, setFields] = useState<Field[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(
    fieldId ? Number(fieldId) : null
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') ?? '');
  const [submitting, setSubmitting] = useState(false);

  // Load lapangan dari backend
  const loadFields = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<Field[]>('/api/fields');
      setFields(data);
      if (!selectedFieldId && data.length > 0) {
        setSelectedFieldId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat lapangan');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFieldId]);

  // Load slot availability dari /api/availability
  const loadAvailability = useCallback(async () => {
    if (!selectedFieldId || !selectedDate) return;
    setIsSlotLoading(true);
    setAvailability([]);
    try {
      const data = await fetchWithAuth<AvailabilitySlot[]>(
        `/api/availability?date=${selectedDate}&field_id=${selectedFieldId}`
      );
      setAvailability(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat slot');
    } finally {
      setIsSlotLoading(false);
    }
  }, [selectedDate, selectedFieldId]);

  useEffect(() => { void loadFields(); }, [loadFields]);
  useEffect(() => { void loadAvailability(); }, [loadAvailability]);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  const quickDates = useMemo(
    () => [new Date(), addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 3)],
    []
  );

  const canSubmit = Boolean(selectedField && selectedDate && selectedTime) && !submitting;

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk melakukan booking');
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    if (!selectedField || !selectedTime) {
      toast.error('Lengkapi tanggal dan jam dulu ya');
      return;
    }

    setSubmitting(true);
    const endHour = Number(selectedTime.split(':')[0]) + 1;

    try {
      const result = await fetchWithAuth<Booking>('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_id: selectedField.id,
          booking_date: selectedDate,
          start_time: selectedTime,
          end_time: `${String(endHour).padStart(2, '0')}:00`,
        }),
      });

      toast.success(`Booking berhasil! Total: ${formatCurrency(result.total_price)}. Lanjut Upload Pembayaran.`);
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
        {/* Step 1: Pilih Lapangan */}
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
                  onClick={() => { setSelectedFieldId(field.id); setSelectedTime(''); }}
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
                      <span className="text-sm font-semibold text-slate-700">{formatCurrency(field.price_per_hour)}/jam</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Pilih Tanggal */}
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
                  onClick={() => { setSelectedDate(value); setSelectedTime(''); }}
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
            onChange={(event) => { setSelectedDate(event.target.value); setSelectedTime(''); }}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="text-sm text-slate-500">{formatDateLabel(selectedDate)}</p>
        </Card>

        {/* Step 3: Pilih Slot */}
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Step 3</p>
            <h2 className="font-display text-xl font-bold text-slate-900">Pilih slot jam</h2>
          </div>

          <div className="space-y-4">
            {SLOT_GROUPS.map((group) => {
              const groupSlots = availability.filter((slot) => {
                const h = parseInt(slot.time.split(':')[0], 10);
                return h >= group.hoursRange[0] && h < group.hoursRange[1];
              });

              return (
                <div key={group.label} className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">{group.label}</p>

                  {isSlotLoading ? (
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : groupSlots.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      Tidak ada slot tersedia untuk sesi ini.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                      {groupSlots.map((slot) => {
                        const isBooked = !slot.available;
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            type="button"
                            key={slot.time}
                            onClick={() => {
                              if (!user) {
                                toast.error('Silakan login terlebih dahulu untuk melakukan booking');
                                navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
                                return;
                              }
                              setSelectedTime(slot.time);
                            }}
                            disabled={isBooked}
                            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                              isBooked
                                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70'
                                : isSelected
                                  ? 'border-indigo-700 bg-indigo-700 text-white shadow-[0_14px_26px_-16px_rgba(55,48,163,0.9)]'
                                  : 'border-indigo-100 bg-indigo-50 text-indigo-700 hover:border-indigo-300'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Sidebar: Ringkasan Booking */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Ringkasan Booking</h2>
          <SummaryItem label="Lapangan" value={selectedField?.name ?? '-'} />
          <SummaryItem label="Tanggal" value={selectedDate ? formatDateLabel(selectedDate) : '-'} />
          <SummaryItem label="Jam mulai" value={selectedTime || '-'} />
          <SummaryItem label="Jam selesai" value={selectedTime ? `${String(Number(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:00` : '-'} />
          <SummaryItem
            label="Total harga"
            value={selectedField ? formatCurrency(selectedField.price_per_hour) : '-'}
            highlight
          />

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
