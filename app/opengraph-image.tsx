import { ImageResponse } from "next/og";
import { siteName, siteTagline } from "@/lib/site";
export const alt = `${siteName}: ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f5ef",
        color: "#17324d",
        display: "flex",
        flexDirection: "column",
        padding: "70px 90px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{ display: "flex", fontSize: 27, alignItems: "center", gap: 18 }}
      >
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
          <div style={{ width: 12, height: 30, background: "#789198" }} />
          <div style={{ width: 12, height: 45, background: "#17324d" }} />
          <div style={{ width: 12, height: 36, background: "#176b79" }} />
        </div>
        {siteName}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          lineHeight: 1.05,
          letterSpacing: -3,
          maxWidth: 960,
        }}
      >
        Find the right company before you sign anything.
      </div>
      <div style={{ display: "flex", fontSize: 23, color: "#176b79" }}>
        Same questions, every company. Costs, fit, and the catch.
      </div>
    </div>,
    size,
  );
}
