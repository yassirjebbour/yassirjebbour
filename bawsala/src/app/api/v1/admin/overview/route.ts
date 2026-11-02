import { route, json, apiUser } from "@/server/http/api";
import { adminOverview } from "@/server/repo/admin";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await adminOverview());
});
