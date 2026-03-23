-- Enable Realtime for the appointments table
ALTER TABLE appointments REPLICA IDENTITY FULL;
-- This ensures that the 'old' record is available in update/delete events if needed,
-- and enables the table for Supabase Realtime.
