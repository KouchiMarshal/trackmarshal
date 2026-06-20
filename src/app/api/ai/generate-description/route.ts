import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Clé API Anthropic manquante" }, { status: 503 });
  }

  try {
    const { title, discipline, location, country, date, endDate, marshalsNeeded } = await req.json();

    const dateStr = date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
    const endDateStr = endDate ? new Date(endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

    const prompt = `Tu es un expert en communication pour les événements motorsport. Génère une description attractive et professionnelle en français pour cet événement.

Informations :
- Nom : ${title || "Non renseigné"}
- Discipline : ${discipline || "Non renseigné"}
- Lieu : ${[location, country].filter(Boolean).join(", ") || "Non renseigné"}
- Date : ${dateStr || "Non renseigné"}${endDateStr && endDateStr !== dateStr ? ` au ${endDateStr}` : ""}
- Commissaires recherchés : ${marshalsNeeded || "Non renseigné"}

Rédige une description de 3 paragraphes qui :
1. Présente l'événement avec enthousiasme (contexte, ambiance, enjeux)
2. Met en valeur la discipline et l'importance des commissaires pour la sécurité
3. Invite les commissaires à candidater et souligne les avantages

Ton : professionnel, dynamique, passionné. Pas de titres, pas de puces, pas de markdown.`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.find((b) => b.type === "text")?.text || "";
    return NextResponse.json({ description: text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
