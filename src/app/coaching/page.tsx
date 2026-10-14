import type { Metadata } from "next";
import CoachingGate from "@/components/coaching/CoachingGate";

// Page privee (admin uniquement), non indexee : brouillon du futur site de
// coaching a domicile, a transferer plus tard vers un nom de domaine dedie.
export const metadata: Metadata = {
  title: "K-Coaching — coaching sportif à domicile (Kevin Foussard)",
  description:
    "Coaching sportif à domicile avec Kevin Foussard autour d'Alençon, Sées, Mortagne-au-Perche et L'Aigle. Séances personnalisées, du débutant au confirmé, éligibles au crédit d'impôt de 50%.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CoachingPage() {
  return <CoachingGate />;
}
