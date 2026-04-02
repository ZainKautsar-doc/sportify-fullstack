import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Star } from 'lucide-react';
import type { Booking, Field, UserRole } from '@/src/types/domain';
import { apiRequest } from '@/src/lib/api';
import { getVenueDetailContent } from '@/src/lib/fieldDetailData';
import { Card } from '@/src/components/ui/Card';
import Badge from '@/src/components/ui/Badge';
import Skeleton from '@/src/components/ui/Skeleton';
import ErrorState from '@/src/components/ui/ErrorState';
import ImageGallery from '@/src/components/field-detail/ImageGallery';
import VenueInfo from '@/src/components/field-detail/VenueInfo';
import FacilityList from '@/src/components/field-detail/FacilityList';
import BookingSidebar from '@/src/components/field-detail/BookingSidebar';

interface FieldDetailPageProps {
  role: UserRole | null;
}

const SLOT_TIMES = Array.from({ length: 7 }, (_, i) => `${(i + 13).toString().padStart(2, '0')}:00`);

export default function FieldDetailPage({ role }: FieldDetailPageProps) {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFieldDetail = useCallback(async () => {
    if (!fieldId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [fields, dayBookings] = await Promise.all([
        apiRequest<Field[]>('/api/fields'),
        apiRequest<Booking[]>(`/api/bookings?field_id=${fieldId}&date=${date}`),
      ]);

      const target = fields.find((item) => item.id === Number(fieldId)) ?? null;
      if (!target) throw new Error('Lapangan tidak ditemukan');

      setField(target);
      setBookings(dayBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ups, coba lagi ya');
    } finally {
      setIsLoading(false);
    }
  }, [date, fieldId]);

  useEffect(() => {
    void loadFieldDetail();
  }, [loadFieldDetail]);

  const bookedTimes = useMemo(() => {
    const times = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.status !== 'rejected') times.add(booking.start_time);
    });
    return times;
  }, [bookings]);

  const availableCount = SLOT_TIMES.filter((time) => !bookedTimes.has(time)).length;
  const venue = useMemo(() => (field ? getVenueDetailContent(field) : null), [field]);

  const mapEmbedUrl = useMemo(() => {
    if (!venue) return '';
    return `https://maps.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&z=15&output=embed`;
  }, [venue]);

  const mapUrl = useMemo(() => {
    if (!venue) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery)}`;
  }, [venue]);

  const onCheckAvailability = () => {
    if (!field) return;
    const target = `/booking/${field.id}?date=${encodeURIComponent(date)}`;
    if (role === 'user') {
      navigate(target);
      return;
    }
    navigate(`/pilih-role?next=${encodeURIComponent(target)}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <Card className="space-y-4 border-slate-200/80">
            <Skeleton className="h-8 w-3/5" />
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-5 w-1/3" />
          </Card>
          <Card className="space-y-4 border-slate-200/80">
            <Skeleton className="h-80 w-full rounded-3xl" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </Card>
        </div>
        <Card className="space-y-4 border-slate-200/80">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </Card>
      </div>
    );
  }

  if (error || !field || !venue) {
    return <ErrorState message={error ?? 'Lapangan tidak ditemukan'} onRetry={() => void loadFieldDetail()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="space-y-5">
        <Card className="space-y-4 border-slate-200/80">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900 md:text-[2rem]">{venue.name}</h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={15} />
                {venue.city}
              </p>
            </div>
            <Badge variant="primary" className="px-3 py-1.5">
              {venue.type}
            </Badge>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold">{venue.rating.toFixed(1)}</span>
            <span className="text-slate-500">({venue.reviewCount} review)</span>
          </div>
        </Card>

        <Card className="border-slate-200/80 p-4 md:p-5">
          <ImageGallery name={venue.name} images={venue.images} />
        </Card>

        <VenueInfo
          description={venue.description}
          rules={venue.rules}
          city={venue.city}
          address={venue.address}
          promoText={venue.promoText}
          mapEmbedUrl={mapEmbedUrl}
          mapUrl={mapUrl}
        />

        <FacilityList facilities={venue.facilities} />
      </section>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <BookingSidebar
          pricePerHour={field.price_per_hour}
          date={date}
          availableCount={availableCount}
          onDateChange={setDate}
          onCheckAvailability={onCheckAvailability}
        />
      </aside>
    </div>
  );
}
