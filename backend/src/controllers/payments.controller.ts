import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { expireBookings } from '../utils/expireBookings';

// POST /api/payments/upload
export const uploadPayment = async (req: Request, res: Response): Promise<any> => {
  await expireBookings();
  const file = req.file;
  const { booking_id } = req.body;

  // Validasi: file wajib ada
  if (!file) {
    return res.status(400).json({ error: 'File bukti pembayaran wajib diupload' });
  }

  // Validasi: booking_id wajib ada
  const bookingId = Number(booking_id);
  if (!booking_id || !Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ error: 'booking_id tidak valid' });
  }

  // Path yang bisa diakses dari browser
  const paymentProof = `/uploads/${file.filename}`;

  try {
    const user = (req as any).user;
    // Cek booking valid dan milik user (jika bukan admin)
    let query = 'SELECT id, total_price, status, user_id FROM bookings WHERE id = $1';
    const params = [bookingId];

    const bookingCheck = await pool.query(query, params);
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking tidak ditemukan' });
    }

    const booking = bookingCheck.rows[0];

    // Check ownership
    if (user.role !== 'admin' && booking.user_id !== user.id) {
       return res.status(403).json({ error: 'Bukan booking milik Anda' });
    }
    if (booking.status === 'confirmed' || booking.status === 'completed') {
      return res.status(400).json({ error: 'Booking sudah dikonfirmasi, tidak bisa upload ulang' });
    }
    if (booking.status === 'rejected') {
      return res.status(400).json({ error: 'Booking sudah kadaluarsa' });
    }

    // Cek apakah sudah ada payment untuk booking ini (update jika ada, insert jika belum)
    const existingPayment = await pool.query(
      'SELECT id FROM payments WHERE booking_id = $1',
      [bookingId]
    );

    let paymentId: number;

    if (existingPayment.rows.length > 0) {
      // Update — ganti proof yang lama
      const { rows } = await pool.query(
        `UPDATE payments 
         SET proof_url = $1, status = 'pending', created_at = NOW()
         WHERE booking_id = $2
         RETURNING id`,
        [paymentProof, bookingId]
      );
      paymentId = rows[0].id;
      console.log(`[Payment] Updated payment #${paymentId} for booking #${bookingId}`);
    } else {
      // Insert baru
      const { rows } = await pool.query(
        `INSERT INTO payments (booking_id, payment_proof, amount, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id`,
        [bookingId, paymentProof, booking.total_price]
      );
      paymentId = rows[0].id;
      console.log(`[Payment] Created payment #${paymentId} for booking #${bookingId}`);
    }

    res.status(201).json({
      id: paymentId,
      booking_id: bookingId,
      proof_url: paymentProof,
      status: 'pending',
      message: 'Bukti pembayaran berhasil diupload',
    });
  } catch (error: any) {
    console.error('[Payment] Upload error:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
};

// GET /api/payments/:booking_id
export const getPayment = async (req: Request, res: Response): Promise<any> => {
  await expireBookings();
  const { booking_id } = req.params;
  const user = (req as any).user;

  try {
    // 1. Check booking ownership
    const bookingRes = await pool.query('SELECT user_id FROM bookings WHERE id = $1', [booking_id]);
    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Booking tidak ditemukan' });
    }

    if (user.role !== 'admin' && bookingRes.rows[0].user_id !== user.id) {
      return res.status(403).json({ error: 'Bukan booking milik Anda' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [booking_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bukti pembayaran belum ditemukan' });
    }
    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error('[Payment] Get error:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
};
