import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { landings } from "@/data/landings";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: site.domain,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...landings.map((l) => ({
      url: `${site.domain}/${l.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.domain}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
