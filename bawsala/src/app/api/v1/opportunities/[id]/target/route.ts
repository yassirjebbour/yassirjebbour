import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { getOpportunity } from "@/server/repo/opportunities";
import { setTarget } from "@/server/repo/profile";
import { track } from "@/server/events";

export const POST = route<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  const opp = await getOpportunity(zUuid.parse((await params).id));
  await setTarget(user.id, opp.id);
  track(user.id, "target.set", { demo: opp.is_sample });
  return json({ ok: true });
});
