import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zUrl } from "@/server/http/schemas";
import { addEvidence } from "@/server/repo/skills";
import { track } from "@/server/events";

const Body = z.object({ url: zUrl.optional().nullable(), text: z.string().trim().max(2000).optional().nullable(), kind: z.enum(["project", "link", "certificate"]).default("project") })
  .refine((b) => b.url || (b.text && b.text.length >= 5), "url or text required");

export const POST = route<{ params: Promise<{ skillId: string }> }>(async (req, { params }) => {
  const user = await apiUser();
  const skillId = z.string().regex(/^[a-z0-9_]{2,40}$/).parse((await params).skillId);
  const b = await readJson(req, Body);
  await addEvidence(user.id, skillId, { kind: b.kind, url: b.url ?? null, text: b.text ?? null });
  track(user.id, "evidence.added", { skill: skillId, kind: b.kind });
  return json({ ok: true }, { status: 201 });
});
