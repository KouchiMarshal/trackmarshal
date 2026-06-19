import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Types d'épreuves motorsport — Circuit, Rallye, Karting, Motocross",
  description:
    "Spécificités de chaque discipline pour le commissaire de piste : circuit asphalte, rallye, course de côte, karting, autocross, drift, vitesse moto, motocross, enduro, trial.",
  alternates: { canonical: "/devenir-commissaire/epreuves" },
  openGraph: {
    title: "Types d'épreuves motorsport — Guide commissaire de piste",
    description:
      "Circuit, rallye, côte, karting, motocross, enduro — les particularités de chaque discipline vues par le commissaire. Auto FFSA et moto FFM.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
