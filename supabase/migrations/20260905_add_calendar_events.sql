-- Calendrier public des épreuves motorsport (contenu edito, distinct des
-- anciens evenements marketplace). Chaque epreuve renvoie vers son site officiel.

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  discipline TEXT,
  location TEXT,
  region TEXT,
  country TEXT DEFAULT 'France',
  start_date DATE NOT NULL,
  end_date DATE,
  official_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_start_date_idx ON calendar_events (start_date);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Lecture publique : le calendrier est visible par tous (visiteurs non connectes inclus).
CREATE POLICY "calendar_public_read" ON calendar_events
  FOR SELECT USING (true);

-- Les ecritures passent par les routes admin (cle service, qui contourne le RLS) :
-- aucune policy d'ecriture cote client n'est necessaire.
