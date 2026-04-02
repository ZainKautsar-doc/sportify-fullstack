import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarClock, LayoutDashboard, House, Shield, Phone, Menu, X, UserCircle2 } from 'lucide-react';
import type { UserRole } from '@/src/types/domain';
import SportifyLogo from '@/src/components/ui/SportifyLogo';

interface TopNavProps {
  role: UserRole | null;
  userName?: string;
  onLogout: () => void;
}

const NAVY = '#0f2d5e';

export default function TopNav({ role, userName, onLogout }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const bookingHref   = role === 'user' ? '/booking'  : '/pilih-role?next=%2Fbooking';
  const scheduleHref  = role === 'user' ? '/jadwal'   : '/pilih-role?next=%2Fjadwal';
  const userInitial   = userName ? userName.slice(0, 1).toUpperCase() : 'S';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;

  /* ── link style helper ── */
  const linkCls = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 ${
      transparent
        ? active
          ? 'text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-white/70'
          : 'text-white/75 hover:text-white hover:bg-white/10'
        : active
          ? 'text-[#0f2d5e] bg-[#f0f5fb]'
          : 'text-slate-600 hover:text-[#0f2d5e] hover:bg-[#f0f5fb]'
    }`;

  /* ── primary CTA style ── */
  const primaryBtn =
    'rounded-xl bg-[#0f2d5e] hover:bg-[#14407f] text-white px-5 py-2 text-sm font-bold shadow-md shadow-[#0f2d5e]/25 transition-all duration-200 hover:-translate-y-0.5';

  const outlineBtn = (t: boolean) =>
    `rounded-xl px-4 py-2 text-sm font-semibold border transition-all duration-200 ${
      t ? 'border-white/30 text-white hover:bg-white/10' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent border-transparent shadow-none'
            : 'bg-white/97 backdrop-blur-xl border-b border-slate-200/70 shadow-sm'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <SportifyLogo size={38} variant={transparent ? 'white' : 'color'} />
            <span
              className={`font-display text-xl font-bold transition-colors duration-300 ${
                transparent ? 'text-white' : 'text-[#0f2d5e]'
              }`}
            >
              Sportify
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {role === 'admin' ? (
              <Link to="/admin" className={linkCls(location.pathname.startsWith('/admin'))}>
                <Shield size={15} /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/"           className={linkCls(location.pathname === '/')}>
                  <House size={15} /> Beranda
                </Link>
                <Link to={bookingHref} className={linkCls(location.pathname.startsWith('/booking'))}>
                  <CalendarClock size={15} /> Booking
                </Link>
                {role === 'user' && (
                  <Link to={scheduleHref} className={linkCls(location.pathname.startsWith('/jadwal'))}>
                    <LayoutDashboard size={15} /> Jadwal Saya
                  </Link>
                )}
                <Link to="/kontak"     className={linkCls(location.pathname === '/kontak')}>
                  <Phone size={15} /> Kontak
                </Link>
              </>
            )}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-2">
            {role ? (
              <>
                {role !== 'admin' && (
                  <div
                    className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 border ${
                      transparent ? 'border-white/25 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[#dde8f5] text-xs font-bold text-[#0f2d5e]">
                      {userInitial}
                    </div>
                    <span className="text-sm font-semibold">{userName ?? 'Sobat Sportify'}</span>
                  </div>
                )}
                <button onClick={onLogout} className={outlineBtn(transparent)}>Keluar</button>
                {role !== 'admin' && (
                  <button onClick={() => navigate(bookingHref)} className={primaryBtn}>
                    Booking Sekarang
                  </button>
                )}
              </>
            ) : (
              <>
                <button onClick={() => navigate('/pilih-role')} className={outlineBtn(transparent)}>Masuk</button>
                <button onClick={() => navigate('/pilih-role')} className={primaryBtn}>Daftar</button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              transparent ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } bg-white/98 backdrop-blur-xl border-t border-slate-100`}
        >
          <nav className="px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Beranda', icon: <House size={17} /> },
              { to: bookingHref, label: 'Booking', icon: <CalendarClock size={17} /> },
              ...(role === 'user' ? [{ to: scheduleHref, label: 'Jadwal Saya', icon: <LayoutDashboard size={17} /> }] : []),
              { to: '/kontak', label: 'Kontak', icon: <Phone size={17} /> },
            ].map(({ to, label, icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 font-semibold hover:bg-[#f0f5fb] hover:text-[#0f2d5e] transition-colors"
              >
                <span className="text-[#0f2d5e]">{icon}</span>
                {label}
              </Link>
            ))}
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
                  <button onClick={() => navigate('/pilih-role')} className="flex-1 py-2.5 rounded-xl bg-[#0f2d5e] text-white font-semibold text-sm hover:bg-[#14407f] transition-colors">
                    Daftar
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for non-hero pages */}
      {!isHome && <div className="h-[72px]" />}
    </>
  );
}
