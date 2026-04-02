import { Facebook, Instagram, Sparkles, Twitter } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-blue-300">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">Sportify</p>
              <p className="text-xs text-slate-400">Play more, stress less</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Platform booking lapangan olahraga yang bikin main makin gampang.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Menu</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="transition hover:text-white">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link to="/" className="transition hover:text-white">
                Bantuan
              </Link>
            </li>
            <li>
              <Link to="/" className="transition hover:text-white">
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Social</p>
          <div className="flex items-center gap-3">
            <SocialButton icon={<Instagram size={17} />} label="Instagram" />
            <SocialButton icon={<Twitter size={17} />} label="Twitter" />
            <SocialButton icon={<Facebook size={17} />} label="Facebook" />
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Sportify. Semua hak dilindungi.</p>
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:text-white"
    >
      {icon}
    </a>
  );
}
