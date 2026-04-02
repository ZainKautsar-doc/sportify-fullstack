import { useRef, useEffect, useState } from 'react';
import { Volleyball, Dumbbell, Goal, Trophy } from 'lucide-react';

interface GalleryItem {
  sport: string;
  label: string;
  sublabel: string;
  imageUrl: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentClass: string;
}

const galleryItems: GalleryItem[] = [
  {
    sport: 'futsal',
    label: 'Futsal',
    sublabel: 'Lapangan indoor premium',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80',
    icon: Goal,
    accentClass: 'from-emerald-600 to-green-500',
  },
  {
    sport: 'badminton',
    label: 'Badminton',
    sublabel: 'Karet anti-slip, pencahayaan optimal',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    icon: Dumbbell,
    accentClass: 'from-blue-600 to-cyan-500',
  },
  {
    sport: 'padel',
    label: 'Padel',
    sublabel: 'Court berkaca outdoor & indoor',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    icon: Volleyball,
    accentClass: 'from-purple-600 to-violet-500',
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl"
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${item.accentClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-end justify-between">
          <div>
            <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${item.accentClass} px-3 py-1 text-xs font-bold text-white mb-2 shadow-lg`}>
              <Icon size={12} />
              {item.sport.toUpperCase()}
            </div>
            <p className="font-display text-xl font-bold text-white leading-tight">{item.label}</p>
            <p className="text-sm text-slate-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              {item.sublabel}
            </p>
          </div>
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.accentClass} text-white shadow-lg`}>
              <Trophy size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Corner badge */}
      <div className="absolute top-4 right-4 rounded-xl bg-white/15 backdrop-blur border border-white/20 px-2.5 py-1">
        <span className="text-xs font-bold text-white">Tersedia</span>
      </div>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section id="galeri" className="py-20">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 mb-4 tracking-wide uppercase">
          Galeri Aktivitas
        </span>
        <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Lihat Keseruan di Lapangan
        </h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto text-base">
          Lihat keseruan pemain di lapangan Sportify — dari futsal, badminton, hingga padel.
        </p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {galleryItems.map((item, i) => (
          <GalleryCard key={item.sport} item={item} index={i} />
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 shadow-xl shadow-indigo-600/20">
        <div>
          <p className="font-display text-xl font-bold text-white">Siap ikut seru-seruan?</p>
          <p className="text-indigo-100 text-sm mt-0.5">Lebih dari 12.000 booking per bulan. Jangan ketinggalan!</p>
        </div>
        <a
          href="/booking"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Booking Lapangan
          <span>→</span>
        </a>
      </div>
    </section>
  );
}
