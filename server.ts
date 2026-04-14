import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

const DUMMY_ACCOUNTS = [
  {
    email: 'admin@sportify.com',
    password: 'admin1234',
    role: 'admin' as const,
    name: 'Super Admin',
  },
  {
    email: 'user@sportify.com',
    password: 'user1234',
    role: 'user' as const,
    name: 'Sobat Sportify',
  },
];

app.use(cors());
app.use(express.json());

// Setup SQLite DB
const db = new Database('database.sqlite');

// Initialize DB Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price_per_hour REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
    booking_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(field_id, booking_date, start_time)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    proof_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert Dummy Data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (role, name) VALUES (?, ?)');
  DUMMY_ACCOUNTS.forEach((account) => {
    insertUser.run(account.role, account.name);
  });
  const venueInfo = db.prepare("INSERT INTO venues (name, location, description) VALUES ('Ayo Venue', 'Jakarta', 'Best sports venue in town')").run();
  
  const insertField = db.prepare("INSERT INTO fields (venue_id, name, type, price_per_hour) VALUES (?, ?, ?, ?)");
  insertField.run(venueInfo.lastInsertRowid, 'Futsal 1', 'Futsal', 150000);
  insertField.run(venueInfo.lastInsertRowid, 'Mini Soccer 1', 'Mini Soccer', 350000);
  insertField.run(venueInfo.lastInsertRowid, 'Padel 1', 'Padel', 200000);
  insertField.run(venueInfo.lastInsertRowid, 'Badminton 1', 'Badminton', 75000);
}

// Setup Multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

app.use('/uploads', express.static(uploadDir));

// --- API ENDPOINTS ---

// Auth (Dummy)
app.post('/api/auth/login', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const fallbackRole = req.body?.role;

  if (!email || !password) {
    if (fallbackRole !== 'admin' && fallbackRole !== 'user') {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }
    const legacyUser = db.prepare('SELECT id, role, name FROM users WHERE role = ? LIMIT 1').get(fallbackRole);
    if (!legacyUser) {
      return res.status(404).json({ error: 'User tidak ditemukan untuk role tersebut' });
    }
    return res.json(legacyUser);
  }

  const matchedAccount = DUMMY_ACCOUNTS.find((account) => account.email === email && account.password === password);
  if (!matchedAccount) {
    return res.status(401).json({ error: 'Email atau password tidak valid' });
  }

  const user = db
    .prepare('SELECT id, role, name FROM users WHERE role = ? LIMIT 1')
    .get(matchedAccount.role) as { id: number; role: 'admin' | 'user'; name: string } | undefined;

  if (!user) {
    return res.status(500).json({ error: 'Dummy user belum tersedia di server' });
  }

  res.json({
    ...user,
    email: matchedAccount.email,
  });
});

// Fields
app.get('/api/fields', (req, res) => {
  const fields = db.prepare('SELECT * FROM fields').all();
  res.json(fields);
});

app.post('/api/fields', (req, res) => {
  const { venue_id, name, type, price_per_hour } = req.body;
  try {
    const info = db.prepare(
      'INSERT INTO fields (venue_id, name, type, price_per_hour) VALUES (?, ?, ?, ?)'
    ).run(venue_id, name, type, price_per_hour);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Field created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/fields/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM fields WHERE id = ?').run(id);
    res.json({ message: 'Field deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings
app.get('/api/bookings', (req, res) => {
  const { date, field_id, user_id } = req.query;
  let query = 'SELECT b.*, f.name as field_name, f.type as field_type, f.price_per_hour, u.name as user_name FROM bookings b JOIN fields f ON b.field_id = f.id JOIN users u ON b.user_id = u.id WHERE 1=1';
  const params: any[] = [];
  
  if (date) {
    query += ' AND b.booking_date = ?';
    params.push(date);
  }
  if (field_id) {
    query += ' AND b.field_id = ?';
    params.push(field_id);
  }
  if (user_id) {
    query += ' AND b.user_id = ?';
    params.push(user_id);
  }
  
  query += ' ORDER BY b.booking_date DESC, b.start_time DESC';
  const bookings = db.prepare(query).all(...params);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const payload = req.body ?? {};
  const userIdRaw = payload.user_id;
  const fieldIdRaw = payload.field_id;
  const bookingDate = payload.booking_date;
  const startTime = payload.start_time;
  const endTime = payload.end_time;
  const userEmail = payload.user_email;

  const fieldId = Number(fieldIdRaw);
  if (!Number.isInteger(fieldId) || fieldId <= 0) {
    return res.status(400).json({ error: 'field_id wajib berupa angka valid' });
  }

  if (typeof bookingDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    return res.status(400).json({ error: 'booking_date wajib berformat yyyy-mm-dd' });
  }

  if (typeof startTime !== 'string' || !/^\d{2}:\d{2}$/.test(startTime)) {
    return res.status(400).json({ error: 'start_time wajib berformat HH:mm' });
  }

  if (typeof endTime !== 'string' || !/^\d{2}:\d{2}$/.test(endTime)) {
    return res.status(400).json({ error: 'end_time wajib berformat HH:mm' });
  }

  let userId = Number(userIdRaw);
  if (!Number.isInteger(userId) || userId <= 0) {
    const legacyRoleFromId = userIdRaw === 'admin_1' ? 'admin' : userIdRaw === 'user_1' ? 'user' : null;
    const roleFromEmail =
      typeof userEmail === 'string' && userEmail.trim().toLowerCase() === 'admin@sportify.com'
        ? 'admin'
        : typeof userEmail === 'string' && userEmail.trim().toLowerCase() === 'user@sportify.com'
          ? 'user'
          : null;
    const resolvedRole = legacyRoleFromId ?? roleFromEmail;

    if (resolvedRole) {
      const mappedUser = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get(resolvedRole) as { id: number } | undefined;
      if (mappedUser) userId = mappedUser.id;
    }
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'user_id tidak valid. Silakan login ulang.' });
  }

  const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(userId) as { id: number } | undefined;
  if (!userExists) {
    return res.status(400).json({ error: 'User tidak ditemukan. Silakan login ulang.' });
  }

  const fieldExists = db.prepare('SELECT id FROM fields WHERE id = ?').get(fieldId) as { id: number } | undefined;
  if (!fieldExists) {
    return res.status(400).json({ error: 'Lapangan tidak ditemukan' });
  }

  // Validate operational hours (13:00 - 20:00)
  const startHour = parseInt(startTime.split(':')[0], 10);
  if (startHour < 13 || startHour >= 20) {
    return res.status(400).json({ error: 'Booking only allowed between 13:00 and 20:00' });
  }

  try {
    const info = db.prepare(
      'INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, fieldId, bookingDate, startTime, endTime);
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Booking created successfully' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Double booking detected. Slot is already taken.' });
    } else if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      res.status(400).json({ error: 'User atau lapangan tidak valid untuk booking ini' });
    } else {
      console.error('Booking create failed:', {
        error,
        payload,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  if (!['pending', 'confirmed', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
  
  if (status === 'confirmed') {
    db.prepare("UPDATE payments SET status = 'verified' WHERE booking_id = ?").run(id);
  } else if (status === 'rejected') {
    db.prepare("UPDATE payments SET status = 'rejected' WHERE booking_id = ?").run(id);
  }

  res.json({ message: 'Booking status updated' });
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = db.prepare('SELECT status FROM bookings WHERE id = ?').get(id) as any;
  
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status !== 'pending') return res.status(400).json({ error: 'Only pending bookings can be cancelled' });

  db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
  res.json({ message: 'Booking cancelled' });
});

// Payments
app.post('/api/payments', upload.single('proof'), (req, res) => {
  const { booking_id, amount } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Payment proof image is required' });
  }

  const proof_url = '/uploads/' + file.filename;

  try {
    const info = db.prepare(
      'INSERT INTO payments (booking_id, amount, proof_url) VALUES (?, ?, ?)'
    ).run(booking_id, amount, proof_url);
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Payment submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/payments/:booking_id', (req, res) => {
  const { booking_id } = req.params;
  const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(booking_id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json(payment);
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get() as any;
  const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get() as any;
  const revenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'verified'").get() as any;

  res.json({
    totalBookings: totalBookings.count,
    pendingBookings: pendingBookings.count,
    revenue: revenue.total || 0
  });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
