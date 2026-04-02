import { MapPin, ExternalLink } from 'lucide-react';

const MAPS_QUERY = '-6.2088,106.8456';
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&z=14&output=embed`;
const MAPS_OPEN  = `https://www.google.com/maps?q=${MAPS_QUERY}`;

export default function VenueMapSection() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
            Lokasi
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900">Lokasi Venue</h2>
          <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#0f2d5e]" />
            Jl. Olahraga Raya No. 12, Jakarta Selatan, DKI Jakarta
          </p>
        </div>
        <a
          href={MAPS_OPEN}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border-2 border-[#0f2d5e] text-[#0f2d5e] px-4 py-2.5 text-sm font-bold hover:bg-[#0f2d5e] hover:text-white transition-all duration-200"
        >
          <ExternalLink size={15} />
          Buka di Google Maps
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
        <iframe
          title="Lokasi Sportify"
          src={MAPS_EMBED}
          className="h-[340px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
