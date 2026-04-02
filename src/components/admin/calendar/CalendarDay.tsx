import { format, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/src/lib/cn';

interface CalendarDayProps {
  day: Date;
  monthDate: Date;
  count: number;
  onSelect: (day: Date) => void;
  selected?: boolean;
}

export default function CalendarDay({ day, monthDate, count, onSelect, selected }: CalendarDayProps) {
  const inMonth = isSameMonth(day, monthDate);
  const dayIsToday = isToday(day);
  const label = `${count} booking`;

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      className={cn(
        'group min-h-[102px] rounded-2xl border p-3 text-left transition',
        inMonth ? 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-400',
        dayIsToday && 'border-indigo-300 ring-2 ring-indigo-100',
        selected && 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-100',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('text-sm font-semibold', inMonth ? 'text-slate-800' : 'text-slate-400')}>{format(day, 'd')}</span>
        {dayIsToday ? (
          <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
            Hari ini
          </span>
        ) : null}
      </div>
      <p className={cn('mt-5 text-xs font-semibold', count > 0 ? 'text-rose-600' : 'text-emerald-600', !inMonth && 'opacity-60')}>{label}</p>
    </button>
  );
}
