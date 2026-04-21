import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GallerySection({ bookingHref = '/booking' }: { bookingHref?: string }) {
  return (
    <section id="galeri" className="relative bg-slate-50/50 py-16 md:py-28 rounded-3xl border border-slate-100 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* ----- KIRI (TEXT CONTENT) ----- */}
          <div className="flex flex-col items-start gap-6 max-w-xl md:order-1 order-1">
            {/* Small Heading */}
            <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 tracking-wide uppercase shadow-sm">
              Galeri Aktivitas
            </span>
            
            {/* Main Headline */}
            <h2 className="font-display text-4xl font-bold text-slate-900 md:text-5xl leading-[1.15] tracking-tight">
              Serunya Main di Sportify Bareng Temanmu
            </h2>
            
            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed">
              Sportify menghadirkan pengalaman bermain yang seru dan praktis untuk semua kalangan. Mulai dari futsal, badminton, hingga padel, kamu bisa menikmati fasilitas lapangan berkualitas tanpa ribet. Tinggal pilih jadwal, booking, dan langsung main bareng teman atau tim kamu. Cocok untuk sekadar fun game, latihan rutin, sampai mini turnamen komunitas.
            </p>
            
            {/* CTA */}
            <Link 
              to={bookingHref}
              className="group mt-4 inline-flex items-center gap-2 text-[#0f2d5e] font-bold text-lg transition-all"
            >
              <span className="relative">
                Lihat Selengkapnya
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#0f2d5e] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* ----- KANAN (GALERI GRID) ----- */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 items-center md:order-2 order-2">
            
            {/* Kolom 1 (Staggered down di desktop) */}
            <div className="flex flex-col gap-4 md:gap-6 md:pt-16">
              {/* Gambar 1: Padel Outdoor */}
              <div className="group overflow-hidden rounded-2xl shadow-sm bg-slate-200">
                <img 
                  src="/img/padeldetail/padel1.webp" 
                  alt="Padel Court Outdoor" 
                  className="w-full h-full object-cover transition-all duration-700 aspect-[4/5] group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
              {/* Gambar 2: Futsal Indoor */}
              <div className="group overflow-hidden rounded-2xl shadow-sm bg-slate-200">
                <img 
                  src="/img/futsaldetail/futsal2.webp" 
                  alt="Futsal Indoor Premium" 
                  className="w-full h-full object-cover transition-all duration-700 aspect-square group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
            </div>

            {/* Kolom 2 (Staggered up di desktop) */}
            <div className="flex flex-col gap-4 md:gap-6 md:-mt-16">
              {/* Gambar 3: Badminton Indoor */}
              <div className="group overflow-hidden rounded-2xl shadow-sm bg-slate-200">
                <img 
                  src="/img/badmintondetail/badminton1.webp" 
                  alt="Badminton Indoor" 
                  className="w-full h-full object-cover transition-all duration-700 aspect-square group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
              {/* Gambar 4: Mini Soccer Outdoor */}
              <div className="group overflow-hidden rounded-2xl shadow-sm bg-slate-200">
                <img 
                  src="/img/minisoccerdetail/minisoccer1.webp" 
                  alt="Mini Soccer Outdoor" 
                  className="w-full h-full object-cover transition-all duration-700 aspect-[4/5] group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
