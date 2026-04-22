import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Clock3, LoaderCircle } from 'lucide-react';
import type { Booking, Field } from '@/src/types/domain';
import { fetchWithAuth, API } from '@/src/lib/api';
import Badge from '@/src/components/ui/Badge';
import Modal from '@/src/components/ui/Modal';

interface SlotDetailModalProps {
  open: boolean;
  date: Date | null;
  onClose: () => void;
}

const SLOT_START_HOURS = Array.from({ length: 7 }, (_, i) => 13 + i);

export default function SlotDetailModal({ open, date, onClose }: SlotDetailModalProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load fields once when modal opens
  useEffect(() => {
    if (!open) return;
    const fetchFields = async () => {
      try {
        const data = await fetchWithAuth<Field[]>(`${API}/api/fields`);
        setFields(data);
        if (data.length > 0) {
          setSelectedFieldId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    void fetchFields();
  }, [open]);

  // Load bookings by date when date or open state changes
  useEffect(() => {
    if (!open || !date) return;
    const dateKey = format(date, 'yyyy-MM-dd');
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth<Booking[]>(`${API}/api/bookings?date=${dateKey}`);
        // Consider only active bookings (not rejected)
        setBookings(data.filter(b => b.status !== 'rejected'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBookings();
  }, [open, date]);

  // Filter bookings specifically for the selected field
  const fieldBookings = bookings.filter(b => b.field_id === Number(selectedFieldId));

  // Map bookings by start time for easy lookup and slice to HH:mm
  const bookingsByTime = fieldBookings.reduce<Record<string, Booking[]>>((acc, booking) => {
    const startHour = booking.start_time.slice(0, 5); // Ensure HH:mm format
    if (!acc[startHour]) acc[startHour] = [];
    acc[startHour].push(booking);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      title={date ? `Detail Slot - ${new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Detail Slot'}
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Kontrol Filter */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500">Pilih Lapangan</label>
              <select 
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled>-- Memuat --</option>
                {fields.map(f => (
                  <option key={f.id} value={f.id}>{f.name} - {f.type}</option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">Total booking (Lapangan ini): {fieldBookings.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Jam operasional: 13:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {isLoading ? (
            <div className="col-span-2 py-8 flex flex-col items-center justify-center text-slate-400">
               <LoaderCircle className="animate-spin mb-2" />
               <p className="text-sm">Memuat data slot...</p>
            </div>
          ) : (
            SLOT_START_HOURS.map((hour) => {
              const startTime = `${String(hour).padStart(2, '0')}:00`;
              const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
              
              // Cek apakah slot ini sudah dibooking
              const slotBookings = bookingsByTime[startTime] ?? [];
              const isBooked = slotBookings.length > 0;

              return (
                <div 
                  key={startTime} 
                  className={`rounded-2xl border p-4 transition-colors ${
                    isBooked ? 'bg-slate-50 border-slate-200 opacity-80 cursor-not-allowed' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`inline-flex items-center gap-2 text-sm font-semibold ${isBooked ? 'text-slate-500' : 'text-slate-800'}`}>
                      <Clock3 size={15} className={isBooked ? 'text-slate-400' : 'text-slate-500'} />
                      {startTime}-{endTime}
                    </p>
                    <Badge variant={isBooked ? 'rejected' : 'available'}>{isBooked ? 'Booked' : 'Available'}</Badge>
                  </div>

                  {isBooked ? (
                    <div className="mt-3 space-y-2">
                      {slotBookings.map((booking) => (
                        <div key={booking.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs opacity-100 shadow-sm">
                          <p className="font-semibold text-slate-800">
                            {booking.user_name}
                          </p>
                          <p className="text-slate-500 flex justify-between mt-1">
                            <span className="capitalize">{booking.status}</span>
                            <span className="font-medium">Rp {booking.total_price.toLocaleString('id-ID')}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-emerald-600">Slot masih kosong, siap di-booking.</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
