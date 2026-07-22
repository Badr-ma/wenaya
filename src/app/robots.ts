import type { MetadataRoute } from "next";

const BASE = "https://www.wenaya.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
