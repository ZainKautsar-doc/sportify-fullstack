import { MessageCircle, Mail, MapPin, Clock, ExternalLink, Phone } from 'lucide-react';

const MAPS_QUERY = '-6.2088,106.8456';
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&z=14&output=embed`;
const MAPS_OPEN  = `https://www.google.com/maps?q=${MAPS_QUERY}`;

const contactMethods = [
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
    sub: 'Balas dalam beberapa menit',
    href: 'https://wa.me/6281234567890',
    cta: 'Chat Sekarang',
    iconBg: 'bg-emerald-50 text-emerald-700',
    ctaCls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20',
    available: true,
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'sportify@email.com',
    sub: 'Dibalas dalam 1×24 jam',
    href: 'mailto:sportify@email.com',
    cta: 'Kirim Email',
    iconBg: 'bg-sky-50 text-sky-700',
    ctaCls: 'bg-[#0f2d5e] hover:bg-[#14407f] text-white shadow-lg shadow-[#0f2d5e]/20',
    available: true,
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Telepon',
    value: '(021) 1234-5678',
    sub: 'Senin–Sabtu, 08.00–20.00 WIB',
    href: 'tel:+622112345678',
    cta: 'Hubungi',
    iconBg: 'bg-violet-50 text-violet-700',
    ctaCls: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20',
    available: true,
  },
];

const infoItems = [
  {
    icon: MapPin,
    label: 'Alamat Venue',
    value: 'Jl. Olahraga Raya No. 12, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12120',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin – Minggu, 07.00 – 22.00 WIB (termasuk Hari Libur Nasional)',
  },
];

export default function ContactPage() {
  return (
    <div className="pb-20">

      {/* ── Hero ── */}
      <div className="bg-[#0f2d5e] px-4 py-20 text-center">
        <span className="inline-block rounded-full border border-white/20 bg-white/10 text-sky-300 text-xs font-bold px-4 py-1.5 mb-5 tracking-wide uppercase">
          Hubungi Kami
        </span>
        <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
          Ada yang Bisa Kami Bantu?
        </h1>
        <p className="mt-4 text-sky-100 text-base max-w-md mx-auto">
          Punya pertanyaan atau butuh bantuan? Kami siap membantu kamu kapan saja.
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 md:px-6 space-y-14 pt-14">

        {/* ── Contact method cards ── */}
        <section>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {contactMethods.map(({ id, icon: Icon, label, value, sub, href, cta, iconBg, ctaCls }) => (
              <div
                key={id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#0f2d5e]/25 transition-all duration-200"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} mb-4`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className="font-display text-lg font-bold text-slate-900 leading-tight">{value}</p>
                <p className="text-xs text-slate-500 mt-1 mb-auto pb-5">{sub}</p>
                <a
                  href={href}
                  target={id !== 'phone' ? '_blank' : undefined}
                  rel="noreferrer"
                  className={`mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${ctaCls}`}
                >
                  {cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Venue Info ── */}
        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-900">Informasi Venue</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f5fb] text-[#0f2d5e]">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Map ── */}
        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-bold text-slate-900">Peta Lokasi</h2>
            <a
              href={MAPS_OPEN}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0f2d5e] text-[#0f2d5e] px-4 py-2 text-sm font-bold hover:bg-[#0f2d5e] hover:text-white transition-all duration-200"
            >
              <ExternalLink size={14} />
              Buka di Google Maps
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <iframe
              title="Lokasi Sportify"
              src={MAPS_EMBED}
              className="h-[380px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="rounded-2xl bg-[#0a1f3c] px-8 py-10 text-center">
          <p className="font-display text-2xl font-bold text-white mb-2">Belum dapat jawaban?</p>
          <p className="text-sky-100 text-sm mb-6 max-w-xs mx-auto">
            Chat langsung dengan tim Sportify via WhatsApp untuk respons tercepat.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3.5 text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
          >
            <MessageCircle size={18} />
            Chat via WhatsApp
          </a>
        </section>

      </div>
    </div>
  );
}
