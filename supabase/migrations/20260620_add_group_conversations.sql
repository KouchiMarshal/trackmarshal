ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS conversations_event_id_idx ON conversations(event_id);
