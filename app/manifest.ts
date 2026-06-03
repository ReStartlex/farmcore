import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand} — ${site.tagline}`,
    short_name: site.brand,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F6F7FB",
    theme_color: "#5B5BD6",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
