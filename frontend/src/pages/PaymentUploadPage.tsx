import { type DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ImagePlus, Info, LoaderCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, User } from '@/src/types/domain';
import { fetchWithAuth } from '@/src/lib/api';
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
      const bookings = await fetchWithAuth<Booking[]>('/api/bookings');
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

      await fetchWithAuth('/api/payments/upload', {
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
          <p className="text-sm text-slate-500">Transfer dulu sesuai nominal lalu kirim bukti transfer di sini. Sat set beres.</p>
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

        <Card className="space-y-4">
          <label
            onDrop={isExpired ? undefined : onDrop}
            onDragOver={(event) => {
              if (isExpired) return;
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${
              isExpired ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-50' : isDragging ? 'border-indigo-500 bg-indigo-50 cursor-pointer' : 'border-slate-200 bg-slate-50 cursor-pointer'
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
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
              <ImagePlus size={30} />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-800">Drag & drop bukti pembayaran</p>
            <p className="mt-1 text-sm text-slate-500">atau klik untuk pilih file (PNG/JPG)</p>
          </label>

          {previewUrl ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Preview file</p>
              <img src={previewUrl} alt="Preview bukti pembayaran" className="max-h-72 w-full rounded-2xl object-cover" />
            </div>
          ) : null}

          <div className="space-y-2 rounded-2xl bg-indigo-50 p-4 text-sm">
            <p className="inline-flex items-center gap-2 font-semibold text-indigo-700">
              <Wallet size={16} />
              Info rekening
            </p>
            <p className="text-slate-700">BCA 1234567890 a.n Sportify Indonesia</p>
            <p className="text-slate-700">Nominal: {formatCurrency(booking.total_price)}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
              <Info size={16} />
              Checklist sebelum kirim
            </p>
            <p>1. Pastikan nominal transfer sesuai.</p>
            <p>2. Nama pengirim terlihat jelas di screenshot.</p>
            <p>3. Upload gambar tidak blur.</p>
          </div>

          <Button fullWidth onClick={submitPayment} disabled={isSubmitting || submitted || !file || isExpired}>
            {isSubmitting ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Mengirim bukti...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 size={16} />
                Bukti terkirim
              </>
            ) : isExpired ? (
              'Booking Kadaluarsa'
            ) : (
              'Kirim Bukti Sekarang'
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
