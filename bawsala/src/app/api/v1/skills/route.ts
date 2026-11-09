import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { declareSkill } from "@/server/repo/skills";
import { track } from "@/server/events";

export const POST = route(async (req) => {
  const user = await apiUser();
  const { skillId } = await readJson(req, z.object({ skillId: z.string().regex(/^[a-z0-9_]{2,40}$/) }));
  await declareSkill(user.id, skillId);
  track(user.id, "skill.declared", { skill: skillId });
  return json({ ok: true }, { status: 201 });
});
