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
