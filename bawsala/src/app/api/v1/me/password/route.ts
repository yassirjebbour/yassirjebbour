import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zPassword } from "@/server/http/schemas";
import { changePassword } from "@/server/repo/account";
import { rateLimit } from "@/server/ratelimit";
import { notify, enqueueEmail } from "@/server/notify";
import { env } from "@/server/env";

const Body = z.object({ current: z.string().min(1).max(200), next: zPassword });
export const POST = route(async (req) => {
  const user = await apiUser();
  await rateLimit(`pwchange:${user.id}`, 5, 3600);
  const body = await readJson(req, Body);
  await changePassword(user.id, body.current, body.next);
  await notify(user.id, "security", { what: "password" });
  await enqueueEmail({ userId: user.id, to: user.email, template: "password_changed", locale: user.locale, data: { name: user.name, link: `${env().APP_URL}/forgot` } });
  return json({ ok: true });
});
