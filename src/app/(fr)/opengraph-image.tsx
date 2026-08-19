/**
 * Generated Open Graph / Twitter share image — replaces the previously broken
 * /og-image.jpg reference. Served statically at build time as a 1200x630 PNG.
 */
import { ImageResponse } from "next/og";

export const alt = "Wenaya — Plateforme de Santé Intégrée au Maroc";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1220",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#B88A5A",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 96, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.02em" }}>
            Wenaya
          </div>
          <div style={{ width: 96, height: 3, marginTop: 20, backgroundColor: "#B88A5A" }} />
          <div style={{ fontSize: 34, color: "#F2EFE9", marginTop: 24, textAlign: "center" }}>
            Plateforme de Santé Intégrée — Casablanca, Maroc
          </div>
          <div style={{ fontSize: 22, color: "#B88A5A", marginTop: 40, textAlign: "center" }}>
            Kinésithérapie · Psychologie · Nutrition · Bien-être
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
