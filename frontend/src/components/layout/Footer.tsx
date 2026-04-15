import { Facebook, Instagram, Twitter } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SportifyLogo from '@/src/components/ui/SportifyLogo';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-100 bg-[#0f2d5e] text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Kolom 1 - Brand */}
          <div className="space-y-5 md:col-span-4 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <SportifyLogo size={36} variant="white" />
              <div>
                <p className="font-display text-2xl font-bold text-white leading-none">Sportify</p>
                <p className="mt-1.5 text-xs font-semibold text-blue-200">Play more, stress less</p>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-blue-100/80">
              Platform booking lapangan olahraga yang bikin main makin gampang.
            </p>
          </div>

          {/* Kolom 2 - Menu */}
          <div className="space-y-5 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Menu</h3>
            <ul className="space-y-3.5 text-sm">
              <li><Link to="/" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Beranda</Link></li>
              <li><Link to="/booking" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Booking</Link></li>
              <li><Link to="/jadwal" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Jadwal Saya</Link></li>
              <li><Link to="/kontak" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Kontak</Link></li>
            </ul>
          </div>

          {/* Kolom 3 - Informasi */}
          <div className="space-y-5 md:col-span-3 lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Informasi</h3>
            <ul className="space-y-3.5 text-sm">
              <li><Link to="/" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Tentang Kami</Link></li>
              <li><Link to="/" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Bantuan</Link></li>
              <li><Link to="/" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Syarat & Ketentuan</Link></li>
              <li><Link to="/" className="transition-all duration-200 hover:text-white hover:translate-x-1.5 inline-block text-blue-100/70">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Kolom 4 - Social */}
          <div className="space-y-5 md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Social</h3>
            <div className="flex flex-wrap items-center gap-3">
              <SocialButton icon={<Instagram size={18} />} label="Instagram" />
              <SocialButton icon={<Twitter size={18} />} label="Twitter" />
              <SocialButton icon={<Facebook size={18} />} label="Facebook" />
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-blue-200/60 md:flex-row md:text-left">
          <p>© 2026 Sportify. Semua hak dilindungi.</p>
          <div className="mt-4 flex gap-6 md:mt-0 font-medium">
            <Link to="/" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors duration-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-blue-100/80 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:bg-[#14407f] hover:text-white hover:shadow-lg hover:shadow-[#14407f]/50"
    >
      {icon}
    </a>
  );
}
