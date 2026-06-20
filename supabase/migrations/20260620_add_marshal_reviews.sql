CREATE TABLE IF NOT EXISTS marshal_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marshal_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (marshal_id, event_id)
);

ALTER TABLE marshal_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marshal_reviews_public_read" ON marshal_reviews
  FOR SELECT USING (true);

CREATE POLICY "marshal_reviews_owner_write" ON marshal_reviews
  FOR ALL USING (auth.uid() = marshal_id) WITH CHECK (auth.uid() = marshal_id);
