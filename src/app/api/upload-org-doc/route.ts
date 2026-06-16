import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Route publique : appelée pendant l'inscription avant que l'utilisateur ait une session
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `org_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("licenses")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from("licenses").getPublicUrl(path);
  return NextResponse.json({ publicUrl });
}
