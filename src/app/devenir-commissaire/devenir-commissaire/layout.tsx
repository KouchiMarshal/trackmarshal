import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir commissaire de piste — Licence FFSA et FFM",
  description:
    "Les étapes pour obtenir votre licence commissaire FFSA (ENCOC, EICOB, Chef de Poste) ou FFM (OFS, OFF). Rejoindre une ASA, formation e-learning, épreuves en observateur.",
  alternates: { canonical: "/devenir-commissaire/devenir-commissaire" },
  openGraph: {
    title: "Devenir commissaire de piste — Licence FFSA et FFM",
    description:
      "Comment devenir commissaire motorsport en France : FFSA auto (circuit, rallye, karting) et FFM moto. Toutes les étapes et licences expliquées.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
