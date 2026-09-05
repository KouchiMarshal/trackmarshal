-- Repertoire "Ou s'inscrire comme commissaire" : circuits, organisateurs,
-- ASA (auto) et clubs (moto), avec leurs demarches d'inscription et contacts.
-- Contenu edito, alimente cote admin.

CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,            -- 'Circuit' | 'ASA' | 'Club FFM' | 'Organisateur' | 'Ligue' | ...
  region TEXT,
  department TEXT,
  city TEXT,
  description TEXT,          -- courte presentation ("Pour officier sur le circuit de Monaco...")
  registration_steps TEXT,  -- les demarches d'inscription
  website TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existait deja (version precedente), on ajoute les colonnes :
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS registration_steps TEXT;

CREATE INDEX IF NOT EXISTS clubs_region_idx ON clubs (region);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Lecture publique (repertoire visible par tous).
DROP POLICY IF EXISTS "clubs_public_read" ON clubs;
CREATE POLICY "clubs_public_read" ON clubs
  FOR SELECT USING (true);

-- Ecritures via routes admin (cle service).
