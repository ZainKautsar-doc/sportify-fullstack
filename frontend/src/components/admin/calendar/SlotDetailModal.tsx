import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock3 } from 'lucide-react';
import type { Booking } from '@/src/types/domain';
import Badge from '@/src/components/ui/Badge';
import Modal from '@/src/components/ui/Modal';

interface SlotDetailModalProps {
  open: boolean;
  date: Date | null;
  bookings: Booking[];
  onClose: () => void;
}

const SLOT_START_HOURS = Array.from({ length: 7 }, (_, i) => 13 + i);

export default function SlotDetailModal({ open, date, bookings, onClose }: SlotDetailModalProps) {
  const dateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const dayBookings = bookings.filter((booking) => booking.booking_date === dateKey && booking.status !== 'rejected');

  const bookingsByTime = dayBookings.reduce<Record<string, Booking[]>>((acc, booking) => {
    if (!acc[booking.start_time]) acc[booking.start_time] = [];
    acc[booking.start_time].push(booking);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      title={date ? `Detail Slot ${format(date, 'EEEE, d MMMM yyyy', { locale: id })}` : 'Detail Slot'}
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">Total booking hari ini: {dayBookings.length}</p>
          <p className="mt-1 text-xs text-slate-500">Jam operasional: 13:00 - 20:00</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SLOT_START_HOURS.map((hour) => {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            const slotBookings = bookingsByTime[startTime] ?? [];
            const booked = slotBookings.length > 0;

            return (
              <div key={startTime} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Clock3 size={15} className="text-slate-500" />
                    {startTime}-{endTime}
                  </p>
                  <Badge variant={booked ? 'rejected' : 'available'}>{booked ? 'Booked' : 'Available'}</Badge>
                </div>

                {booked ? (
                  <div className="mt-3 space-y-2">
                    {slotBookings.map((booking) => (
                      <div key={booking.id} className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs">
                        <p className="font-semibold text-slate-800">
                          {booking.start_time}-{booking.end_time} {booking.user_name}
                        </p>
                        <p className="text-slate-500">{booking.field_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-emerald-600">Slot masih kosong, siap di-booking.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
