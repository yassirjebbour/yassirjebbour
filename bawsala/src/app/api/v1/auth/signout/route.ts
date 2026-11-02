import { cookies } from "next/headers";
import { route, json } from "@/server/http/api";
import { deleteSession, SESSION_COOKIE } from "@/server/auth/session";

export const POST = route(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  store.delete(SESSION_COOKIE);
  return json({ ok: true, redirect: "/" });
});
