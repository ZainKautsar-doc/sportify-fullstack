-- Sportify PostgreSQL Schema
-- Run this once to set up the database

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  password    TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fields (lapangan)
CREATE TABLE IF NOT EXISTS fields (
  id             SERIAL PRIMARY KEY,
  name           TEXT    NOT NULL,
  type           TEXT    NOT NULL,
  price_per_hour NUMERIC NOT NULL
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_id     INTEGER     NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  booking_date DATE        NOT NULL,
  start_time   TIME        NOT NULL,
  end_time     TIME        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
  total_price  NUMERIC     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (field_id, booking_date, start_time)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id         SERIAL PRIMARY KEY,
  booking_id INTEGER     NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount     NUMERIC     NOT NULL,
  proof_url  TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed: Admin user (password: admin1234)
-- Hash generated with bcrypt (rounds=10), replace if needed
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'admin@sportify.com', '$2b$10$yJ2.kDwSsE.6sAlkXe2qaeqoXadGXR0KAT2I1m.nYzSZW7.U5E/Wy', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed: Example lapangan
INSERT INTO fields (name, type, price_per_hour) VALUES
  ('Futsal 1',     'Futsal',     150000),
  ('Mini Soccer 1','Mini Soccer', 350000),
  ('Padel 1',      'Padel',      200000),
  ('Badminton 1',  'Badminton',   75000)
ON CONFLICT DO NOTHING;
