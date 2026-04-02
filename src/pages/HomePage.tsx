import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Booking, Field, UserRole } from '@/src/types/domain';
import { apiRequest } from '@/src/lib/api';
import { Card } from '@/src/components/ui/Card';
import Skeleton from '@/src/components/ui/Skeleton';
import ErrorState from '@/src/components/ui/ErrorState';
import FieldCard from '@/src/components/fields/FieldCard';
import HeroSection from '@/src/components/home/HeroSection';
import GallerySection from '@/src/components/home/GallerySection';
import VenueAboutSection from '@/src/components/home/VenueAboutSection';
import VenueMapSection from '@/src/components/home/VenueMapSection';
import ContactSection from '@/src/components/home/ContactSection';
import FAQAccordion from '@/src/components/home/FAQAccordion';
import { Goal, Medal, Volleyball, Dumbbell } from 'lucide-react';

interface HomePageProps {
  role: UserRole | null;
}

const categories = [
  { name: 'Futsal', icon: Goal },
  { name: 'Mini Soccer', icon: Medal },
  { name: 'Padel', icon: Volleyball },
  { name: 'Badminton', icon: Dumbbell },
] as const;

const heroImage = 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1400&q=80';

export default function HomePage({ role }: HomePageProps) {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const selectedSport = categories[0].name;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingBaseHref = role === 'user' ? '/booking' : '/pilih-role?next=%2Fbooking';

  const scrollToExplore = useCallback(() => {
    document.getElementById('explore-lapangan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleBooking = useCallback(() => {
    navigate(bookingBaseHref);
  }, [bookingBaseHref, navigate]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const [fieldsData, bookingData] = await Promise.all([
        apiRequest<Field[]>('/api/fields'),
        apiRequest<Booking[]>(`/api/bookings?date=${today}`),
      ]);
      setFields(fieldsData);
      setTodayBookings(bookingData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ups, coba lagi ya';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const availabilityMap = useMemo(() => {
    const counts = new Map<number, number>();
    for (const booking of todayBookings) {
      if (booking.status === 'rejected') continue;
      counts.set(booking.field_id, (counts.get(booking.field_id) ?? 0) + 1);
    }
    return counts;
  }, [todayBookings]);

  return (
    <div className="pb-16">
      {/* Hero — fullscreen, starts from top-0 under transparent navbar */}
      <HeroSection
        backgroundImage={heroImage}
        onExplore={scrollToExplore}
        onBooking={handleBooking}
      />

      <div className="mx-auto w-full max-w-7xl space-y-16 px-6">

        {/* Gallery Section */}
        <GallerySection />

        {/* Sport Categories */}
        <section className="space-y-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
                Kategori
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900">Kategori Olahraga</h2>
            </div>
            <p className="text-sm text-slate-500 md:text-right">Lagi pengen {selectedSport}? Pilih dan lihat lapangan favoritmu.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(({ name, icon: Icon }) => (
              <Card key={name} hoverable className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-500">Lagi trending</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Field Recommendations */}
        <section id="explore-lapangan" className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
                Rekomendasi
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900">Rekomendasi Lapangan</h2>
              <p className="text-sm text-slate-500">Slot {selectedSport} paling dicari hari ini, langsung amankan sebelum penuh.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden p-0">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-6 w-3/5" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={() => void loadData()} />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {fields.map((field) => {
                const bookedCount = availabilityMap.get(field.id) ?? 0;
                const status = bookedCount >= 7 ? 'full' : 'available';
                const bookingHref =
                  role === 'user' ? `/booking/${field.id}` : `/pilih-role?next=${encodeURIComponent(`/booking/${field.id}`)}`;

                return (
                  <div key={field.id}>
                    <FieldCard field={field} status={status} bookingHref={bookingHref} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Venue info & contact */}
        <VenueAboutSection />
        <VenueMapSection />

        <section id="kontak">
          <ContactSection />
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">FAQ</h2>
            <p className="mt-1 text-sm text-slate-500">Masih bingung? Cek FAQ di bawah ya.</p>
          </div>
          <FAQAccordion
            items={[
              {
                question: 'Gimana cara booking lapangan di Sportify?',
                answer:
                  'Pilih lapangan, tentukan tanggal dan jam, lalu lakukan booking. Setelah itu upload bukti pembayaran dan tunggu konfirmasi dari admin.',
              },
              {
                question: 'Apakah bisa booking di hari yang sama?',
                answer: 'Bisa banget. Selama slot masih tersedia, kamu bisa langsung booking hari ini juga.',
              },
              {
                question: 'Pembayarannya gimana?',
                answer: 'Saat ini pembayaran dilakukan via transfer bank dan upload bukti pembayaran.',
              },
              {
                question: 'Bisa batal booking gak?',
                answer: 'Bisa, selama booking belum dikonfirmasi oleh admin.',
              },
              {
                question: 'Bagaimana kalau slot penuh?',
                answer: 'Kamu bisa pilih jam lain atau cek lapangan lainnya yang masih tersedia.',
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
