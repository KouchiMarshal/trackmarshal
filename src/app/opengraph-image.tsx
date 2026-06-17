import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrackMarshal — La plateforme des commissaires motorsport";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Orange glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,90,31,0.15)",
            filter: "blur(120px)",
          }}
        />
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#FF5A1F",
            }}
          >
            Plateforme Motorsport Premium
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            TRACK<span style={{ color: "#FF5A1F" }}>MARSHAL</span>
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            Connecter organisateurs et commissaires motorsport (FFSA / FFM)
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "12px 32px",
              background: "#FF5A1F",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            trackmarshal.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
