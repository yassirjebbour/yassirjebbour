import { z } from "zod";
import { cookies } from "next/headers";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { SESSION_COOKIE } from "@/server/auth/session";
import { hashToken } from "@/server/auth/tokens";
import { zPassword } from "@/server/http/schemas";
import { changePassword } from "@/server/repo/account";
import { rateLimit } from "@/server/ratelimit";
import { notify, sendSecurityEmail } from "@/server/notify";
import { env } from "@/server/env";

const Body = z.object({ current: z.string().min(1).max(200), next: zPassword });
export const POST = route(async (req) => {
  const user = await apiUser();
  await rateLimit(`pwchange:${user.id}`, 5, 3600);
  const body = await readJson(req, Body);
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  await changePassword(user.id, body.current, body.next, token ? hashToken(token) : undefined);
  await notify(user.id, "security", { what: "password" });
  await sendSecurityEmail(user, `${env().APP_URL}/forgot`);
  return json({ ok: true });
});
