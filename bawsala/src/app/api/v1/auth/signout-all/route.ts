import { cookies } from "next/headers";
import { route, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";
import { SESSION_COOKIE } from "@/server/auth/session";
import { hashToken } from "@/server/auth/tokens";

/** Signs out every other device; keeps the current session. */
export const POST = route(async () => {
  const user = await apiUser();
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  await asSystem((tx) => tx.query(`DELETE FROM sessions WHERE user_id = $1 AND id <> $2`, [user.id, hashToken(token)]));
  return json({ ok: true });
});
