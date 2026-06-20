ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS briefing_acknowledged BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS briefing_acknowledged_at TIMESTAMPTZ;
