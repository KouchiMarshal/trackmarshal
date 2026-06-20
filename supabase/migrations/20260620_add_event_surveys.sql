CREATE TABLE IF NOT EXISTS event_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  marshal_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organisation INTEGER NOT NULL CHECK (organisation >= 1 AND organisation <= 5),
  securite INTEGER NOT NULL CHECK (securite >= 1 AND securite <= 5),
  ambiance INTEGER NOT NULL CHECK (ambiance >= 1 AND ambiance <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, marshal_id)
);
ALTER TABLE event_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "survey_marshal_write" ON event_surveys
  FOR INSERT WITH CHECK (auth.uid() = marshal_id);
CREATE POLICY "survey_marshal_read_own" ON event_surveys
  FOR SELECT USING (auth.uid() = marshal_id);
CREATE POLICY "survey_marshal_update_own" ON event_surveys
  FOR UPDATE USING (auth.uid() = marshal_id);
CREATE POLICY "survey_organizer_read" ON event_surveys
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_surveys.event_id AND e.organizer_id = auth.uid()
    )
  );
