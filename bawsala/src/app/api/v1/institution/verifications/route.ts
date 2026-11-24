import { route, json, apiUser, ApiError } from "@/server/http/api";
import { verificationQueue } from "@/server/repo/institution";

export const GET = route(async () => {
  const user = await apiUser(["institution_admin"]);
  if (!user.institutionId) throw new ApiError("forbidden", "no_institution");
  return json(await verificationQueue(user.institutionId));
});
