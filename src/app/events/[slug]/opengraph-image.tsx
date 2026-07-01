import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const alt = "Événement TrackMarshal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#FF5A1F";

function fmtDate(d?: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("title, image_url, event_date, event_end_date, location, country, discipline")
    .eq("slug", slug)
    .single();

  const title = event?.title || "Événement motorsport";
  const dateStr = fmtDate(event?.event_date);
  const endStr = event?.event_end_date && event.event_end_date !== event.event_date ? fmtDate(event.event_end_date) : null;
  const dateLabel = dateStr ? (endStr ? `${dateStr} → ${endStr}` : dateStr) : null;
  const place = [event?.location, event?.country].filter(Boolean).join(", ");
  const hasImage = !!event?.image_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#0B0B0C",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Image de l'événement en fond (si disponible) */}
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event!.image_url}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* Voile dégradé pour la lisibilité du texte */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: hasImage
              ? "linear-gradient(180deg, rgba(11,11,12,0.35) 0%, rgba(11,11,12,0.55) 55%, rgba(11,11,12,0.92) 100%)"
              : "linear-gradient(135deg, #131315 0%, #0B0B0C 100%)",
          }}
        />

        {/* Halo de marque quand il n'y a pas d'image */}
        {!hasImage && (
          <div
            style={{
              position: "absolute",
              top: -140,
              right: -140,
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "rgba(255,90,31,0.16)",
              display: "flex",
            }}
          />
        )}

        {/* Bandeau marque en haut */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "44px 56px" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
            Track<span style={{ color: ORANGE, display: "flex" }}>Marshal</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: ORANGE,
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Recrutement commissaires
          </div>
        </div>

        {/* Contenu bas : discipline, titre, date, lieu */}
        <div style={{ position: "relative", marginTop: "auto", display: "flex", flexDirection: "column", padding: "0 56px 56px" }}>
          {event?.discipline && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(255,90,31,0.2)",
                border: `2px solid ${ORANGE}`,
                color: "#fff",
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              {event.discipline}
            </div>
          )}

          <div
            style={{
              display: "flex",
              color: "#fff",
              fontSize: title.length > 42 ? 60 : 76,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 1080,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 26, color: "#E4E4E7", fontSize: 30, fontWeight: 600 }}>
            {dateLabel && <div style={{ display: "flex" }}>📅 {dateLabel}</div>}
            {place && <div style={{ display: "flex" }}>📍 {place}</div>}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
