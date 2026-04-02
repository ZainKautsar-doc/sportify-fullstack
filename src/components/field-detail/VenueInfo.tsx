import { ExternalLink, MapPin, ShieldAlert } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';

interface VenueInfoProps {
  description: string[];
  rules: string[];
  city: string;
  address: string;
  promoText: string;
  mapEmbedUrl: string;
  mapUrl: string;
}

export default function VenueInfo({ description, rules, city, address, promoText, mapEmbedUrl, mapUrl }: VenueInfoProps) {
  return (
    <section className="space-y-5">
      <Card className="space-y-4 border-slate-200/80">
        <h2 className="font-display text-2xl font-bold text-slate-900">Deskripsi Lapangan</h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-600">
          {description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 border-slate-200/80">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-slate-900">Aturan Venue</h3>
          <ShieldAlert size={18} className="text-slate-400" />
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          {rules.map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
          Baca selengkapnya
        </button>
      </Card>

      <Card className="rounded-2xl border-indigo-100 bg-indigo-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Promo Hari Ini</p>
        <p className="mt-1 text-sm font-semibold text-indigo-900">{promoText}</p>
      </Card>

      <Card className="space-y-4 border-slate-200/80">
        <h3 className="font-display text-xl font-bold text-slate-900">Lokasi Venue</h3>
        <div className="inline-flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={16} className="mt-0.5 text-slate-500" />
          <span>
            {address}
            <br />
            {city}
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <iframe
            src={mapEmbedUrl}
            title={`Lokasi ${city}`}
            className="h-60 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex">
          <Button size="sm" variant="secondary">
            Buka di Google Maps
            <ExternalLink size={14} />
          </Button>
        </a>
      </Card>
    </section>
  );
}
