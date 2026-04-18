import { Request, Response } from 'express';
import { pool } from '../lib/db';

export const getBookings = async (req: Request, res: Response): Promise<any> => {
  const { date, field_id, user_id } = req.query;
  try {
    let query = `
      SELECT b.id, b.user_id, b.field_id, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date, b.start_time, b.end_time, b.status, b.total_price,
             f.name as field_name, f.type as field_type, f.price_per_hour, u.name as user_name 
      FROM bookings b 
      JOIN fields f ON b.field_id = f.id 
      JOIN users u ON b.user_id = u.id 
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    const user = (req as any).user;
    const { date, field_id, user_id } = req.query;

    if (date) {
      query += ` AND b.booking_date = $${paramIndex++}`;
      params.push(date);
    }
    if (field_id) {
      query += ` AND b.field_id = $${paramIndex++}`;
      params.push(field_id);
    }

    // Force user filtration if not admin, or use provided user_id if admin
    if (user.role === 'admin') {
      if (user_id) {
        query += ` AND b.user_id = $${paramIndex++}`;
        params.push(user_id);
      }
    } else {
      // For normal users, ALWAYS filter by their own ID
      query += ` AND b.user_id = $${paramIndex++}`;
      params.push(user.id);
    }

    query += ' ORDER BY b.booking_date DESC, b.start_time DESC';
    const { rows } = await pool.query(query, params);

    // Explicitly return JSON array
    res.status(200).json(rows);
  } catch (error: any) {
    console.error('Error in getBookings:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown Error') });
  }
};

export const getBookingSummary = async (req: Request, res: Response): Promise<any> => {
  const { month } = req.query; // format YYYY-MM
  try {
    let query = `
      SELECT TO_CHAR(booking_date, 'YYYY-MM-DD') as booking_date, COUNT(*) as total
      FROM bookings
      WHERE status != 'rejected'
    `;
    const params: any[] = [];

    if (month && typeof month === 'string') {
      query += ` AND TO_CHAR(booking_date, 'YYYY-MM') = $1`;
      params.push(month);
    }

    query += ` GROUP BY booking_date ORDER BY booking_date ASC`;
    const { rows } = await pool.query(query, params);

    // Parse total to integer since COUNT returns string in pg
    const formatted = rows.map((r: any) => ({
      booking_date: r.booking_date,
      total: parseInt(r.total, 10)
    }));

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error('Error in getBookingSummary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<any> => {
  const { field_id, booking_date, start_time, end_time } = req.body;

  // Basic Validation
  const user = (req as any).user;
  const userId = user.id;
  const fieldId = Number(field_id);

  if (!Number.isInteger(fieldId) || fieldId <= 0) return res.status(400).json({ error: 'field_id wajib berupa angka valid' });
  if (typeof booking_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) return res.status(400).json({ error: 'booking_date wajib berformat yyyy-mm-dd' });
  if (typeof start_time !== 'string' || !/^\d{2}:\d{2}$/.test(start_time)) return res.status(400).json({ error: 'start_time wajib berformat HH:mm' });
  if (typeof end_time !== 'string' || !/^\d{2}:\d{2}$/.test(end_time)) return res.status(400).json({ error: 'end_time wajib berformat HH:mm' });

  const startHour = parseInt(start_time.split(':')[0], 10);
  const endHour = parseInt(end_time.split(':')[0], 10);

  if (startHour < 13 || startHour >= 20) return res.status(400).json({ error: 'Booking only allowed between 13:00 and 20:00' });
  if (startHour >= endHour) return res.status(400).json({ error: 'Waktu selesai harus setelah waktu mulai (Minimal durasi 1 jam)' });

  const duration = endHour - startHour;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check if field exists and retrieve price_per_hour
    const fieldRes = await client.query('SELECT price_per_hour FROM fields WHERE id = $1', [fieldId]);
    if (fieldRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Lapangan (field) tidak ditemukan' });
    }

    // 2. Check if user exists
    const userRes = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const pricePerHour = parseFloat(fieldRes.rows[0].price_per_hour);
    const totalPrice = pricePerHour * duration;
    const status = 'pending';

    // 3. Insert into database
    const insertRes = await client.query(
      `INSERT INTO bookings 
        (user_id, field_id, booking_date, start_time, end_time, status, total_price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, user_id, field_id, booking_date, start_time, end_time, status, total_price`,
      [userId, fieldId, booking_date, start_time, end_time, status, totalPrice]
    );

    await client.query('COMMIT');

    // Return complete booking document back to frontend
    res.status(201).json(insertRes.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error in createBooking:', error);

    if (error.code === '23505') {
      res.status(409).json({ error: 'Jadwal bentrok. Slot waktu tersebut sudah di-booking.' });
    } else {
      res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown Error') });
    }
  } finally {
    client.release();
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<any> => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'confirmed', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    if (status === 'confirmed') {
      await pool.query("UPDATE payments SET status = 'verified' WHERE booking_id = $1", [id]);
    } else if (status === 'rejected') {
      await pool.query("UPDATE payments SET status = 'rejected' WHERE booking_id = $1", [id]);
    }
    res.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT status FROM bookings WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    if (rows[0].status !== 'pending') return res.status(400).json({ error: 'Only pending bookings can be cancelled' });

    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
