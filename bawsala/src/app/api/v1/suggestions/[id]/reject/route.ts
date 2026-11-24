import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { rejectSuggestion } from "@/server/repo/skills";
import { track } from "@/server/events";

export const POST = route<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  await rejectSuggestion(user.id, zUuid.parse((await params).id));
  track(user.id, "suggestion.rejected");
  return json({ ok: true });
});
