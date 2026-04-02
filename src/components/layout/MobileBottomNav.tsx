import { CalendarClock, House, LayoutDashboard, UserCircle2, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { UserRole } from '@/src/types/domain';
import { cn } from '@/src/lib/cn';

interface MobileBottomNavProps {
  role: UserRole | null;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive: (pathname: string) => boolean;
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const location = useLocation();

  const bookingHref = role === 'user' ? '/booking' : '/pilih-role?next=%2Fbooking';
  const scheduleHref = role === 'user' ? '/jadwal' : '/pilih-role?next=%2Fjadwal';
  const profileHref = role === 'user' ? '/profil' : '/pilih-role?next=%2Fprofil';

  const navItems: NavItem[] =
    role === 'admin'
      ? [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            to: '/admin',
            isActive: (pathname) => pathname.startsWith('/admin'),
          },
        ]
      : [
          {
            icon: House,
            label: 'Beranda',
            to: '/',
            isActive: (pathname) => pathname === '/',
          },
          {
            icon: CalendarClock,
            label: 'Booking',
            to: bookingHref,
            isActive: (pathname) => pathname.startsWith('/booking') || pathname.startsWith('/payment'),
          },
          {
            icon: LayoutDashboard,
            label: 'Jadwal',
            to: scheduleHref,
            isActive: (pathname) => pathname.startsWith('/jadwal'),
          },
          {
            icon: UserCircle2,
            label: 'Profil',
            to: profileHref,
            isActive: (pathname) => pathname.startsWith('/profil'),
          },
        ];

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden" aria-label="Mobile bottom navigation">
      <div className="mx-auto w-full max-w-7xl px-4 pb-[calc(env(safe-area-inset-bottom)+0.35rem)]">
        <div className="pointer-events-auto overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white/90 shadow-[0_-12px_30px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
            {navItems.map((item) => {
              const active = item.isActive(location.pathname);
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={cn(
                      'relative flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold transition-all duration-200',
                      active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200',
                        active ? 'bg-indigo-600 opacity-100' : 'bg-transparent opacity-0',
                      )}
                    />
                    <Icon
                      size={21}
                      strokeWidth={active ? 2.4 : 2}
                      className={cn('transition-transform duration-200', active ? 'scale-105' : 'scale-100')}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
