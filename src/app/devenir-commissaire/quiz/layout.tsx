import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz commissaire motorsport — Drapeaux, Procédures, Sécurité",
  description:
    "Quiz interactifs pour commissaires de piste : drapeaux FFSA/FFM, procédures de course, sécurité, règlement rallye. Entraînez-vous avant votre licence FFSA ou FFM.",
  alternates: { canonical: "/devenir-commissaire/quiz" },
  openGraph: {
    title: "Quiz commissaire motorsport — Testez vos connaissances",
    description:
      "Testez vos connaissances sur les drapeaux, procédures de sécurité et règlement FFSA/FFM avec nos quiz interactifs pour commissaires de piste.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
