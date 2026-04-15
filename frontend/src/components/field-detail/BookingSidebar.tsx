import { CalendarDays, Clock3, Flame, ShieldCheck, TicketPercent } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import { formatCurrency, formatDateLabel } from '@/src/lib/format';

interface BookingSidebarProps {
  pricePerHour: number;
  date: string;
  availableCount: number;
  onDateChange: (nextDate: string) => void;
  onCheckAvailability: () => void;
}

export default function BookingSidebar({
  pricePerHour,
  date,
  availableCount,
  onDateChange,
  onCheckAvailability,
}: BookingSidebarProps) {
  const isLimited = availableCount <= 2;

  return (
    <Card className="space-y-5 border-slate-200/80">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mulai dari</p>
        <p className="font-display text-3xl font-bold text-slate-900">{formatCurrency(pricePerHour)}</p>
        <p className="text-sm text-slate-500">/ jam</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <CalendarDays size={16} className="text-indigo-600" />
          Pilih tanggal booking
        </p>
        <input
          type="date"
          min={format(new Date(), 'yyyy-MM-dd')}
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <p className="text-xs text-slate-500">{formatDateLabel(date)}</p>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <ShieldCheck size={16} className="text-emerald-600" />
          Bisa booking hari ini
        </p>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Flame size={16} className={isLimited ? 'text-amber-500' : 'text-slate-500'} />
          {isLimited ? 'Slot cepat habis' : `${availableCount} slot masih tersedia`}
        </p>
        <p className="inline-flex items-center gap-2 text-xs text-slate-500">
          <TicketPercent size={14} />
          Cek promo sebelum lanjut ke pembayaran.
        </p>
      </div>

      <Button fullWidth onClick={onCheckAvailability}>
        Cek Ketersediaan
        <Clock3 size={16} />
      </Button>
    </Card>
  );
}
