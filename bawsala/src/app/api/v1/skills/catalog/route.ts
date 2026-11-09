import { route, json } from "@/server/http/api";
import { skillCatalog } from "@/server/repo/skills";

export const GET = route(async () => json(await skillCatalog(), { headers: { "Cache-Control": "public, max-age=300" } }));
