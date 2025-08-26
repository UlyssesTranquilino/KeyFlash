// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/admin", "/dashboard"], // adjust if private
    },
    sitemap: "https://keyflash.app/sitemap.xml",
  };
}
