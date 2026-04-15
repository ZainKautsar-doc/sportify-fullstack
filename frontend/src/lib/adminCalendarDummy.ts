import { addDays, format, setDate, startOfMonth } from 'date-fns';
import type { Booking } from '@/src/types/domain';

function slot(startHour: number) {
  const start = `${String(startHour).padStart(2, '0')}:00`;
  const end = `${String(startHour + 1).padStart(2, '0')}:00`;
  return { start, end };
}

export function buildDummyBookingsForMonth(currentMonth: Date): Booking[] {
  const monthStart = startOfMonth(currentMonth);
  const dayA = setDate(monthStart, 2);
  const dayB = setDate(monthStart, 7);
  const dayC = setDate(monthStart, 15);
  const dayD = setDate(monthStart, 21);

  const source = [
    { day: dayA, user: 'John Doe', field: 'Futsal 1', type: 'Futsal', hour: 15, price: 150000, status: 'confirmed' as const },
    { day: dayA, user: 'Rizky Maulana', field: 'Padel Court A', type: 'Padel', hour: 19, price: 200000, status: 'pending' as const },
    { day: dayB, user: 'Nadia Putri', field: 'Mini Soccer 1', type: 'Mini Soccer', hour: 14, price: 350000, status: 'confirmed' as const },
    { day: dayB, user: 'Arif Setiawan', field: 'Badminton 2', type: 'Badminton', hour: 17, price: 75000, status: 'completed' as const },
    { day: dayC, user: 'Vina Amelia', field: 'Futsal 2', type: 'Futsal', hour: 18, price: 150000, status: 'confirmed' as const },
    { day: dayD, user: 'Daniel Pratama', field: 'Padel Court B', type: 'Padel', hour: 16, price: 200000, status: 'pending' as const },
    { day: addDays(dayD, 1), user: 'Sari Rahma', field: 'Mini Soccer 1', type: 'Mini Soccer', hour: 13, price: 350000, status: 'confirmed' as const },
  ];

  return source.map((item, index) => {
    const bookedDate = format(item.day, 'yyyy-MM-dd');
    const time = slot(item.hour);
    return {
      id: 9000 + index,
      user_id: 100 + index,
      field_id: 200 + index,
      booking_date: bookedDate,
      start_time: time.start,
      end_time: time.end,
      status: item.status,
      total_price: item.price,
      created_at: `${bookedDate}T08:00:00.000Z`,
      field_name: item.field,
      field_type: item.type,
      price_per_hour: item.price,
      user_name: item.user,
    };
  });
}
