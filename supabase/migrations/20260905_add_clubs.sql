-- Annuaire des ASA (auto) et clubs (moto) ou l'on peut s'engager comme
-- commissaire de piste. Contenu edito, alimente cote admin.

CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,            -- 'ASA' | 'Club FFM' | 'Ligue' | ...
  region TEXT,
  department TEXT,
  city TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clubs_region_idx ON clubs (region);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Lecture publique (annuaire visible par tous).
DROP POLICY IF EXISTS "clubs_public_read" ON clubs;
CREATE POLICY "clubs_public_read" ON clubs
  FOR SELECT USING (true);

-- Ecritures via routes admin (cle service).
