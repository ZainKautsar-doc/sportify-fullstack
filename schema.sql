-- PostgreSQL Schema for Sports Venue Booking

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location TEXT,
  description TEXT
);

CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- Futsal, Mini Soccer, Padel, Badminton
  price_per_hour DECIMAL(10, 2) NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(field_id, booking_date, start_time) -- Prevent double booking
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  proof_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dummy Data
INSERT INTO users (role, name) VALUES ('admin', 'Super Admin'), ('user', 'John Doe');
INSERT INTO venues (name, location, description) VALUES ('Ayo Venue', 'Jakarta', 'Best sports venue in town');
INSERT INTO fields (venue_id, name, type, price_per_hour) VALUES 
(1, 'Futsal 1', 'Futsal', 150000),
(1, 'Mini Soccer 1', 'Mini Soccer', 350000),
(1, 'Padel 1', 'Padel', 200000),
(1, 'Badminton 1', 'Badminton', 75000);
