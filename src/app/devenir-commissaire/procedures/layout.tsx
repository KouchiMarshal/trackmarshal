import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procédures de course — Safety Car, FCY, Code 60 | Commissaire",
  description:
    "Safety Car, Full Course Yellow (80 km/h), Code 60, drapeau rouge, départ arrêté, évacuation — les procédures complètes pour commissaires FFSA et FFM, détaillées par discipline.",
  alternates: { canonical: "/devenir-commissaire/procedures" },
  openGraph: {
    title: "Procédures de course — Safety Car, FCY, Code 60",
    description:
      "Guide complet des procédures de course pour commissaires de piste : Safety Car, FCY, Code 60, drapeau rouge. Auto FFSA et moto FFM.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
