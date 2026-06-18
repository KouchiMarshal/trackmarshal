ALTER TABLE applications ADD COLUMN IF NOT EXISTS withdrawal_reason text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS withdrawal_requested_at timestamptz;
