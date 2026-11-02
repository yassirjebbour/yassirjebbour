import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { acceptSuggestion } from "@/server/repo/skills";
import { track } from "@/server/events";

export const POST = route<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  const skillId = await acceptSuggestion(user.id, zUuid.parse((await params).id));
  track(user.id, "suggestion.accepted", { skill: skillId });
  return json({ ok: true, skillId });
});
