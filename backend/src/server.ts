import app from './app';
import { pool } from "./lib/db";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.routes';
import fieldRoutes from './routes/fields.routes';
import bookingRoutes from './routes/bookings.routes';
import paymentRoutes from './routes/payments.routes';
import adminRoutes from './routes/admin.routes';
import availabilityRoutes from './routes/availability.routes';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Debug logs for production connectivity check
console.log('--- Production Config Check ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'PRESENT (Masked)' : 'MISSING');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'NOT SET (using default)');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET (localhost:5173)');
console.log('-------------------------------');

// test DB connection
pool.query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("DB Connection Error:", err.message);
    if (process.env.DATABASE_URL) {
      console.error("Check if Railway DATABASE_URL includes all necessary params and SSL is allowed.");
    }
  });

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sportifybooking.vercel.app"
  ],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/availability', availabilityRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
