import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

import './config/passport'; // register passport strategy
import passport from 'passport';

import authRoutes from './routes/auth.routes';
import fieldRoutes from './routes/fields.routes';
import bookingRoutes from './routes/bookings.routes';
import paymentRoutes from './routes/payments.routes';
import adminRoutes from './routes/admin.routes';
import availabilityRoutes from './routes/availability.routes';

const app = express();

// CORS configuration with dynamic origin support
const allowedOrigins = [
  "http://localhost:5173",
  "https://sportifybooking.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request logger for production transparency
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

app.use(express.json());

// Session is needed by passport internally even for stateless JWT flow
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true with HTTPS in prod
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Sportify API Running...');
});

// Static files: serve uploaded images
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/availability', availabilityRoutes);

/**
 * Global Error Handler
 * Ensures all errors are returned as JSON even in production.
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error]:', err.message || err);
  
  const status = err.status || 500;
  const message = err.message || 'Ups, terjadi kesalahan pada server';
  
  res.status(status).json({
    error: message,
  });
});

export default app;
