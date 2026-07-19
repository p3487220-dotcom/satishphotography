-- =========================================================
-- SATISH PHOTOGRAPHY — BOOKING SYSTEM
-- Supabase SQL Migration
-- Run this in your Supabase SQL Editor
-- =========================================================

-- 1. CREATE THE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  event_type  TEXT NOT NULL DEFAULT 'Wedding Photography',
  event_date  TEXT NOT NULL,
  event_time  TEXT NOT NULL DEFAULT 'Morning (06:00 AM)',
  location    TEXT NOT NULL,
  message     TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. ADD INDEXES FOR COMMON QUERIES
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings (event_date);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- 4a. Anyone can insert (public booking form)
CREATE POLICY "Anyone can create a booking"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4b. Only authenticated admins can SELECT (view bookings)
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- 4c. Only authenticated admins can UPDATE (change status, mark confirmed etc.)
CREATE POLICY "Admins can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4d. Only authenticated admins can DELETE
CREATE POLICY "Admins can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. CREATE AN ADMIN USERS TABLE (optional — for Supabase Auth integration)
-- This table links a Supabase Auth user to the "admin" role.
CREATE TABLE IF NOT EXISTS admin_users (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only the admin user themselves can read their own record
CREATE POLICY "Admins can read own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
