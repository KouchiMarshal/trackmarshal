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
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Orange accent bar top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: "#FF5A1F",
            display: "flex",
          }}
        />

        {/* Orange rectangle decoration */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,90,31,0.12)",
            display: "flex",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#FF5A1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, display: "flex" }}>TM</div>
          </div>
          <div style={{ color: "#FF5A1F", fontSize: 16, fontWeight: 700, letterSpacing: "0.3em", display: "flex" }}>
            TRACKMARSHAL
          </div>
        </div>

        {/* Main text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "auto" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            Commissaires
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FF5A1F",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            Motorsport
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#a1a1aa",
              marginTop: "12px",
              display: "flex",
            }}
          >
            Connecter organisateurs et commissaires FFSA · FFM
          </div>
        </div>

        {/* Bottom right URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            fontSize: 18,
            color: "#52525b",
            fontWeight: 600,
            display: "flex",
          }}
        >
          trackmarshal.app
        </div>
      </div>
    ),
    { ...size }
  );
}
