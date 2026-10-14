import type { Metadata } from "next";
import CoachingGate from "@/components/coaching/CoachingGate";

// Page privee (admin uniquement), non indexee : brouillon du futur site de
// coaching a domicile, a transferer plus tard vers un nom de domaine dedie.
export const metadata: Metadata = {
  title: "Coaching — brouillon privé",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CoachingPage() {
  return <CoachingGate />;
}
