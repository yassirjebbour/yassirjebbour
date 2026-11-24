import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { listFlags, setFlag } from "@/server/flags";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await listFlags());
});
const Body = z.object({ key: z.string().regex(/^[a-z0-9_.]{2,60}$/), enabled: z.boolean().optional(), rollout: z.number().int().min(0).max(100).optional(), roles: z.array(z.enum(["student", "institution_admin", "platform_admin"])).optional() });
export const PATCH = route(async (req) => {
  const admin = await apiUser(["platform_admin"]);
  const { key, ...patch } = await readJson(req, Body);
  await setFlag(admin.id, key, patch);
  return json({ ok: true });
});
