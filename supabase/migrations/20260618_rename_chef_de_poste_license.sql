-- Rename "EICOACPC - Chef de poste" → "EICOACPC - CHEF DE POSTE CIRCUIT"
-- for all existing profiles (license_type and license_type_2)

UPDATE profiles
SET license_type = 'EICOACPC - CHEF DE POSTE CIRCUIT'
WHERE license_type = 'EICOACPC - Chef de poste';

UPDATE profiles
SET license_type_2 = 'EICOACPC - CHEF DE POSTE CIRCUIT'
WHERE license_type_2 = 'EICOACPC - Chef de poste';
