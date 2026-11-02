import { z } from "zod";
import { route, readJson, json, clientIp } from "@/server/http/api";
import { rateLimit } from "@/server/ratelimit";
import { detectSkills } from "@/server/domain/skills-engine";
import { track } from "@/server/events";

/** Public "try it" box: deterministic engine only (no AI cost, nothing stored). */
export const POST = route(async (req) => {
  await rateLimit(`try:ip:${clientIp(req)}`, 30, 600);
  const { text } = await readJson(req, z.object({ text: z.string().trim().min(3).max(1500) }));
  const found = detectSkills(text);
  track(null, "try.used", { found: found.length });
  return json({ found: found.map((f) => ({ skillId: f.skillId, quote: f.quote })) });
});
