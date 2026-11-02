import { route, readJson, json, apiUser } from "@/server/http/api";
import { listOpportunities, upsertOpportunity } from "@/server/repo/opportunities";
import { OpportunityBody } from "@/server/http/opportunity-schema";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await listOpportunities({ includeUnpublished: true }));
});
export const POST = route(async (req) => {
  const admin = await apiUser(["platform_admin"]);
  const body = await readJson(req, OpportunityBody);
  const id = await upsertOpportunity(admin.id, body);
  return json({ id }, { status: 201 });
});
