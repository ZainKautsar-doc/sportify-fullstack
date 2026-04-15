import { useMemo, useState } from 'react';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Booking } from '@/src/types/domain';
import { formatCurrency } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import CalendarDay from '@/src/components/admin/calendar/CalendarDay';
import SlotDetailModal from '@/src/components/admin/calendar/SlotDetailModal';
import Skeleton from '@/src/components/ui/Skeleton';

interface AdminCalendarProps {
  bookings: Booking[];
  isLoading?: boolean;
  enableDummyPreview?: boolean; // Prop kept for backward compatibility if needed, but unused
}

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export default function AdminCalendar({ bookings, isLoading = false }: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Directly use real bookings
  const activeBookings = bookings;

  const monthRange = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const bookingsByDate = useMemo(() => {
    return activeBookings.reduce<Record<string, Booking[]>>((acc, booking) => {
      if (!acc[booking.booking_date]) acc[booking.booking_date] = [];
      acc[booking.booking_date].push(booking);
      return acc;
    }, {});
  }, [activeBookings]);

  const monthBookings = useMemo(
    () => activeBookings.filter((booking) => isSameMonth(parseISO(booking.booking_date), currentMonth)),
    [activeBookings, currentMonth],
  );

  const totalMonthlyBooking = monthBookings.length;
  // Handle sum calculation safely, COALESCE is usually enough but fallback to 0 is safe
  const monthlyRevenue = monthBookings
    .filter((booking) => booking.status === 'confirmed' || booking.status === 'completed')
    .reduce((sum, booking) => sum + (Number(booking.price_per_hour) || 0), 0);

  const busiestDay = useMemo(() => {
    if (monthBookings.length === 0) return null;
    const counter = monthBookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.booking_date] = (acc[booking.booking_date] ?? 0) + 1;
      return acc;
    }, {});

    const top = Object.entries(counter).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
    if (!top) return null;
    return { date: top[0], count: top[1] };
  }, [monthBookings]);

  if (isLoading) {
    return (
      <Card className="space-y-4 border-slate-200/80">
        <Skeleton className="h-7 w-60" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <>
      <Card className="space-y-4 border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Kalender Booking</h2>
            <p className="text-sm text-slate-500">Pantau kepadatan harian dan cek slot operasional dengan cepat.</p>
          </div>
          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="px-3 text-sm font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy', { locale: id })}</p>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <SummaryChip label="Total booking bulan ini" value={`${totalMonthlyBooking} booking`} tone="indigo" />
          <SummaryChip label="Total revenue bulan ini" value={formatCurrency(monthlyRevenue)} tone="emerald" />
          <SummaryChip
            label="Hari paling ramai"
            value={
              busiestDay
                ? `${format(parseISO(busiestDay.date), 'd MMM', { locale: id })} (${busiestDay.count} booking)`
                : 'Belum ada booking'
            }
            tone="amber"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-7 bg-slate-50">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="border-b border-slate-200 px-2 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 p-2">
            {monthRange.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const count = (bookingsByDate[key] ?? []).filter((booking) => booking.status !== 'rejected').length;
              return (
                <div key={key}>
                  <CalendarDay day={day} monthDate={currentMonth} count={count} onSelect={setSelectedDate} selected={selectedDate ? isSameDay(selectedDate, day) : false} />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <SlotDetailModal open={Boolean(selectedDate)} date={selectedDate} onClose={() => setSelectedDate(null)} />
    </>
  );
}

function SummaryChip({ label, value, tone }: { label: string; value: string; tone: 'indigo' | 'emerald' | 'amber' }) {
  const toneClass =
    tone === 'indigo'
      ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
      : tone === 'emerald'
        ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
        : 'bg-amber-50 border-amber-100 text-amber-900';

  return (
    <div className={`rounded-2xl border p-3 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
