import { ImageResponse } from "next/og";
import { contentPaths, resolvePageMeta } from "@/lib/seo";
import { reviewedOnLabel, siteName } from "@/lib/site";

/** Social preview image for every content page, served at /og/<content path>. */
export const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return contentPaths.map((path) => ({ slug: path.slice(1).split("/") }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const meta = resolvePageMeta("/" + slug.join("/"));
  if (!meta || meta.kind === "utility")
    return new Response("Not found", { status: 404 });
  const title = meta.title.replace(/ \| .*$/, "");
  const fontSize = title.length > 58 ? 52 : title.length > 42 ? 60 : 70;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f5ef",
        color: "#17324d",
        display: "flex",
        flexDirection: "column",
        padding: "64px 84px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 3,
          fontWeight: 600,
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
          <div style={{ width: 12, height: 30, background: "#789198" }} />
          <div style={{ width: 12, height: 45, background: "#17324d" }} />
          <div style={{ width: 12, height: 36, background: "#176b79" }} />
        </div>
        {siteName.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 21,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#176b79",
          }}
        >
          {meta.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#65717a",
        }}
      >
        <span>Updated {reviewedOnLabel}</span>
        <span>topproviderpicks.com</span>
      </div>
    </div>,
    {
      ...size,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
