import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

  const { data: docs, error } = await supabaseAdmin
    .from("event_documents")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Filter out records whose files no longer exist in storage
  const { data: storageFiles } = await supabaseAdmin.storage.from("event-docs").list(eventId);
  if (storageFiles) {
    const existing = new Set(storageFiles.map((f) => `${eventId}/${f.name}`));
    const validDocs = (docs || []).filter((doc) => {
      const urlPath = new URL(doc.url).pathname;
      const storagePath = urlPath.split("/event-docs/")[1];
      return !storagePath || existing.has(storagePath);
    });
    // Clean up orphaned DB records silently
    const orphans = (docs || []).filter((doc) => {
      const urlPath = new URL(doc.url).pathname;
      const storagePath = urlPath.split("/event-docs/")[1];
      return storagePath && !existing.has(storagePath);
    });
    if (orphans.length > 0) {
      await supabaseAdmin.from("event_documents").delete().in("id", orphans.map((d) => d.id));
    }
    return NextResponse.json({ docs: validDocs });
  }

  return NextResponse.json({ docs: docs || [] });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const eventId = formData.get("eventId") as string | null;

  if (!file || !eventId) return NextResponse.json({ error: "Missing file or eventId" }, { status: 400 });

  // Verify organizer owns this event
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id, title")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .maybeSingle();

  if (!event) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ext = file.name.split(".").pop() || "bin";
  const path = `${eventId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from("event-docs")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("event-docs").getPublicUrl(path);

  const { data: doc, error: dbError } = await supabaseAdmin
    .from("event_documents")
    .insert({ event_id: eventId, name: file.name, url: publicUrl, size_bytes: file.size, uploaded_by: user.id })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ ok: true, doc });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { docId } = await req.json();
  if (!docId) return NextResponse.json({ error: "Missing docId" }, { status: 400 });

  const { data: doc } = await supabaseAdmin
    .from("event_documents")
    .select("id, url, event_id")
    .eq("id", docId)
    .maybeSingle();

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Verify organizer owns this event
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("organizer_id")
    .eq("id", doc.event_id)
    .maybeSingle();

  if (event?.organizer_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Delete from storage
  const urlObj = new URL(doc.url);
  const storagePath = urlObj.pathname.split("/event-docs/")[1];
  if (storagePath) {
    await supabaseAdmin.storage.from("event-docs").remove([storagePath]);
  }

  await supabaseAdmin.from("event_documents").delete().eq("id", docId);
  return NextResponse.json({ ok: true });
}
