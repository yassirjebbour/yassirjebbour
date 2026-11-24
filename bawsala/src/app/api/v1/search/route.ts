import { route, json, clientIp, ApiError } from "@/server/http/api";
import { retrieve } from "@/server/rag/retrieve";
import { rateLimit } from "@/server/ratelimit";
import { isEnabled } from "@/server/flags";
import { track } from "@/server/events";

const KINDS = new Set(["skill", "occupation", "pathway", "resource", "labor_market", "institution", "program", "guide", "policy"]);

/** Public knowledge search (hybrid retrieval). Returns passages with source attribution. */
export const GET = route(async (req) => {
  await rateLimit(`search:ip:${clientIp(req)}`, 60, 600);
  if (!(await isEnabled("rag.search"))) throw new ApiError("ai_unavailable", "search_disabled");
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  if (q.length < 2 || q.length > 300) throw new ApiError("validation", "query_length");
  const kinds = (url.searchParams.get("kinds") ?? "").split(",").filter((k) => KINDS.has(k));
  const r = await retrieve(q, { k: 8, kinds });
  track(null, "search.used", { mode: r.mode, results: r.results.length });
  return json({ mode: r.mode, latencyMs: r.latencyMs, results: r.results.map((x) => ({ text: x.content, heading: x.heading, score: x.score, doc: x.doc })) });
});
