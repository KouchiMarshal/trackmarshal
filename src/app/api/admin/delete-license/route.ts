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

  const { data: adminProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { targetUserId, licenseField } = await req.json();
  if (!targetUserId || !["1", "2"].includes(licenseField)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const urlField = licenseField === "1" ? "license_url" : "license_url_2";

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select(urlField)
    .eq("id", targetUserId)
    .single();

  const licenseUrl = profile?.[urlField] as string | null;

  if (licenseUrl) {
    // Extract storage path from public URL: everything after /licenses/
    const match = licenseUrl.match(/\/licenses\/(.+)$/);
    if (match?.[1]) {
      await supabaseAdmin.storage.from("licenses").remove([match[1]]);
    }
  }

  // Clear DB fields
  if (licenseField === "1") {
    await supabaseAdmin.from("profiles").update({
      license_url: null,
      license_verified: false,
    }).eq("id", targetUserId);
  } else {
    await supabaseAdmin.from("profiles").update({
      license_url_2: null,
      license_type_2: null,
      license_number_2: null,
      license_verified_2: false,
    }).eq("id", targetUserId);
  }

  return NextResponse.json({ ok: true });
}
