import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

async function verifyLicenseImage(buffer: Uint8Array, mimeType: string) {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const base64 = Buffer.from(buffer).toString("base64");
    const result = await model.generateContent([
      {
        inlineData: { mimeType: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 },
      },
      {
        text: `Analyse cette image. S'agit-il d'une licence sportive officielle (FFSA, FFM, ASA, licence club automobile ou moto) ?

Réponds UNIQUEMENT en JSON avec ce format exact :
{"valid":true,"confidence":"high","message":"Message court en français"}

- valid: true si c'est une licence sportive officielle, false sinon
- confidence: "high", "medium" ou "low"
- message: explication courte (max 80 caractères)

Considère valide : licence FFSA, FFM, ASA, licence club, toute licence sportive auto ou moto officielle.
Considère invalide : selfie, photo quelconque, carte d'identité, passeport, autre document non sportif, image floue ou illisible.`,
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `${user.id}-license.${ext}`;

  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("licenses")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("licenses")
    .getPublicUrl(path);

  const { error: dbError } = await supabaseAdmin
    .from("profiles")
    .update({ license_url: publicUrl, license_verified: false })
    .eq("id", user.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  let aiResult = null;
  if (IMAGE_TYPES.includes(file.type)) {
    aiResult = await verifyLicenseImage(buffer, file.type);
  }

  return NextResponse.json({ publicUrl, aiResult });
}
