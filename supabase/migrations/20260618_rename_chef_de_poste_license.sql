-- Rename "EICOACPC - Chef de poste" → "EICOACPC - CHEF DE POSTE CIRCUIT"
-- for all existing profiles

UPDATE profiles
SET license_type = 'EICOACPC - CHEF DE POSTE CIRCUIT'
WHERE license_type = 'EICOACPC - Chef de poste';
