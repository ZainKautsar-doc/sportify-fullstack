import { CircleCheckBig, Layers3, Wallet } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

const highlights = [
  {
    title: 'Mudah booking',
    description: 'Pilih lapangan, atur jadwal, langsung jalan dalam beberapa klik.',
    icon: CircleCheckBig,
  },
  {
    title: 'Banyak pilihan lapangan',
    description: 'Mulai dari futsal, badminton, mini soccer, sampai padel.',
    icon: Layers3,
  },
  {
    title: 'Harga transparan',
    description: 'Harga terlihat jelas dari awal, tanpa biaya tersembunyi.',
    icon: Wallet,
  },
];

export default function VenueAboutSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Tentang Venue</h2>
        <p className="mt-1 text-sm text-slate-500">Kenapa banyak komunitas olahraga pakai Sportify?</p>
      </div>

      <Card className="space-y-5 border-slate-200 bg-white">
        <div>
          <p className="font-display text-2xl font-bold text-slate-900">Sportify</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sportify adalah platform booking lapangan olahraga yang memudahkan kamu untuk main tanpa ribet. Dari futsal sampai padel, semua bisa kamu booking dalam hitungan detik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <Icon size={18} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
