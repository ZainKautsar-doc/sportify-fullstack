import { pool } from '../lib/db';

export const expireBookings = async () => {
  try {
    // Return booking ids that were updated to rejected
    const { rows } = await pool.query(`
      UPDATE bookings
      SET status = 'rejected'
      WHERE status = 'pending' AND created_at < NOW() - INTERVAL '10 minutes'
      RETURNING id
    `);
    
    if (rows.length > 0) {
      const expiredIds = rows.map(r => r.id);
      // Optional: Update payments related to these bookings to rejected
      await pool.query(`
        UPDATE payments
        SET status = 'rejected'
        WHERE booking_id = ANY($1) AND status = 'pending'
      `, [expiredIds]);
      
      console.log(`[Auto-Expire] Automatically rejected bookings due to 10 min timeout:`, expiredIds);
    }
  } catch (error) {
    console.error('[Auto-Expire] Error auto-expiring bookings:', error);
  }
};
