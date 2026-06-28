import { NextRequest } from "next/server";
import { getAnthropic, AI_MODEL, MARSHAL_KNOWLEDGE, NO_OFFICIAL_PARTNERSHIP } from "@/lib/anthropic";

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

// Schéma de sortie structurée imposé au modèle via un outil forcé.
const QUIZ_TOOL = {
  name: "proposer_quiz",
  description: "Renvoie une liste de questions de quiz à choix multiple pour commissaires de piste.",
  input_schema: {
    type: "object" as const,
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string", description: "L'énoncé de la question, en français." },
            options: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4,
              description: "Exactement 4 propositions de réponse.",
            },
            correct: { type: "integer", minimum: 0, maximum: 3, description: "Index (0-3) de la bonne réponse dans options." },
            explanation: { type: "string", description: "Explication courte de la bonne réponse." },
            topic: { type: "string", description: "Thème de la question (ex. Drapeaux, Procédures, Sécurité)." },
          },
          required: ["question", "options", "correct", "explanation", "topic"],
        },
      },
    },
    required: ["questions"],
  },
};

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
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

  const prompt = `Génère ${count} questions de quiz à choix multiple pour des commissaires de piste (sport auto/moto, France).

Thème : ${theme}.
${adaptiveInstruction}
${avoidInstruction}

Contraintes :
- En français, niveau accessible aux débutants mais rigoureux.
- Exactement 4 propositions par question, une seule correcte.
- Explication courte et pédagogique pour chaque bonne réponse.
- Reste strictement fidèle aux conventions ci-dessous. N'invente pas de règle.
- ${NO_OFFICIAL_PARTNERSHIP}

BASE DE CONNAISSANCES DE RÉFÉRENCE
${MARSHAL_KNOWLEDGE}

Appelle l'outil proposer_quiz avec les questions.`;

  try {
    const response = await getAnthropic().messages.create({
      model: AI_MODEL,
      max_tokens: 4000,
      tools: [QUIZ_TOOL],
      tool_choice: { type: "tool", name: "proposer_quiz" },
      messages: [{ role: "user", content: prompt }],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return Response.json({ error: "Génération impossible pour le moment." }, { status: 502 });
    }

    const raw = (toolUse.input as { questions?: any[] }).questions || [];
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
  } catch (err) {
    console.error("Quiz generation error:", err);
    return Response.json({ error: "Une erreur est survenue lors de la génération." }, { status: 500 });
  }
}
