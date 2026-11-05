import { z } from "zod";
import { route, readJson, json, clientIp } from "@/server/http/api";
import { rateLimit } from "@/server/ratelimit";
import { analyzeTry } from "@/server/domain/try";
import { track } from "@/server/events";

/** Public "try it" box: deterministic engine only (no AI cost, nothing stored). Roles are labelled examples. */
export const POST = route(async (req) => {
  await rateLimit(`try:ip:${clientIp(req)}`, 30, 600);
  const { text } = await readJson(req, z.object({ text: z.string().trim().min(3).max(1500) }));
  const result = analyzeTry(text);
  track(null, "try.used", { found: result.found.length });
  return json(result);
});
