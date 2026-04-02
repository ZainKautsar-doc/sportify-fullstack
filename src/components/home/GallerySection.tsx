import { useRef, useEffect, useState } from 'react';
import { Goal, Dumbbell, Volleyball } from 'lucide-react';

interface GalleryItem {
  sport: string;
  label: string;
  sublabel: string;
  imageUrl: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badgeColor: string;
}

const galleryItems: GalleryItem[] = [
  {
    sport: 'futsal',
    label: 'Futsal',
    sublabel: 'Lapangan indoor premium kelas 1',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80',
    icon: Goal,
    badgeColor: 'bg-emerald-600',
  },
  {
    sport: 'badminton',
    label: 'Badminton',
    sublabel: 'Lantai karet, pencahayaan optimal',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    icon: Dumbbell,
    badgeColor: 'bg-sky-600',
  },
  {
    sport: 'padel',
    label: 'Padel',
    sublabel: 'Court berkaca outdoor & indoor',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    icon: Volleyball,
    badgeColor: 'bg-violet-600',
  },
];

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), index * 120); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg"
      style={{
        transition: 'opacity 600ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      {/* Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={`${item.label} di Sportify`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        {/* navy hover tint */}
        <div className="absolute inset-0 bg-[#0f2d5e]/0 group-hover:bg-[#0f2d5e]/30 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full ${item.badgeColor} px-3 py-1 text-xs font-bold text-white mb-2 shadow`}>
              <Icon size={11} />
              {item.sport.toUpperCase()}
            </span>
            <p className="font-display text-xl font-bold text-white leading-tight">{item.label}</p>
            <p className="mt-0.5 text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              {item.sublabel}
            </p>
          </div>
        </div>
      </div>

      {/* Available badge */}
      <div className="absolute top-4 right-4 rounded-xl bg-white/15 backdrop-blur border border-white/20 px-2.5 py-1">
        <span className="text-xs font-bold text-white">Tersedia</span>
      </div>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section id="galeri">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
          Galeri Aktivitas
        </span>
        <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Lihat Keseruan di Lapangan
        </h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto text-base">
          Dari futsal hingga padel — temukan olahraga favoritmu di Sportify.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {galleryItems.map((item, i) => <GalleryCard key={item.sport} item={item} index={i} />)}
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl bg-[#0f2d5e] px-8 py-6 shadow-lg shadow-[#0f2d5e]/15">
        <div>
          <p className="font-display text-xl font-bold text-white">Siap ikut seru-seruan?</p>
          <p className="text-sky-100 text-sm mt-0.5">Lebih dari 12.000 booking per bulan. Jangan ketinggalan!</p>
        </div>
        <a
          href="/booking"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-[#0f2d5e] px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Booking Lapangan →
        </a>
      </div>
    </section>
  );
}
