import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../lib/db';
import { generateToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Nama wajib diisi (minimal 2 karakter)' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Format email tidak valid' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert ke database
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, 'user') 
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const newUser = rows[0];
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.created_at,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email wajib diisi' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password wajib diisi' });
  }

  try {
    // Cari user berdasarkan email
    const { rows } = await pool.query(
      'SELECT id, name, email, password, role, created_at FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const user = rows[0];

    // Bandingkan password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // ✅ GENERATE TOKEN (INI YANG KURANG)
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return user + token
    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
};
