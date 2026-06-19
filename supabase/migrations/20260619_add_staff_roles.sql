-- Add staff_roles JSONB column to events: array of {role, count} objects
ALTER TABLE events ADD COLUMN IF NOT EXISTS staff_roles JSONB DEFAULT '[]'::jsonb;

-- Add desired_role column to applications: role the commissaire applied for
ALTER TABLE applications ADD COLUMN IF NOT EXISTS desired_role TEXT;
