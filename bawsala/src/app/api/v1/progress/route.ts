import { route, json, apiUser } from "@/server/http/api";
import { progressStats } from "@/server/repo/plans";

export const GET = route(async () => {
  const user = await apiUser();
  return json(await progressStats(user.id));
});
