CREATE TABLE IF NOT EXISTS carpools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  departure_city TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, driver_id)
);

ALTER TABLE carpools ENABLE ROW LEVEL SECURITY;

-- Seuls les commissaires acceptés de l'événement peuvent lire les covoiturages
CREATE POLICY "carpools_read" ON carpools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.event_id = carpools.event_id
        AND a.marshal_id = auth.uid()
        AND a.status = 'accepted'
    )
  );

-- Le conducteur peut gérer sa propre offre (insert/update/delete)
CREATE POLICY "carpools_write" ON carpools
  FOR ALL USING (driver_id = auth.uid())
  WITH CHECK (
    driver_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.event_id = carpools.event_id
        AND a.marshal_id = auth.uid()
        AND a.status = 'accepted'
    )
  );
