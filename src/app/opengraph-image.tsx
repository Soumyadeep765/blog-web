import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(145deg, #eef1f5 0%, #dfe5ee 45%, #cdd8e8 100%)",
          color: "#14171c",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              background: "#3d5a80",
              transform: "rotate(12deg)",
            }}
          />
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Clear writing on lots of topics
          </div>
          <div style={{ fontSize: 30, color: "#3d4754", maxWidth: 820 }}>
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
