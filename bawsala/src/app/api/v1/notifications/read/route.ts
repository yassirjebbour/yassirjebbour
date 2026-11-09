import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { markRead } from "@/server/notify";

export const POST = route(async (req) => {
  const user = await apiUser();
  const { ids } = await readJson(req, z.object({ ids: z.array(z.string().uuid()).max(100).optional() }));
  await markRead(user.id, ids);
  return json({ ok: true });
});
