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
          background: "#fafafa",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Orange glow top-right — simulé sans blur */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(255,90,31,0.07)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,90,31,0.09)",
            display: "flex",
          }}
        />

        {/* Navbar mockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 60px",
            height: "72px",
            borderBottom: "1px solid #e4e4e7",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.trackmarshal.app/logo.png"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              alt=""
            />
            <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#18181b" }}>
              Track<span style={{ color: "#FF5A1F", display: "flex" }}>Marshal</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Accueil", "Événements", "Espace pédagogique", "À propos"].map((label) => (
              <div key={label} style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#52525b", letterSpacing: "0.08em" }}>
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", padding: "8px 20px", borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: 13, fontWeight: 700, color: "#18181b" }}>
              Se connecter
            </div>
            <div style={{ display: "flex", padding: "8px 20px", borderRadius: "12px", background: "#FF5A1F", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              S'inscrire
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "52px 60px 0",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 12, fontWeight: 700, letterSpacing: "0.35em", color: "#FF5A1F", marginBottom: "20px" }}>
            PLATEFORME MOTORSPORT PREMIUM
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0px", lineHeight: 0.88, letterSpacing: "-0.05em" }}>
            <div style={{ display: "flex", fontSize: 118, fontWeight: 900, color: "#18181b" }}>Connecter.</div>
            <div style={{ display: "flex", fontSize: 118, fontWeight: 900, color: "#18181b" }}>Recruter.</div>
            <div style={{ display: "flex", fontSize: 118, fontWeight: 900, color: "#FF5A1F" }}>Sécuriser.</div>
          </div>

          <div style={{ display: "flex", marginTop: "24px", fontSize: 20, color: "#52525b", maxWidth: 640, lineHeight: 1.5 }}>
            La plateforme moderne qui connecte organisateurs et commissaires motorsport partout en France.
          </div>

          <div style={{ display: "flex", gap: "14px", marginTop: "28px" }}>
            <div style={{ display: "flex", padding: "14px 28px", borderRadius: "16px", background: "#FF5A1F", fontSize: 15, fontWeight: 900, color: "#fff" }}>
              Voir les événements
            </div>
            <div style={{ display: "flex", padding: "14px 28px", borderRadius: "16px", border: "1px solid #d4d4d8", background: "#fff", fontSize: 15, fontWeight: 900, color: "#18181b" }}>
              Créer un compte
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
