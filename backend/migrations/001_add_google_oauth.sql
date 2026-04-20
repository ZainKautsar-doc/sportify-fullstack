-- Migration: Add google_id column and make password nullable
-- Run this once against your sportify_db database

ALTER TABLE users
  ALTER COLUMN password DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
