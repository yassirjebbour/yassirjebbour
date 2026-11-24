import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { setFeedback } from "@/server/repo/conversations";

export const POST = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await apiUser();
  const { value } = await readJson(req, z.object({ value: z.union([z.literal(1), z.literal(-1), z.null()]) }));
  await setFeedback(user.id, zUuid.parse((await params).id), value);
  return json({ ok: true });
});
