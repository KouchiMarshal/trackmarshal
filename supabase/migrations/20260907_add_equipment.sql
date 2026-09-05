-- Produits d'equipement recommandes (page /devenir-commissaire/equipement),
-- avec liens d'affiliation. Gere depuis l'admin.

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tip TEXT,
  url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS equipment_position_idx ON equipment (position);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Lecture publique (affichage sur la page equipement).
DROP POLICY IF EXISTS "equipment_public_read" ON equipment;
CREATE POLICY "equipment_public_read" ON equipment
  FOR SELECT USING (true);

-- Ecritures via routes admin (cle service).
