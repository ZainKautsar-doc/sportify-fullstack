import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  backgroundImage: string;
  onExplore: () => void;
  onBooking: () => void;
}

const fadeIn = (delayMs: number) => ({
  animation: `fade-up 700ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms both`,
});

const sports = ['Futsal', 'Badminton', 'Padel', 'Mini Soccer'];

export default function HeroSection({ backgroundImage, onExplore, onBooking }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Lapangan olahraga Sportify"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ animation: 'subtle-zoom 14s ease-out forwards' }}
      />
      {/* Overlays — dark + subtle navy tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-[#0f2d5e]/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="w-full max-w-3xl mx-auto">

          {/* Eyebrow badge */}
          <div style={fadeIn(80)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Platform Booking Lapangan Olahraga
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
            style={fadeIn(160)}
          >
            Main Lebih Mudah
            <br />
            <span className="text-sky-300">di Sportify</span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-5 text-base leading-relaxed text-slate-200 md:text-lg max-w-xl mx-auto"
            style={fadeIn(240)}
          >
            Booking lapangan favoritmu sekarang, pilih jadwal dan langsung main tanpa ribet.
          </p>

          {/* Sport category pills */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center" style={fadeIn(310)}>
            {sports.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center" style={fadeIn(380)}>
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/70 bg-transparent text-white px-7 py-3.5 text-sm font-bold backdrop-blur transition-all duration-200 hover:bg-white hover:text-[#0f2d5e] hover:-translate-y-0.5"
            >
              Eksplor Lapangan
            </button>
            <button
              onClick={onBooking}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f2d5e] hover:bg-[#0a1f3c] text-white px-7 py-3.5 text-sm font-bold shadow-xl shadow-[#0f2d5e]/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Booking Sekarang
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center" style={fadeIn(450)}>
            {[
              { value: '500+',  label: 'Lapangan Aktif' },
              { value: '12K+',  label: 'Booking/Bulan' },
              { value: '4.9★',  label: 'Rating Pengguna' },
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
          aria-label="Scroll ke bawah"
        >
          <span className="text-xs font-medium tracking-wide">Lihat Lapangan</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
