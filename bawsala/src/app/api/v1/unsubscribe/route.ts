import { asSystem } from "@/server/db";

/** One-click unsubscribe from reminder emails (token from the email footer). */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!/^[0-9a-f]{36}$/.test(token)) return new Response("Invalid link", { status: 400 });
  await asSystem((tx) => tx.query(`UPDATE notification_prefs SET email_reminders = false, updated_at = now() WHERE unsubscribe_token = $1`, [token]));
  return new Response("You will no longer receive reminder emails. / Vous ne recevrez plus de rappels. / لن تتوصل بعد الآن برسائل التذكير.", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
export const POST = GET;
