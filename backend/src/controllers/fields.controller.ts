import { Request, Response } from 'express';
import { pool } from '../lib/db';

const DUMMY_FIELDS = [
  { id: 1, venue_id: 1, name: 'Futsal 1', type: 'Futsal', price_per_hour: 150000 },
  { id: 2, venue_id: 1, name: 'Mini Soccer 1', type: 'Mini Soccer', price_per_hour: 350000 },
  { id: 3, venue_id: 1, name: 'Padel 1', type: 'Padel', price_per_hour: 200000 },
  { id: 4, venue_id: 1, name: 'Badminton 1', type: 'Badminton', price_per_hour: 75000 },
];

export const getFields = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rows } = await pool.query('SELECT * FROM fields');
    if (rows.length === 0) return res.json(DUMMY_FIELDS);
    res.json(rows);
  } catch (error) {
    // Fallback to dummy data
    res.json(DUMMY_FIELDS);
  }
};

export const createField = async (req: Request, res: Response): Promise<any> => {
  const { venue_id, name, type, price_per_hour } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO fields (venue_id, name, type, price_per_hour) VALUES ($1, $2, $3, $4) RETURNING id',
      [venue_id, name, type, price_per_hour]
    );
    res.status(201).json({ id: rows[0].id, message: 'Field created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteField = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM fields WHERE id = $1', [id]);
    res.json({ message: 'Field deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
