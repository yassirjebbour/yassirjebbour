import { z } from "zod";
import { route, json, apiUser } from "@/server/http/api";
import { removeSkill } from "@/server/repo/skills";

export const DELETE = route<{ params: Promise<{ skillId: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  await removeSkill(user.id, z.string().regex(/^[a-z0-9_]{2,40}$/).parse((await params).skillId));
  return json({ ok: true });
});
