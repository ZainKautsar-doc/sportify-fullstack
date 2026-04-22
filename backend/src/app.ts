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

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sportifybooking.vercel.app"
  ],
  credentials: true
})
);

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

export default app;
