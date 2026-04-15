import { Request, Response } from 'express';
import { pool } from '../lib/db';

export const uploadPayment = async (req: Request, res: Response): Promise<any> => {
  const { booking_id, amount } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Payment proof image is required' });
  }

  const proof_url = '/uploads/' + file.filename;

  try {
    const { rows } = await pool.query(
      'INSERT INTO payments (booking_id, amount, proof_url) VALUES ($1, $2, $3) RETURNING id',
      [booking_id, amount, proof_url]
    );
    res.status(201).json({ id: rows[0].id, message: 'Payment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayment = async (req: Request, res: Response): Promise<any> => {
  const { booking_id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM payments WHERE booking_id = $1', [booking_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
