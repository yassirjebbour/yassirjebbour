import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { createConversation, listConversations } from "@/server/repo/conversations";

export const GET = route(async (req) => {
  const user = await apiUser();
  const q = new URL(req.url).searchParams.get("q")?.slice(0, 100) ?? undefined;
  return json(await listConversations(user.id, q));
});
export const POST = route(async (req) => {
  const user = await apiUser();
  const { title } = await readJson(req, z.object({ title: z.string().trim().max(160).default("") }));
  return json(await createConversation(user.id, title), { status: 201 });
});
