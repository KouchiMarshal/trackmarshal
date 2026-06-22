// Legacy helpers kept for backward compatibility
export function isAutoLicense(type?: string | null): boolean {
  return !!type && /ENCOC|EICOB|EICOACPC|EICOACPR/.test(type);
}

export function isMotoLicense(type?: string | null): boolean {
  return !!type && (type.startsWith("FFM") || type.startsWith("OFS") || type.startsWith("OFF"));
}

export const AUTO_DISCIPLINES = [
  "Rallye",
  "Circuit",
  "Karting",
  "Drift",
  "Endurance",
  "Course de côtes",
  "Slalom",
  "Montée de démonstration",
  "Montée historique",
];

export const MOTO_DISCIPLINES = [
  "Moto Cross",
  "Enduro",
  "Trial",
  "Road Racing",
  "Supermoto",
  "Rallye Moto",
];

export function canApplyToEvent(
  licenses: { category: string; verified: boolean }[],
  discipline?: string | null
): { allowed: boolean; reason?: string } {
  if (!discipline) return { allowed: true };

  const isAuto = AUTO_DISCIPLINES.includes(discipline);
  const isMoto = MOTO_DISCIPLINES.includes(discipline);

  if (!isAuto && !isMoto) return { allowed: true };

  const hasValidAuto = licenses.some(
    (l) => l.category === "auto" && l.verified === true
  );

  const hasValidMoto = licenses.some(
    (l) => l.category === "moto" && l.verified === true
  );

  if (isAuto && !hasValidAuto) {
    return {
      allowed: false,
      reason: "Une licence auto validée est requise pour cet événement.",
    };
  }

  if (isMoto && !hasValidMoto) {
    return {
      allowed: false,
      reason: "Une licence moto validée est requise pour cet événement.",
    };
  }

  return { allowed: true };
}
