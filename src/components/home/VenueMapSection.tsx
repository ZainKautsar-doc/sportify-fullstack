import { Card } from '@/src/components/ui/Card';

export default function VenueMapSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Lokasi Venue</h2>
        <p className="mt-1 text-sm text-slate-500">Biar gampang sampai ke venue, cek map dulu sebelum berangkat.</p>
      </div>

      <Card className="overflow-hidden border-slate-200 p-0 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)]">
        <iframe
          title="Lokasi Sportify Jakarta"
          src="https://www.google.com/maps?q=-6.2088,106.8456&z=13&output=embed"
          className="h-[320px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Card>
    </section>
  );
}
