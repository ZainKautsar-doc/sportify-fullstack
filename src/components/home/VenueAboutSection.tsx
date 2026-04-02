import { CircleCheckBig, Layers3, Wallet, Headset } from 'lucide-react';

const highlights = [
  {
    title: 'Booking Cepat & Praktis',
    description: 'Pilih lapangan, atur jadwal, dan selesaikan pembayaran dalam hitungan menit — tanpa antrian, tanpa telepon.',
    icon: CircleCheckBig,
  },
  {
    title: 'Banyak Pilihan Lapangan',
    description: 'Dari futsal, badminton, mini soccer, hingga padel — semua tersedia di satu platform.',
    icon: Layers3,
  },
  {
    title: 'Harga Transparan',
    description: 'Tidak ada biaya tersembunyi. Harga yang kamu lihat adalah harga yang kamu bayar.',
    icon: Wallet,
  },
  {
    title: 'Support Responsif',
    description: 'Tim kami siap membantu lewat WhatsApp kapan pun kamu butuh, termasuk untuk event komunitas.',
    icon: Headset,
  },
];

export default function VenueAboutSection() {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
          Kenapa Sportify?
        </span>
        <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Kenapa Ribuan Pemain Pilih Kami
        </h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto text-base">
          Platform booking olahraga yang dibuat dengan memahami kebutuhan komunitas — bukan sekadar software.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }, i) => (
          <div
            key={title}
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#0f2d5e]/30 hover:shadow-md transition-all duration-200"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-[#0f2d5e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f5fb] text-[#0f2d5e] mb-4 group-hover:bg-[#0f2d5e] group-hover:text-white transition-all duration-300">
              <Icon size={20} />
            </div>
            <p className="font-display text-base font-bold text-slate-900 mb-2">{title}</p>
            <p className="text-sm leading-relaxed text-slate-500">{description}</p>

            {/* Index number */}
            <span className="absolute top-5 right-5 font-display text-4xl font-extrabold text-slate-100 select-none">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
