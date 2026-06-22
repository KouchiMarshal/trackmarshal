import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
  const licenseId = form.get("licenseId") as string | null;

  if (!file) return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  if (!licenseId) return NextResponse.json({ error: "licenseId manquant" }, { status: 400 });

  // Verify the license belongs to this user
  const { data: license, error: licenseError } = await supabaseAdmin
    .from("licenses")
    .select("id, user_id")
    .eq("id", licenseId)
    .eq("user_id", user.id)
    .single();

  if (licenseError || !license) {
    return NextResponse.json({ error: "Licence introuvable" }, { status: 404 });
  }

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${licenseId}.${ext}`;

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
    .from("licenses")
    .update({ url: publicUrl, verified: false })
    .eq("id", licenseId)
    .eq("user_id", user.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ url: publicUrl });
}
