import { type DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ImagePlus, Info, LoaderCircle, QrCode, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, User } from '@/src/types/domain';
import { fetchWithAuth, API } from '@/src/lib/api';
import { formatCurrency, formatDateLabel } from '@/src/lib/format';
import { Card } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import ErrorState from '@/src/components/ui/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton';

interface PaymentUploadPageProps {
  user: User;
}

export default function PaymentUploadPage({ user }: PaymentUploadPageProps) {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const loadBooking = useCallback(async () => {
    if (!bookingId) return;
    setIsLoading(true);
    setError(null);
    try {
      const bookings = await fetchWithAuth<Booking[]>(`${API}/api/bookings`);
      const target = bookings.find((item) => item.id === Number(bookingId));
      if (!target) throw new Error('Booking tidak ditemukan');
      setBooking(target);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ups, coba lagi ya';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, user.id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!booking) return;

    if (booking.status !== 'pending') {
      if (booking.status === 'rejected') setIsExpired(true);
      return;
    }

    const calculateRemaining = () => {
      const createdAt = new Date(booking.created_at).getTime();
      const now = new Date().getTime();
      const diffInSeconds = Math.floor((createdAt + 10 * 60 * 1000 - now) / 1000);
      return diffInSeconds;
    };

    let remTime = calculateRemaining();
    if (remTime <= 0) {
      setIsExpired(true);
      setRemainingTime(0);
      return;
    }
    
    setRemainingTime(remTime);
    
    const interval = setInterval(() => {
      remTime = calculateRemaining();
      if (remTime <= 0) {
        setIsExpired(true);
        setRemainingTime(0);
        clearInterval(interval);
      } else {
        setRemainingTime(remTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  useEffect(() => {
    if (isExpired) {
      const timeout = setTimeout(() => {
        navigate('/jadwal');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, navigate]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isExpired) return;

    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;
    if (!droppedFile.type.startsWith('image/')) {
      toast.error('File harus berupa gambar ya');
      return;
    }
    setFile(droppedFile);
  };

  const submitPayment = async () => {
    if (!booking || !file) {
      toast.error('Upload bukti pembayaran dulu ya');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', String(booking.id));
      // Gunakan field name 'file' sesuai backend (upload.single('file'))
      formData.append('file', file);

      await fetchWithAuth(`${API}/api/payments/upload`, {
        method: 'POST',
        body: formData,
        // Jangan set Content-Type — biarkan browser set boundary otomatis
      });

      setSubmitted(true);
      toast.success('Bukti pembayaran berhasil dikirim! Tunggu konfirmasi admin ya 🎉');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload gagal, coba lagi ya');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-56 w-full" />
      </Card>
    );
  }

  if (error || !booking) {
    return <ErrorState message={error ?? 'Booking tidak ditemukan'} onRetry={() => void loadBooking()} />;
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pb-16 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-5">
        <Card className="space-y-3">
          <h1 className="font-display text-3xl font-bold text-slate-900">Upload Pembayaran</h1>
          <p className="text-sm text-slate-500">Pindai kode QR di bawah ini menggunakan aplikasi pembayaran favoritmu (Gopay, OVO, Dana, m-Banking, dll).</p>
        </Card>

        {isExpired && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-800">Waktu pembayaran habis, booking dibatalkan</p>
            <p className="mt-1 text-xs text-red-700">Mengarahkan kembali ke jadwal...</p>
          </div>
        )}

        {!isExpired && remainingTime !== null && booking?.status === 'pending' && (
          <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
              <Clock size={16} />
              Sisa Waktu Pembayaran
            </p>
            <div className="font-mono text-3xl font-bold tracking-wider text-amber-900">
              {formatTime(remainingTime)}
            </div>
            <p className="text-center text-xs text-amber-700">Segera lakukan pembayaran dalam 10 menit agar booking tidak dibatalkan otomatis</p>
          </div>
        )}

        <section className="space-y-6">
          {/* ① QRIS Card — Visual Focus */}
          <Card className="group relative overflow-hidden bg-white p-8 shadow-xl shadow-indigo-100/40 transition-all border-slate-100 rounded-[32px]">
            <div className="space-y-6 text-center">
              <div className="space-y-1.5">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f2d5e]/5 text-[#0f2d5e]">
                  <QrCode size={20} />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight mt-3">Scan QRIS</h2>
                <p className="text-sm text-slate-400">Gunakan e-wallet atau mobile banking kamu</p>
              </div>

              {/* QR Wrapper — Full Visibility & Safe Area */}
              <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-inner ring-4 ring-slate-50">
                <img
                  src="/img/payment/qris.jpeg"
                  alt="QRIS Payment Code"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* Nominal Highlight */}
              <div className="space-y-1.5 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f2d5e]/40">Total yang harus dibayar</p>
                <p className="font-display text-4xl font-black text-[#0f2d5e] tracking-tight">
                  {formatCurrency(booking.total_price)}
                </p>
              </div>
            </div>
          </Card>

          {/* ② Instructions Card */}
          <Card className="space-y-5 border-slate-200/60 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0f2d5e] shadow-sm ring-1 ring-slate-100">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-800">Cara Pembayaran</p>
                <p className="text-xs text-slate-400">Lakukan scan dan selesaikan transaksi</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { step: "1", text: "Buka aplikasi e-wallet atau m-banking" },
                { step: "2", text: "Scan QR code di atas secara tepat" },
                { step: "3", text: "Pay nominal sesuai total tagihan" },
                { step: "4", text: "Simpan & upload struk pembayaran" }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100 transition hover:ring-indigo-200">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#0f2d5e] text-[10px] font-black text-white">{item.step}</span>
                  <span className="text-xs font-semibold text-slate-600 leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card className="space-y-5">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-slate-900">Upload Bukti</h2>
            <p className="text-sm text-slate-500">Kirim screenshot atau foto struk pembayaran kamu.</p>
          </div>

          <label
            onDrop={isExpired ? undefined : onDrop}
            onDragOver={(event) => {
              if (isExpired) return;
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition ${
              isExpired ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-50' : isDragging ? 'border-indigo-500 bg-indigo-50 cursor-pointer' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 cursor-pointer'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isExpired}
              onChange={(event) => {
                if (isExpired) return;
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
              }}
            />
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm transition group-hover:scale-110">
              <ImagePlus size={30} />
            </div>
            <p className="mt-4 text-lg font-bold text-slate-800">Drag & drop bukti bayar</p>
            <p className="mt-1 text-sm text-slate-500">atau klik untuk telusuri file (PNG/JPG)</p>
          </label>

          {previewUrl ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">Preview Bukti</p>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                <img src={previewUrl} alt="Preview bukti pembayaran" className="max-h-80 w-full object-cover" />
              </div>
            </div>
          ) : null}

          <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2 font-bold text-slate-800">
              <Info size={16} className="text-indigo-600" />
              Penting!
            </p>
            <ul className="space-y-2">
              <li>• Pastikan nominal transfer Sesuai.</li>
              <li>• Nama dan status transaksi harus terlihat jelas.</li>
              <li>• Gukanan file asli agar tidak pecah/blur.</li>
            </ul>
          </div>

          <Button fullWidth onClick={submitPayment} disabled={isSubmitting || submitted || !file || isExpired} className="h-12 text-base font-bold">
            {isSubmitting ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Mengirim bukti...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 size={20} />
                Bukti Berhasil Terkirim
              </>
            ) : isExpired ? (
              'Booking Kadaluarsa'
            ) : (
              'Kirim Bukti Pembayaran'
            )}
          </Button>
        </Card>
      </section>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Ringkasan</h2>
          <SummaryRow label="Lapangan" value={booking.field_name} />
          <SummaryRow label="Tanggal" value={formatDateLabel(booking.booking_date)} />
          <SummaryRow label="Jam" value={`${booking.start_time} - ${booking.end_time}`} />
          <SummaryRow label="Total" value={formatCurrency(booking.total_price)} highlight />

          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Lagi dicek admin ya 👀</p>
            <p className="mt-1 text-xs text-amber-700">Status booking akan otomatis berubah setelah diverifikasi.</p>
          </div>

          <Button variant="secondary" fullWidth onClick={() => navigate('/jadwal')}>
            Lihat Jadwal Saya
          </Button>
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={highlight ? 'font-semibold text-indigo-600' : 'font-semibold text-slate-800'}>{value}</span>
    </div>
  );
}
