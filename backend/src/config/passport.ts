import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../lib/db';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(new Error('No email returned from Google'), undefined);
        }

        // 1. Check if user already exists by email
        const existing = await pool.query(
          'SELECT id, name, email, role, google_id FROM users WHERE email = $1',
          [email]
        );

        if (existing.rows.length > 0) {
          const user = existing.rows[0];

          // Link google_id if not already linked
          if (!user.google_id) {
            await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [
              googleId,
              user.id,
            ]);
            user.google_id = googleId;
          }

          return done(null, user);
        }

        // 2. Create new user for first-time Google login
        const { rows } = await pool.query(
          `INSERT INTO users (name, email, password, google_id, role)
           VALUES ($1, $2, NULL, $3, 'user')
           RETURNING id, name, email, role, google_id`,
          [name, email, googleId]
        );

        return done(null, rows[0]);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// Minimal serialization – we don't use sessions for JWT flow
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

export default passport;
