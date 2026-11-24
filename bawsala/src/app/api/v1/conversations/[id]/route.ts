import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { deleteConversation, getConversation, renameConversation } from "@/server/repo/conversations";

type Ctx = { params: Promise<{ id: string }> };
export const GET = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  return json(await getConversation(user.id, zUuid.parse((await params).id)));
});
export const PATCH = route<Ctx>(async (req, { params }) => {
  const user = await apiUser();
  const { title } = await readJson(req, z.object({ title: z.string().trim().min(1).max(160) }));
  await renameConversation(user.id, zUuid.parse((await params).id), title);
  return json({ ok: true });
});
export const DELETE = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await deleteConversation(user.id, zUuid.parse((await params).id));
  return json({ ok: true });
});
