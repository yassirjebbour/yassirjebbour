import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: ["/", "/help", "/privacy", "/terms", "/signup"], disallow: ["/app", "/institution", "/admin", "/api", "/reset", "/forgot"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
