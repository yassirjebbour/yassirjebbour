import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { asUser } from "@/server/db";

export const GET = route(async () => {
  const user = await apiUser();
  const row = await asUser(user.id, async (tx) => {
    await tx.query(`INSERT INTO notification_prefs (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [user.id]);
    return tx.one(`SELECT in_app, email_reminders, email_security FROM notification_prefs WHERE user_id = $1`, [user.id]);
  });
  return json(row);
});
const Body = z.object({ in_app: z.boolean().optional(), email_reminders: z.boolean().optional(), email_security: z.boolean().optional() });
export const PATCH = route(async (req) => {
  const user = await apiUser();
  const b = await readJson(req, Body);
  await asUser(user.id, async (tx) => {
    await tx.query(`INSERT INTO notification_prefs (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [user.id]);
    await tx.query(`UPDATE notification_prefs SET in_app = coalesce($2,in_app), email_reminders = coalesce($3,email_reminders), email_security = coalesce($4,email_security), updated_at = now() WHERE user_id = $1`,
      [user.id, b.in_app ?? null, b.email_reminders ?? null, b.email_security ?? null]);
  });
  return json({ ok: true });
});
