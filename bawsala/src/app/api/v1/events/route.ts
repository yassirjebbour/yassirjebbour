import { z } from "zod";
import { cookies } from "next/headers";
import { route, readJson, json, clientIp } from "@/server/http/api";
import { rateLimit } from "@/server/ratelimit";
import { SESSION_COOKIE, validateSession } from "@/server/auth/session";
import { track } from "@/server/events";
import { log } from "@/server/log";

const CLIENT_EVENTS = ["page.viewed", "opportunity.apply_clicked", "client.error"] as const;
const Body = z.object({ name: z.enum(CLIENT_EVENTS), props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional() });

/** Client-side events (allowlisted). Front-end errors are logged here too (no stack traces with user data). */
export const POST = route(async (req) => {
  await rateLimit(`events:ip:${clientIp(req)}`, 120, 60);
  const body = await readJson(req, Body);
  const s = await validateSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (body.name === "client.error") log.warn("client.error", { user: s?.user.id ?? null, ...body.props });
  track(s?.user.id ?? null, body.name, body.props);
  return json({ ok: true }, { status: 202 });
});
