-- Migration to allow re-booking of rejected/expired slots
DROP INDEX IF EXISTS unique_booking_slot;

-- Update status constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'expired', 'cancelled'));

-- Create partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS bookings_no_overlap_idx ON bookings (field_id, booking_date, start_time) 
WHERE (status IN ('pending', 'confirmed'));
