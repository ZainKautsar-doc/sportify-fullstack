import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'Gimana cara booking lapangan di Sportify?',
    answer:
      'Daftar akun atau masuk terlebih dahulu, lalu pilih lapangan yang kamu inginkan. Tentukan tanggal dan jam main, kemudian selesaikan pembayaran via transfer bank. Setelah upload bukti pembayaran, admin akan mengonfirmasi dalam waktu singkat.',
  },
  {
    question: 'Apakah bisa booking di hari yang sama?',
    answer:
      'Bisa banget! Selama slot masih tersedia, kamu bisa booking dan langsung main di hari yang sama. Pastikan kamu melakukan pembayaran dan mendapat konfirmasi sebelum datang ke venue.',
  },
  {
    question: 'Pembayaran dilakukan bagaimana?',
    answer:
      'Saat ini pembayaran dilakukan via transfer bank (BCA, Mandiri, BRI, BNI). Setelah transfer, upload bukti pembayaran di halaman booking kamu. Admin akan memverifikasi dan mengonfirmasi booking-mu.',
  },
  {
    question: 'Berapa lama konfirmasi dari admin?',
    answer:
      'Konfirmasi biasanya diberikan dalam 15–60 menit di jam operasional (08.00–22.00 WIB). Di luar jam tersebut, konfirmasi akan diproses pada keesokan harinya.',
  },
  {
    question: 'Apakah bisa batal booking?',
    answer:
      'Mohon maaf, pembatalan booking tidak dapat dilakukan setelah booking dikonfirmasi oleh admin. Pastikan kamu sudah yakin dengan jadwal yang dipilih sebelum melakukan pembayaran.',
  },
  {
    question: 'Apakah bisa refund setelah booking dikonfirmasi?',
    answer:
      'Refund tidak tersedia setelah booking dikonfirmasi. Kami menyarankan kamu untuk memastikan ketersediaan jadwal sebelum melakukan pembayaran.',
  },
  {
    question: 'Bagaimana jika hari main sedang hujan deras?',
    answer:
      'Untuk lapangan indoor (futsal, badminton), hujan tidak berpengaruh dan permainan tetap berjalan. Untuk lapangan outdoor, silakan hubungi kami via WhatsApp untuk mendiskusikan kondisi lapangan pada hari tersebut.',
  },
  {
    question: 'Apakah bisa reschedule jadwal booking?',
    answer:
      'Reschedule tidak bisa dilakukan secara mandiri melalui aplikasi. Jika ada kondisi mendesak, silakan hubungi tim kami via WhatsApp sesegera mungkin, dan kami akan mencoba membantu sesuai ketersediaan lapangan.',
  },
  {
    question: 'Apakah harga sudah termasuk semua biaya?',
    answer:
      'Harga yang tertera adalah harga sewa lapangan per jam. Biaya tambahan seperti sewa bola, net (untuk badminton), atau perlengkapan lainnya belum termasuk dan dapat disewa terpisah di venue.',
  },
  {
    question: 'Bagaimana jika saya terlambat datang?',
    answer:
      'Waktu booking berjalan sesuai jadwal yang dipilih, bukan sejak kamu tiba. Artinya, jika kamu terlambat 30 menit, waktu bermain tetap berakhir pada jam yang sudah ditentukan. Harap datang tepat waktu.',
  },
  {
    question: 'Apakah bisa booking untuk event atau turnamen komunitas?',
    answer:
      'Tentu! Kami menyediakan paket khusus untuk event, turnamen, dan gathering komunitas. Silakan hubungi kami langsung via WhatsApp atau email di sportify@email.com untuk mendiskusikan kebutuhan dan harga package.',
  },
  {
    question: 'Bagaimana cara memilih jam terbaik untuk main?',
    answer:
      'Jam pagi (07.00–10.00) dan siang (12.00–15.00) biasanya lebih lengang dan harga cenderung lebih terjangkau. Jam sore-malam (17.00–22.00) adalah prime time yang paling ramai. Cek ketersediaan slot di halaman booking sebelum memutuskan.',
  },
];

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = items ?? DEFAULT_FAQS;

  return (
    <div className="space-y-2.5">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`rounded-2xl border transition-all duration-200 ${
              isOpen ? 'border-[#0f2d5e]/30 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-[#0f2d5e]/20'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
                isOpen ? 'text-[#0f2d5e]' : 'text-slate-800'
              }`}
            >
              <span className="text-sm font-semibold md:text-base leading-snug pr-2">{item.question}</span>
              <span
                className={`flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
                  isOpen ? 'bg-[#0f2d5e] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isOpen ? '400px' : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
