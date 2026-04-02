import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarClock, LayoutDashboard, House, Shield, Sparkles, UserCircle2, Phone, Menu, X } from 'lucide-react';
import type { UserRole } from '@/src/types/domain';

interface TopNavProps {
  role: UserRole | null;
  userName?: string;
  onLogout: () => void;
}

export default function TopNav({ role, userName, onLogout }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const bookingHref = role === 'user' ? '/booking' : '/pilih-role?next=%2Fbooking';
  const scheduleHref = role === 'user' ? '/jadwal' : '/pilih-role?next=%2Fjadwal';
  const profileHref = role === 'user' ? '/profil' : '/pilih-role?next=%2Fprofil';
  const userInitial = userName ? userName.slice(0, 1).toUpperCase() : 'S';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isHome = location.pathname === '/';
  // Nav is transparent only on the homepage and not scrolled
  const transparent = isHome && !scrolled && !mobileOpen;

  const navLinkClass = (active: boolean) =>
    `relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
      transparent
        ? active
          ? 'text-white after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-white/80'
          : 'text-white/80 hover:text-white hover:bg-white/10'
        : active
          ? 'text-indigo-600 bg-indigo-50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent border-transparent shadow-none'
            : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl shadow-md transition-all duration-300 ${
                transparent
                  ? 'bg-white/20 backdrop-blur text-white border border-white/30'
                  : 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white'
              }`}
            >
              <Sparkles size={18} />
            </div>
            <span
              className={`font-display text-xl font-bold transition-colors duration-300 ${
                transparent ? 'text-white' : 'text-slate-900'
              }`}
            >
              Sportify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {role === 'admin' ? (
              <Link to="/admin" className={navLinkClass(location.pathname.startsWith('/admin'))}>
                <Shield size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/" className={navLinkClass(location.pathname === '/')}>
                  <House size={16} />
                  Beranda
                </Link>
                <Link to={bookingHref} className={navLinkClass(location.pathname.startsWith('/booking'))}>
                  <CalendarClock size={16} />
                  Booking
                </Link>
                {role === 'user' && (
                  <Link to={scheduleHref} className={navLinkClass(location.pathname.startsWith('/jadwal'))}>
                    <LayoutDashboard size={16} />
                    Jadwal Saya
                  </Link>
                )}
                <Link to="#kontak" className={navLinkClass(false)}>
                  <Phone size={16} />
                  Kontak
                </Link>
              </>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {role ? (
              <>
                {role !== 'admin' && (
                  <div className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 border ${transparent ? 'border-white/25 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700">
                      {userInitial}
                    </div>
                    <span className="text-sm font-semibold">{userName ?? 'Sobat Sportify'}</span>
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all duration-200 ${
                    transparent
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Keluar
                </button>
                {role !== 'admin' && (
                  <button
                    onClick={() => navigate(bookingHref)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all duration-200 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                  >
                    Booking Sekarang
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/pilih-role')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all duration-200 ${
                    transparent
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('/pilih-role')}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all duration-200 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
              transparent
                ? 'text-white hover:bg-white/10'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } bg-white/98 backdrop-blur-xl border-t border-slate-100`}
        >
          <nav className="px-4 py-4 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <House size={18} /> Beranda
            </Link>
            <Link to={bookingHref} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <CalendarClock size={18} /> Booking
            </Link>
            {role === 'user' && (
              <Link to={scheduleHref} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <LayoutDashboard size={18} /> Jadwal Saya
              </Link>
            )}
            <Link to="#kontak" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Phone size={18} /> Kontak
            </Link>
            <div className="pt-2 border-t border-slate-100 mt-2 flex gap-2">
              {role ? (
                <button onClick={onLogout} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  Keluar
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/pilih-role')} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                    Masuk
                  </button>
                  <button onClick={() => navigate('/pilih-role')} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    Daftar
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* spacer for fixed navbar — only when transparent (on hero pages) we don't need it */}
      {!isHome && <div className="h-[72px]" />}
    </>
  );
}
