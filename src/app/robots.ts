import type { MetadataRoute } from "next";
import { SITE_URL, INDEXING_ENABLED } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/en/login", "/signup", "/en/signup", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
