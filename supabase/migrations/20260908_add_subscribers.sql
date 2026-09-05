-- Abonnes a la lettre d'information (capture d'email cote public).
-- Aucune lecture publique : la liste n'est visible que via les routes admin
-- (cle service). L'insertion se fait via /api/subscribe (cle service aussi),
-- donc pas de policy d'insertion publique necessaire.

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscribers_created_at_idx ON subscribers (created_at DESC);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- Pas de policy : aucune lecture/ecriture publique. Tout passe par la cle service.
