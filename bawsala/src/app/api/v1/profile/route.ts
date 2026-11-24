import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { getProfile, updateProfile } from "@/server/repo/profile";
import { track } from "@/server/events";

export const GET = route(async () => {
  const user = await apiUser();
  return json(await getProfile(user.id));
});

const Body = z.object({
  situation: z.enum(["student", "graduate", "job_seeker", "employed", "other"]).nullable().optional(),
  field_of_study: z.string().trim().max(160).nullable().optional(),
  education_level: z.enum(["bac", "bac2", "licence", "master", "doctorate", "vocational", "other"]).nullable().optional(),
  school: z.string().trim().max(200).nullable().optional(),
  graduation_year: z.number().int().min(1970).max(2100).nullable().optional(),
  city: z.string().trim().max(120).nullable().optional(),
  languages: z.array(z.string().trim().min(2).max(10)).max(8).optional(),
  goal: z.string().trim().max(600).nullable().optional(),
  share_with_institution: z.boolean().optional(),
  onboarded: z.boolean().optional(),
});

export const PATCH = route(async (req) => {
  const user = await apiUser();
  const body = await readJson(req, Body);
  const before = body.onboarded ? await getProfile(user.id) : null;
  await updateProfile(user.id, body);
  if (body.onboarded && !before?.onboarded_at) track(user.id, "onboarding.completed");
  return json({ ok: true });
});
