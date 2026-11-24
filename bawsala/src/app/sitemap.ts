import type { MetadataRoute } from "next";

/** Only public pages. Private dashboards are never listed (and are noindex + robots-disallowed). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return ["", "/signup", "/signin", "/help", "/privacy", "/terms"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.5 }));
}
