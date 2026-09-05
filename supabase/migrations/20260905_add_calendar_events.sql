-- Calendrier public des épreuves motorsport (contenu edito, distinct des
-- anciens evenements marketplace). Chaque epreuve a sa fiche detaillee qui
-- centralise infos, demarches d'inscription et lien vers le site officiel.

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  discipline TEXT,
  location TEXT,
  region TEXT,
  country TEXT DEFAULT 'France',
  start_date DATE NOT NULL,
  end_date DATE,
  official_url TEXT,
  summary TEXT,
  registration_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existait deja (ancienne version), on ajoute les colonnes manquantes :
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS registration_steps TEXT;

CREATE INDEX IF NOT EXISTS calendar_events_start_date_idx ON calendar_events (start_date);
CREATE UNIQUE INDEX IF NOT EXISTS calendar_events_slug_idx ON calendar_events (slug);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Lecture publique : le calendrier et les fiches sont visibles par tous.
DROP POLICY IF EXISTS "calendar_public_read" ON calendar_events;
CREATE POLICY "calendar_public_read" ON calendar_events
  FOR SELECT USING (true);

-- Les ecritures passent par les routes admin (cle service, qui contourne le RLS).
