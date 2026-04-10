import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Goal, Medal, Volleyball, Dumbbell } from "lucide-react";
import type { Booking, Field, UserRole } from "@/src/types/domain";
import { apiRequest } from "@/src/lib/api";
import { Card } from "@/src/components/ui/Card";
import Skeleton from "@/src/components/ui/Skeleton";
import ErrorState from "@/src/components/ui/ErrorState";
import FieldCard from "@/src/components/fields/FieldCard";
import HeroSection from "@/src/components/home/HeroSection";
import GallerySection from "@/src/components/home/GallerySection";
import VenueAboutSection from "@/src/components/home/VenueAboutSection";
import VenueMapSection from "@/src/components/home/VenueMapSection";
import ContactSection from "@/src/components/home/ContactSection";
import FAQAccordion from "@/src/components/home/FAQAccordion";
import heroImage from "@/src/heroimg/herobaner.webp";

interface HomePageProps {
  role: UserRole | null;
}

const categories = [
  { name: "Futsal", icon: Goal },
  { name: "Mini Soccer", icon: Medal },
  { name: "Padel", icon: Volleyball },
  { name: "Badminton", icon: Dumbbell },
] as const;

export default function HomePage({ role }: HomePageProps) {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingBaseHref =
    role === "user" ? "/booking" : "/pilih-role?next=%2Fbooking";

  const scrollToExplore = useCallback(() => {
    document
      .getElementById("explore-lapangan")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleBooking = useCallback(
    () => navigate(bookingBaseHref),
    [bookingBaseHref, navigate],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const [fieldsData, bookingData] = await Promise.all([
        apiRequest<Field[]>("/api/fields"),
        apiRequest<Booking[]>(`/api/bookings?date=${today}`),
      ]);
      setFields(fieldsData);
      setTodayBookings(bookingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ups, coba lagi ya");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const availabilityMap = useMemo(() => {
    const counts = new Map<number, number>();
    for (const b of todayBookings) {
      if (b.status === "rejected") continue;
      counts.set(b.field_id, (counts.get(b.field_id) ?? 0) + 1);
    }
    return counts;
  }, [todayBookings]);

  return (
    <div className="pb-20">
      {/* ① Hero — fullscreen */}
      <HeroSection
        backgroundImage={heroImage}
        onExplore={scrollToExplore}
        onBooking={handleBooking}
      />

      <div className="mx-auto w-full max-w-7xl space-y-20 px-5 md:px-6 pt-16">
        {/* ③ Gallery */}
        <GallerySection bookingHref={bookingBaseHref} />

        {/* ④ Sport categories */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
                Kategori
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Kategori Olahraga
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pilih olahraga favoritmu dan cek lapangan tersedia.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#0f2d5e]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f5fb] text-[#0f2d5e] group-hover:bg-[#0f2d5e] group-hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">Lagi trending</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⑤ Field recommendations */}
        <section id="explore-lapangan" className="space-y-6">
          <div>
            <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
              Rekomendasi
            </span>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Rekomendasi Lapangan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Slot paling dicari hari ini — amankan sebelum penuh.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0">
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
                const status = bookedCount >= 7 ? "full" : "available";
                const bookingHref =
                  role === "user"
                    ? `/booking/${field.id}`
                    : `/pilih-role?next=${encodeURIComponent(`/booking/${field.id}`)}`;
                return (
                  <div key={field.id}>
                    <FieldCard
                      field={field}
                      status={status}
                      bookingHref={bookingHref}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ⑥ Why Sportify */}
        <VenueAboutSection />

        {/* ⑦ Map / Lokasi */}
        <VenueMapSection />

        {/* ⑧ Contact CTA */}
        <section id="kontak">
          <ContactSection />
        </section>

        {/* ⑨ FAQ */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="inline-block rounded-full border border-[#0f2d5e]/20 bg-[#f0f5fb] text-[#0f2d5e] text-xs font-bold px-4 py-1.5 mb-3 tracking-wide uppercase">
              FAQ
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Pertanyaan Umum
            </h2>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto text-base">
              Jawaban dari pertanyaan yang paling sering kami terima.
            </p>
          </div>
          <FAQAccordion />
        </section>
      </div>
    </div>
  );
}
