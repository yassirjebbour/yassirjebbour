import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { saveOpportunity, unsaveOpportunity } from "@/server/repo/opportunities";
import { track } from "@/server/events";

type Ctx = { params: Promise<{ id: string }> };
export const POST = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await saveOpportunity(user.id, zUuid.parse((await params).id));
  track(user.id, "opportunity.saved");
  return json({ ok: true });
});
export const DELETE = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await unsaveOpportunity(user.id, zUuid.parse((await params).id));
  return json({ ok: true });
});
