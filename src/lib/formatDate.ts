export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Date à confirmer";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(
  startStr: string | null | undefined,
  endStr: string | null | undefined
): string {
  if (!startStr) return "Date à confirmer";
  const start = new Date(startStr);
  if (isNaN(start.getTime())) return startStr;

  if (!endStr) {
    return start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  const end = new Date(endStr);
  if (isNaN(end.getTime())) {
    return start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  // Same day
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  // Same month & year → "14 – 16 juin 2025"
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} – ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  }

  // Same year → "14 juin – 2 juillet 2025"
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  }

  // Different years
  return `${start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} – ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}
