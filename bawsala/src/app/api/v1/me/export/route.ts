import { route, apiUser } from "@/server/http/api";
import { exportAccount } from "@/server/repo/account";
import { rateLimit } from "@/server/ratelimit";
import { asSystem } from "@/server/db";

export const GET = route(async () => {
  const user = await apiUser();
  await rateLimit(`export:${user.id}`, 10, 3600);
  const data = await exportAccount(user.id);
  await asSystem((tx) => tx.query(`INSERT INTO audit_log (actor_id, action) VALUES ($1,'account.exported')`, [user.id]));
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="bawsala-export-${new Date().toISOString().slice(0, 10)}.json"`,
      "cache-control": "no-store",
    },
  });
});
