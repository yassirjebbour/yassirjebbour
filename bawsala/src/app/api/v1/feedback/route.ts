import { z } from "zod";
import { cookies } from "next/headers";
import { route, readJson, json, clientIp } from "@/server/http/api";
import { rateLimit } from "@/server/ratelimit";
import { asSystem } from "@/server/db";
import { SESSION_COOKIE, validateSession } from "@/server/auth/session";
import { track } from "@/server/events";

const Body = z.object({ kind: z.enum(["bug", "idea", "question", "privacy_request", "other"]), message: z.string().trim().min(3).max(4000), page: z.string().max(200).optional() });

export const POST = route(async (req) => {
  await rateLimit(`feedback:ip:${clientIp(req)}`, 10, 3600);
  const body = await readJson(req, Body);
  const s = await validateSession((await cookies()).get(SESSION_COOKIE)?.value);
  await asSystem((tx) => tx.query(`INSERT INTO feedback (user_id, kind, message, page) VALUES ($1,$2,$3,$4)`, [s?.user.id ?? null, body.kind, body.message, body.page ?? null]));
  track(s?.user.id ?? null, "feedback.sent", { kind: body.kind });
  return json({ ok: true }, { status: 201 });
});
