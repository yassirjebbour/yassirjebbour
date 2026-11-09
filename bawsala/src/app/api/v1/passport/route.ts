import { route, json, apiUser } from "@/server/http/api";
import { getPassport, pendingSuggestions } from "@/server/repo/skills";

export const GET = route(async () => {
  const user = await apiUser();
  const [skills, suggestions] = await Promise.all([getPassport(user.id), pendingSuggestions(user.id)]);
  return json({ skills, suggestions });
});
