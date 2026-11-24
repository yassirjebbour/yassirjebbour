import { route, readJson, json, apiUser } from "@/server/http/api";
import { ExperienceBody } from "@/server/http/experience-schema";
import { createExperience, listExperiences } from "@/server/repo/experiences";
import { rateLimit } from "@/server/ratelimit";
import { track } from "@/server/events";

export const GET = route(async () => {
  const user = await apiUser();
  return json(await listExperiences(user.id));
});

export const POST = route(async (req) => {
  const user = await apiUser();
  await rateLimit(`exp:${user.id}`, 60, 3600);
  const body = await readJson(req, ExperienceBody);
  const exp = await createExperience(user.id, { ...body, organization: body.organization ?? null, started_on: body.started_on ?? null, ended_on: body.ended_on ?? null });
  track(user.id, "experience.added", { kind: body.kind, chars: body.description.length });
  return json(exp, { status: 201 });
});
