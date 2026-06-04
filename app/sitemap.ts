import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { landings } from "@/data/landings";

// Стабильная дата последнего значимого изменения контента.
// Обновляйте вручную при существенной правке текстов — иначе при каждом
// ребилде Яндекс/Google видели бы ложную «активность» обновления.
const CONTENT_UPDATED = new Date("2026-06-05");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.domain}/`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...landings.map((l) => ({
      url: `${site.domain}/${l.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.domain}/privacy`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
