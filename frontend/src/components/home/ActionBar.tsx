import { Filter, Rocket, Trophy } from 'lucide-react';

type QuickAction = 'explore' | 'booking';

interface ActionBarProps {
  sports: readonly string[];
  selectedSport: string;
  quickAction: QuickAction;
  onSportChange: (value: string) => void;
  onQuickActionChange: (value: QuickAction) => void;
  onSubmit: () => void;
}

const quickActions: Array<{ value: QuickAction; label: string }> = [
  { value: 'explore', label: 'Eksplor Lapangan' },
  { value: 'booking', label: 'Booking Sekarang' },
];

export default function ActionBar({
  sports,
  selectedSport,
  quickAction,
  onSportChange,
  onQuickActionChange,
  onSubmit,
}: ActionBarProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white shadow-lg md:p-6">
      <div className="mb-4 space-y-1 md:mb-5">
        <p className="font-display text-xl font-bold md:text-2xl">Tinggal pilih, langsung gas!</p>
        <p className="text-sm text-indigo-100/95">Set filter cepat biar ketemu slot paling cocok dalam hitungan detik.</p>
      </div>

      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="w-full md:flex-1">
          <label htmlFor="sport-select" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-50">
            <Trophy size={16} />
            Pilih Olahraga
          </label>
          <select
            id="sport-select"
            value={selectedSport}
            onChange={(event) => onSportChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-200 focus:ring-4 focus:ring-white/35 md:w-auto md:min-w-[220px]"
          >
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:flex-1">
          <label htmlFor="quick-action" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-50">
            <Filter size={16} />
            Aksi Cepat
          </label>
          <select
            id="quick-action"
            value={quickAction}
            onChange={(event) => onQuickActionChange(event.target.value as QuickAction)}
            className="h-12 w-full rounded-xl border border-white/30 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-200 focus:ring-4 focus:ring-white/35 md:w-auto md:min-w-[220px]"
          >
            {quickActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 md:w-auto"
        >
          <Rocket size={16} />
          Cari &amp; Booking Sekarang
        </button>
      </div>
    </div>
  );
}
