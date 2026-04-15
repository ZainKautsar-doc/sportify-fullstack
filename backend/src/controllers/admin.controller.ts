import { Request, Response } from 'express';
import { pool } from '../lib/db';

export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const [totalBookings, pendingBookings, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM bookings' ),
      pool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'"),
      pool.query("SELECT SUM(amount) as total FROM payments WHERE status = 'verified'")
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
