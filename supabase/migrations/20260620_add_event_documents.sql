CREATE TABLE IF NOT EXISTS event_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE event_documents ENABLE ROW LEVEL SECURITY;
-- Organizer can do everything on their event's documents
CREATE POLICY "docs_organizer_all" ON event_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events e WHERE e.id = event_documents.event_id AND e.organizer_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM events e WHERE e.id = event_documents.event_id AND e.organizer_id = auth.uid())
  );
-- Accepted marshals can read documents
CREATE POLICY "docs_marshal_read" ON event_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.event_id = event_documents.event_id
        AND a.marshal_id = auth.uid()
        AND a.status = 'accepted'
    )
  );
