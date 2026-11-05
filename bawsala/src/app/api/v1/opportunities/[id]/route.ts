import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { getOpportunity, fitFor } from "@/server/repo/opportunities";
import { track } from "@/server/events";

export const GET = route<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  const opp = await getOpportunity(zUuid.parse((await params).id));
  track(user.id, "opportunity.viewed", { demo: opp.is_sample });
  return json({ ...opp, fit: await fitFor(user.id, opp) });
});
