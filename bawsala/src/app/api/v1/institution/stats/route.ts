import { route, json, apiUser, ApiError } from "@/server/http/api";
import { institutionStats } from "@/server/repo/institution";

export const GET = route(async () => {
  const user = await apiUser(["institution_admin"]);
  if (!user.institutionId) throw new ApiError("forbidden", "no_institution");
  return json(await institutionStats(user.institutionId));
});
