import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAILS = [
  "foussardk@gmail.com",
  ...(process.env.NEXT_PUBLIC_ADMIN_EMAIL ? [process.env.NEXT_PUBLIC_ADMIN_EMAIL] : []),
];

async function getAdminUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;

  const email = user.email || "";
  const isAdmin =
    ADMIN_EMAILS.includes(email) ||
    user.user_metadata?.role === "admin";

  if (!isAdmin) return null;
  return user;
}

export async function PATCH(req: NextRequest) {
  const adminUser = await getAdminUser(req);
  if (!adminUser) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { licenseId, type, category, number, asa } = body;
  if (!licenseId) return NextResponse.json({ error: "licenseId manquant" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("licenses")
    .update({ type, category, number, asa })
    .eq("id", licenseId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ license: data });
}

export async function POST(req: NextRequest) {
  const adminUser = await getAdminUser(req);
  if (!adminUser) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { licenseId, action } = body;

  if (!licenseId || !["verify", "reject"].includes(action)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Fetch the license with user profile
  const { data: license, error: fetchError } = await supabaseAdmin
    .from("licenses")
    .select("*, profiles(id, full_name, email)")
    .eq("id", licenseId)
    .single();

  if (fetchError || !license) {
    return NextResponse.json({ error: "Licence introuvable" }, { status: 404 });
  }

  const userId = license.user_id;
  const profile = license.profiles as { id: string; full_name: string; email: string } | null;

  if (action === "verify") {
    const { error: updateError } = await supabaseAdmin
      .from("licenses")
      .update({ verified: true })
      .eq("id", licenseId);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    // Insert notification
    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title: "Votre licence a été validée ✔",
      type: "license_verified",
      link: "/dashboard/profile",
    });

    // Send email via the send-email API
    if (profile?.email) {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://trackmarshal.app"}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Use service role to get a token — we call directly since we're server-side
          },
          body: JSON.stringify({
            to: profile.email,
            type: "license_validated",
            data: { licenseType: license.type },
          }),
        });
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({ ok: true, action: "verified" });
  }

  if (action === "reject") {
    // Delete the storage file if there is a url
    if (license.url) {
      try {
        // Extract the path from the URL: the path is everything after /object/public/licenses/
        const urlObj = new URL(license.url);
        const pathParts = urlObj.pathname.split("/object/public/licenses/");
        if (pathParts.length === 2) {
          const storagePath = decodeURIComponent(pathParts[1]);
          await supabaseAdmin.storage.from("licenses").remove([storagePath]);
        }
      } catch {
        // Non-blocking storage error
      }
    }

    // Delete the license row
    const { error: deleteError } = await supabaseAdmin
      .from("licenses")
      .delete()
      .eq("id", licenseId);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

    // Insert notification
    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title: "Votre licence n'a pas pu être validée",
      type: "license_rejected",
      link: "/dashboard/profile",
    });

    // Send email
    if (profile?.email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://trackmarshal.app"}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: profile.email,
            type: "license_rejected",
            data: { licenseType: license.type },
          }),
        });
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({ ok: true, action: "rejected" });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
