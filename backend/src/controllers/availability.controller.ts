import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { expireBookings } from '../utils/expireBookings';

const SLOT_HOURS = [13, 14, 15, 16, 17, 18, 19]; // 13:00 – 19:00 (last slot ends at 20:00)

// GET /api/availability?date=YYYY-MM-DD&field_id=1
export const getAvailability = async (req: Request, res: Response): Promise<any> => {
  await expireBookings();
  const { date, field_id } = req.query;

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Parameter date wajib berformat YYYY-MM-DD' });
  }
  if (!field_id) {
    return res.status(400).json({ error: 'Parameter field_id wajib diisi' });
  }

  try {
    // Ambil semua booking di tanggal + lapangan tersebut yang aktif (pending/confirmed)
    const { rows: bookings } = await pool.query(
      `SELECT start_time, end_time 
       FROM bookings 
       WHERE booking_date = $1 AND field_id = $2 AND status IN ('pending', 'confirmed')`,
      [date, field_id]
    );

    // Tandai slot yang sudah di-cover oleh booking
    const bookedHours = new Set<number>();
    for (const booking of bookings) {
      const startH = parseInt(booking.start_time.split(':')[0], 10);
      const endH = parseInt(booking.end_time.split(':')[0], 10);
      for (let h = startH; h < endH; h++) {
        bookedHours.add(h);
      }
    }

    // Generate response: setiap slot 1 jam
    const slots = SLOT_HOURS.map((hour) => ({
      time: `${String(hour).padStart(2, '0')}:00`,
      available: !bookedHours.has(hour),
    }));

    res.status(200).json(slots);
  } catch (error: any) {
    console.error('Error in getAvailability:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
};
