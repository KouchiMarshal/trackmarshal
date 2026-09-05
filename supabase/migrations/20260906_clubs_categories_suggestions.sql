-- Categorie (pour les 3 sections) et prerequis licence sur le repertoire,
-- + table des suggestions envoyees par les visiteurs (moderation admin).

ALTER TABLE clubs ADD COLUMN IF NOT EXISTS category TEXT;          -- 'club' | 'circuit' | 'evenement'
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS license_required TEXT;  -- ex. 'Licence Internationale B'

CREATE TABLE IF NOT EXISTS club_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT,            -- 'annuaire' (club/contact) | 'calendrier' (date/épreuve)
  name TEXT NOT NULL,
  category TEXT,
  region TEXT,
  city TEXT,
  contact TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existait deja (version precedente) :
ALTER TABLE club_suggestions ADD COLUMN IF NOT EXISTS kind TEXT;

ALTER TABLE club_suggestions ENABLE ROW LEVEL SECURITY;
-- Pas de lecture ni d'ecriture publique : tout passe par les routes serveur
-- (cle service). Les visiteurs soumettent via /api/club-suggestions.
