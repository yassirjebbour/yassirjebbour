import { route, readJson, json, apiUser } from "@/server/http/api";
import { ExperienceBody } from "@/server/http/experience-schema";
import { deleteExperience, updateExperience } from "@/server/repo/experiences";
import { zUuid } from "@/server/http/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = route<Ctx>(async (req, { params }) => {
  const user = await apiUser();
  const id = zUuid.parse((await params).id);
  const body = await readJson(req, ExperienceBody);
  return json(await updateExperience(user.id, id, { ...body, organization: body.organization ?? null, started_on: body.started_on ?? null, ended_on: body.ended_on ?? null }));
});

export const DELETE = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await deleteExperience(user.id, zUuid.parse((await params).id));
  return json({ ok: true });
});
