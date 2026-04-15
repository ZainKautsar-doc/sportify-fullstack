import { MessageCircle } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="rounded-2xl bg-[#0a1f3c] px-6 py-10 md:py-12 text-center">
      <span className="inline-block rounded-full border border-white/20 bg-white/10 text-sky-300 text-xs font-bold px-4 py-1.5 mb-4 tracking-wide uppercase">
        Bantuan
      </span>
      <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Butuh Bantuan?</h2>
      <p className="mt-3 text-sky-100 text-base max-w-sm mx-auto">
        Tim kami siap bantu kamu kapan saja lewat WhatsApp.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3.5 text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <MessageCircle size={18} />
          Chat via WhatsApp
        </a>
        <a
          href="/kontak"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 text-white px-7 py-3.5 text-sm font-bold hover:bg-white/10 transition-all duration-200"
        >
          Lihat Halaman Kontak
        </a>
      </div>
    </section>
  );
}
