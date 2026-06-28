import { NextRequest } from "next/server";
import { geminiJSON, hasGeminiKey, MARSHAL_KNOWLEDGE, NO_OFFICIAL_PARTNERSHIP } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

const THEMES = [
  "Tout le programme",
  "Les drapeaux",
  "Les procédures et neutralisations",
  "Licences et institutions",
  "Épreuves et rôles",
  "Situations et réflexes",
  "Spécial rallye",
  "Sécurité et interventions",
];

export async function POST(req: NextRequest) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "Génération indisponible (configuration manquante)." }, { status: 503 });
  }

  let body: { theme?: string; count?: number; weakTopics?: string[]; previousQuestions?: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const theme = THEMES.includes(body.theme || "") ? body.theme! : "Tout le programme";
  const count = Math.min(Math.max(Number(body.count) || 6, 3), 10);
  const weak = (body.weakTopics || []).filter((t) => typeof t === "string").slice(0, 12);
  const previous = (body.previousQuestions || []).filter((q) => typeof q === "string").slice(0, 40);

  const adaptiveInstruction = weak.length
    ? `L'utilisateur a fait des erreurs sur ces thèmes : ${weak.join(", ")}. Concentre EN PRIORITÉ les questions sur ces points faibles pour l'aider à progresser.`
    : "Couvre un éventail représentatif du thème demandé.";

  const avoidInstruction = previous.length
    ? `Ne répète AUCUNE de ces questions déjà posées :\n- ${previous.join("\n- ")}`
    : "";

  const SYSTEM = `Tu es formateur de commissaires de piste (sport auto/moto, France). Tu génères des questions de quiz à choix multiple en français, rigoureuses et fidèles aux conventions officielles. ${NO_OFFICIAL_PARTNERSHIP}

BASE DE CONNAISSANCES DE RÉFÉRENCE
${MARSHAL_KNOWLEDGE}`;

  const prompt = `Génère ${count} questions de quiz à choix multiple pour des commissaires de piste.

Thème : ${theme}.
${adaptiveInstruction}
${avoidInstruction}

Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, de la forme exacte :
{
  "questions": [
    {
      "question": "énoncé de la question",
      "options": ["proposition A", "proposition B", "proposition C", "proposition D"],
      "correct": 0,
      "explanation": "explication courte de la bonne réponse",
      "topic": "thème (ex. Drapeaux, Procédures, Sécurité)"
    }
  ]
}

Contraintes :
- En français, niveau accessible aux débutants mais rigoureux.
- Exactement 4 propositions par question, une seule correcte.
- "correct" est l'index (0 à 3) de la bonne réponse dans "options".
- Ne reprends pas mot pour mot la base de connaissances ; reformule en questions.`;

  try {
    const data = await geminiJSON({ system: SYSTEM, prompt });
    const raw: any[] = Array.isArray(data?.questions) ? data.questions : [];

    // Validation/normalisation défensive avant envoi au client.
    const questions = raw
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every((o: any) => typeof o === "string") &&
          Number.isInteger(q.correct) &&
          q.correct >= 0 &&
          q.correct <= 3,
      )
      .map((q, i) => ({
        id: i + 1,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: typeof q.explanation === "string" ? q.explanation : "",
        topic: typeof q.topic === "string" ? q.topic : theme,
      }));

    if (questions.length === 0) {
      return Response.json({ error: "Aucune question générée. Réessaie." }, { status: 502 });
    }

    return Response.json({ questions });
  } catch (err: any) {
    console.error("Quiz generation error:", err);
    return Response.json(
      { error: "Génération impossible : " + (err?.message || "erreur inconnue") },
      { status: 500 },
    );
  }
}
