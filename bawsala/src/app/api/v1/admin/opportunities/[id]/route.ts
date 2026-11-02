import { route, readJson, json, apiUser } from "@/server/http/api";
import { upsertOpportunity } from "@/server/repo/opportunities";
import { OpportunityBody } from "@/server/http/opportunity-schema";
import { zUuid } from "@/server/http/schemas";

export const PATCH = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const admin = await apiUser(["platform_admin"]);
  const body = await readJson(req, OpportunityBody);
  await upsertOpportunity(admin.id, body, zUuid.parse((await params).id));
  return json({ ok: true });
});
