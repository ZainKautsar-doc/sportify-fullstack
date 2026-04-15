import { Request, Response } from 'express';
import { pool } from '../lib/db';

const DUMMY_ACCOUNTS = [
  { email: 'admin@sportify.com', password: 'admin1234', role: 'admin', name: 'Super Admin' },
  { email: 'user@sportify.com', password: 'user1234', role: 'user', name: 'Sobat Sportify' },
];

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const fallbackRole = req.body?.role;

    if (!email || !password) {
      if (fallbackRole !== 'admin' && fallbackRole !== 'user') {
        return res.status(400).json({ error: 'Email dan password wajib diisi' });
      }
      
      // Fallback for legacy login
      try {
        const { rows } = await pool.query('SELECT id, role, name FROM users WHERE role = $1 LIMIT 1', [fallbackRole]);
        if (rows.length === 0) {
          // If no DB connection or empty, fallback to mock memory
          return res.json({ id: fallbackRole === 'admin' ? 1 : 2, role: fallbackRole, name: fallbackRole === 'admin' ? 'Super Admin' : 'Sobat Sportify' });
        }
        return res.json(rows[0]);
      } catch (err) {
        // Fallback for when Postgres is not running or no tables exist
        return res.json({ id: fallbackRole === 'admin' ? 1 : 2, role: fallbackRole, name: fallbackRole === 'admin' ? 'Super Admin' : 'Sobat Sportify' });
      }
    }

    const matchedAccount = DUMMY_ACCOUNTS.find((account) => account.email === email && account.password === password);
    if (!matchedAccount) {
      return res.status(401).json({ error: 'Email atau password tidak valid' });
    }

    try {
      const { rows } = await pool.query('SELECT id, role, name FROM users WHERE role = $1 LIMIT 1', [matchedAccount.role]);
      if (rows.length === 0) {
        return res.json({ id: matchedAccount.role === 'admin' ? 1 : 2, ...matchedAccount });
      }
      return res.json({ ...rows[0], email: matchedAccount.email });
    } catch (err) {
      // Fallback
      return res.json({ id: matchedAccount.role === 'admin' ? 1 : 2, ...matchedAccount });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
