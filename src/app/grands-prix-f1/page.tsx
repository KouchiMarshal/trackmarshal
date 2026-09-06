import type { Metadata } from "next";
import F1AdminGate from "@/components/f1/F1AdminGate";

// Page temporairement masquee au public (accessible en apercu par l'admin).
// Pas d'indexation tant qu'elle n'est pas ouverte a tous.
export const metadata: Metadata = {
  title: "Commissaire en Formule 1 — bientôt",
  robots: { index: false, follow: false },
  alternates: { canonical: "/grands-prix-f1" },
};

export const dynamic = "force-dynamic";

export default function GrandsPrixF1Page() {
  return <F1AdminGate />;
}
