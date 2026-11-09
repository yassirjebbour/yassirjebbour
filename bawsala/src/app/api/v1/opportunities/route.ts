import { route, json, apiUser } from "@/server/http/api";
import { rankedForUser, savedOpportunities } from "@/server/repo/opportunities";

export const GET = route(async (req) => {
  const user = await apiUser();
  const url = new URL(req.url);
  const city = url.searchParams.get("city")?.slice(0, 80) || undefined;
  const kind = url.searchParams.get("kind")?.slice(0, 20) || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const size = 20;
  const [ranked, saved] = await Promise.all([rankedForUser(user.id, { city, kind }), savedOpportunities(user.id)]);
  const savedIds = new Set(saved.map((s) => s.opportunity_id));
  return json({
    total: ranked.length, page, pageSize: size,
    items: ranked.slice((page - 1) * size, page * size).map(({ item, fit }) => ({ ...item, fit, saved: savedIds.has(item.id) })),
  });
});
