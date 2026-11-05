import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zUrl, zUuid } from "@/server/http/schemas";
import { completeTask } from "@/server/repo/plans";
import { track } from "@/server/events";

export const POST = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await apiUser();
  const body = await readJson(req, z.object({ url: zUrl.optional().nullable(), note: z.string().trim().max(2000).optional().nullable() }));
  const r = await completeTask(user.id, zUuid.parse((await params).id), { url: body.url ?? null, note: body.note || null });
  track(user.id, "task.completed", { evidenced: r.evidenced });
  return json({ ok: true, ...r });
});
