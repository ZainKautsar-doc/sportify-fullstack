import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { expireBookings } from '../utils/expireBookings';

export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  await expireBookings();
  try {
    const [totalBookings, pendingBookings, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM bookings'),
      pool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'"),
      pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'verified'")
    ]);

    res.json({
      totalBookings: parseInt(totalBookings.rows[0].count, 10),
      pendingBookings: parseInt(pendingBookings.rows[0].count, 10),
      revenue: parseFloat(revenue.rows[0].total) || 0
    });
  } catch (error) {
    console.error(error);
    // Fallback to zeros if db fails
    res.json({
      totalBookings: 0,
      pendingBookings: 0,
      revenue: 0
    });
  }
};

export const getAdminPayments = async (req: Request, res: Response): Promise<any> => {
  await expireBookings();
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id AS payment_id,
        b.id AS booking_id,
        f.name AS field_name,
        b.booking_date,
        b.start_time,
        b.end_time,
        p.status,
        p.payment_proof,
        u.name AS user_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN fields f ON b.field_id = f.id
      JOIN users u ON b.user_id = u.id
      ORDER BY p.id DESC
    `);

    // Format response to match required output
    const formatted = rows.map(r => ({
      payment_id: r.payment_id,
      booking_id: r.booking_id,
      field_name: r.field_name,
      user_name: r.user_name,
      booking_date: r.booking_date,
      time: `${r.start_time.substring(0, 5)} - ${r.end_time.substring(0, 5)}`,
      status: r.status,
      payment_proof: r.payment_proof // user requested just the filename in raw data if needed, but the static route is /uploads/filename. We'll return just the filename or the full route based on how it's saved. Usually proof_url includes '/uploads/'.
    }));

    // If proof_url is stored as '/uploads/filename.jpg', let's format it nicely:
    res.json(formatted);
  } catch (error: any) {
    console.error('[Admin] getAdminPayments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approvePayment = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const paymentId = Number(id);

  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return res.status(400).json({ error: 'Payment ID tidak valid' });
  }

  try {
    const paymentCheck = await pool.query('SELECT booking_id FROM payments WHERE id = $1', [paymentId]);
    if (paymentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Payment tidak ditemukan' });
    }
    const bookingId = paymentCheck.rows[0].booking_id;

    await pool.query('BEGIN');
    await pool.query("UPDATE payments SET status = 'verified' WHERE id = $1", [paymentId]);
    await pool.query("UPDATE bookings SET status = 'confirmed' WHERE id = $1", [bookingId]);
    await pool.query('COMMIT');

    res.json({ message: 'Pembayaran disetujui, booking dikonfirmasi' });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => { });
    console.error('[Admin] approvePayment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rejectPayment = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const paymentId = Number(id);

  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return res.status(400).json({ error: 'Payment ID tidak valid' });
  }

  try {
    const paymentCheck = await pool.query('SELECT booking_id FROM payments WHERE id = $1', [paymentId]);
    if (paymentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Payment tidak ditemukan' });
    }
    const bookingId = paymentCheck.rows[0].booking_id;

    await pool.query('BEGIN');
    await pool.query("UPDATE payments SET status = 'rejected' WHERE id = $1", [paymentId]);
    await pool.query("UPDATE bookings SET status = 'rejected' WHERE id = $1", [bookingId]);
    await pool.query('COMMIT');

    res.json({ message: 'Pembayaran ditolak' });
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => { });
    console.error('[Admin] rejectPayment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
