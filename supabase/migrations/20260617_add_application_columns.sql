-- Add post assignment, attendance tracking columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS post text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS attended boolean;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS attended_note text;

-- Add hotel_detail to events table if not already present
ALTER TABLE events ADD COLUMN IF NOT EXISTS hotel_detail text;

-- Add event end date for multi-day events
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_end_date date;
