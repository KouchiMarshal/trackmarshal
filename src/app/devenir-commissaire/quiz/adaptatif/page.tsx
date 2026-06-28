import type { Metadata } from "next";
import AdaptiveQuiz from "@/components/quiz/AdaptiveQuiz";

export const metadata: Metadata = {
  title: "Quiz adaptatif",
  description:
    "Quiz de commissaire de piste généré par IA qui s'adapte à vos erreurs : drapeaux, procédures, sécurité, rallye. Entraînement personnalisé.",
  alternates: { canonical: "/devenir-commissaire/quiz/adaptatif" },
};

export default function AdaptiveQuizPage() {
  return <AdaptiveQuiz />;
}
