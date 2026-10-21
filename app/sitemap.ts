import type { MetadataRoute } from "next";
import { siteUrl, reviewedOn } from "@/lib/site";
import { contentPaths, resolvePageMeta } from "@/lib/seo";
const priority: Record<string, number> = {
  home: 1,
  category: 0.9,
  review: 0.7,
  guide: 0.7,
  directory: 0.6,
  methodology: 0.4,
  policy: 0.3,
};
const changeFrequency: Record<
  string,
  MetadataRoute.Sitemap[number]["changeFrequency"]
> = {
  home: "weekly",
  category: "weekly",
  review: "monthly",
  guide: "monthly",
  directory: "weekly",
  methodology: "yearly",
  policy: "yearly",
};
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...contentPaths].flatMap((path) => {
    const meta = resolvePageMeta(path);
    if (!meta || meta.kind === "utility") return [];
    return [
      {
        url: siteUrl(path),
        lastModified: reviewedOn,
        changeFrequency: changeFrequency[meta.kind],
        priority: priority[meta.kind],
      },
    ];
  });
}
