import { useState } from 'react';
import { Search, MapPin, ArrowRight, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  backgroundImage: string;
  onExplore: () => void;
  onBooking: () => void;
}

const fadeIn = (delayMs: number) => ({
  animation: `fade-up 700ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms forwards`,
});

const sports = ['Futsal', 'Badminton', 'Padel', 'Mini Soccer'];

export default function HeroSection({ backgroundImage, onExplore, onBooking }: HeroSectionProps) {
  const [search, setSearch] = useState('');
  const [activeSport, setActiveSport] = useState('Futsal');

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt="Lapangan olahraga Sportify"
        className="absolute inset-0 h-full w-full object-cover scale-105"
        style={{ animation: 'subtle-zoom 12s ease-out forwards' }}
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="w-full max-w-4xl mx-auto">

          {/* Badge */}
          <div className="opacity-0 inline-flex" style={fadeIn(80)}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-4 py-1.5 text-sm font-semibold text-white mb-6">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Platform Booking Lapangan #1 Indonesia
            </span>
          </div>

          {/* Headline */}
          <h1
            className="opacity-0 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
            style={fadeIn(160)}
          >
            Main Lebih Mudah
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
              di Sportify
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="opacity-0 mt-5 text-base leading-relaxed text-slate-200 md:text-lg max-w-xl mx-auto"
            style={fadeIn(240)}
          >
            Booking lapangan favoritmu sekarang, pilih jadwal dan langsung main tanpa ribet.
          </p>

          {/* Sport filter pills */}
          <div className="opacity-0 mt-8 flex flex-wrap gap-2 justify-center" style={fadeIn(300)}>
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSport(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all duration-200 ${
                  activeSport === s
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/10 border-white/25 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="opacity-0 mt-6 w-full max-w-2xl mx-auto" style={fadeIn(360)}>
            <div className="flex items-center gap-0 rounded-2xl bg-white/95 backdrop-blur shadow-2xl shadow-black/30 overflow-hidden p-1.5">
              <div className="flex items-center gap-2 pl-4 pr-2 text-slate-400 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Cari lapangan ${activeSport} atau lokasi...`}
                className="flex-1 bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
              />
              <button
                onClick={onBooking}
                className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-sm font-bold shadow-md shadow-indigo-600/30 transition-all duration-200 hover:shadow-indigo-600/50 active:scale-95"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="opacity-0 mt-7 flex flex-col sm:flex-row gap-3 justify-center" style={fadeIn(420)}>
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 px-7 py-3.5 text-sm font-bold shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
            >
              Eksplor Lapangan
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onBooking}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 text-sm font-bold shadow-xl shadow-indigo-600/35 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-600/50 active:translate-y-0"
            >
              Booking Sekarang
            </button>
          </div>

          {/* Stats strip */}
          <div className="opacity-0 mt-12 flex flex-wrap gap-6 justify-center" style={fadeIn(500)}>
            {[
              { value: '500+', label: 'Lapangan Aktif' },
              { value: '12K+', label: 'Booking/Bulan' },
              { value: '4.9★', label: 'Rating Pengguna' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={onExplore}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
          aria-label="Scroll ke bawah"
        >
          <span className="text-xs font-medium tracking-wide">Lihat Lapangan</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
