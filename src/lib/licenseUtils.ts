export const AUTO_DISCIPLINES = ["Rallye", "Circuit", "Karting", "Drift", "Endurance"];
export const MOTO_DISCIPLINES = ["Moto Cross", "Enduro", "Trial", "Road Racing", "Supermoto", "Rallye Moto"];

export function isAutoLicense(type?: string | null): boolean {
  return !!type && /ENCOC|EICOB|EICOACPC|EICOACPR/.test(type);
}

export function isMotoLicense(type?: string | null): boolean {
  return !!type && (type.startsWith("FFM") || type.startsWith("OFS") || type.startsWith("OFF"));
}

export function canApplyToEvent(
  profile: {
    license_type?: string | null;
    license_verified?: boolean | null;
    license_type_2?: string | null;
    license_verified_2?: boolean | null;
  },
  discipline?: string | null
): { allowed: boolean; reason?: string } {
  if (!discipline) return { allowed: true };

  const isAuto = AUTO_DISCIPLINES.includes(discipline);
  const isMoto = MOTO_DISCIPLINES.includes(discipline);

  if (!isAuto && !isMoto) return { allowed: true };

  const hasValidAuto =
    (isAutoLicense(profile.license_type) && !!profile.license_verified) ||
    (isAutoLicense(profile.license_type_2) && !!profile.license_verified_2);

  const hasValidMoto =
    (isMotoLicense(profile.license_type) && !!profile.license_verified) ||
    (isMotoLicense(profile.license_type_2) && !!profile.license_verified_2);

  if (isAuto && !hasValidAuto) {
    return { allowed: false, reason: "Une licence FFSA (auto) validée est requise pour cet événement." };
  }
  if (isMoto && !hasValidMoto) {
    return { allowed: false, reason: "Une licence FFM (moto) validée est requise pour cet événement." };
  }

  return { allowed: true };
}
