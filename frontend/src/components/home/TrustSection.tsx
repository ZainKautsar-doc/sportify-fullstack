import { useEffect, useRef, useState } from 'react';
import { MapPin, CalendarCheck, Star, Users } from 'lucide-react';

const stats = [
  { icon: MapPin,        value: '500+',   label: 'Lapangan Aktif',    sub: 'Tersebar di berbagai kota' },
  { icon: CalendarCheck, value: '12.000+',label: 'Booking/Bulan',     sub: 'Dan terus bertambah' },
  { icon: Star,          value: '4.9',    label: 'Rating Pengguna',   sub: 'Dari ribuan review' },
  { icon: Users,         value: '8.000+', label: 'Member Aktif',      sub: 'Komunitas yang terus tumbuh' },
];

export default function TrustSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="rounded-2xl bg-[#0f2d5e] px-6 py-10 md:py-12">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label, sub }, i) => (
          <div
            key={label}
            className="text-center"
            style={{
              transition: `opacity 600ms ease ${i * 100}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Icon size={22} className="text-sky-300" />
            </div>
            <p className="font-display text-3xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-sm font-semibold text-sky-100">{label}</p>
            <p className="mt-0.5 text-xs text-white/50">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
