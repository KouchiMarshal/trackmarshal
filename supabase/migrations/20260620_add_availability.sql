CREATE TABLE IF NOT EXISTS availability (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  PRIMARY KEY (user_id, date)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability_owner_all" ON availability
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "availability_public_read" ON availability
  FOR SELECT USING (true);
