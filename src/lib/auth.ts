// src/lib/auth.ts
// Admin authentication helpers — now uses Supabase Auth
// Supabase Auth sessions are managed via @supabase/ssr middleware
// and the api/admin/* routes.
//
// To create the admin user in Supabase:
//   1. Go to your Supabase dashboard → Authentication → Users → Add User
//   2. Set email + password (store these in .env.local as ADMIN_EMAIL)
//   3. The admin dashboard login form uses these credentials
//
// See supabase/migrations/20260719_bookings.sql for RLS policies
export {};
