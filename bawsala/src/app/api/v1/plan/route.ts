import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { archivePlan, draftPlanFor, getActivePlan, savePlan } from "@/server/repo/plans";
import { notify } from "@/server/notify";
import { track } from "@/server/events";

export const GET = route(async () => {
  const user = await apiUser();
  return json(await getActivePlan(user.id));
});

/** Explicit user action from the UI ("Create my path"): builds and saves the deterministic plan. */
export const POST = route(async (req) => {
  const user = await apiUser();
  const { opportunityId, days } = await readJson(req, z.object({ opportunityId: zUuid, days: z.number().int().min(7).max(90).default(30) }));
  const draft = await draftPlanFor(user.id, opportunityId, user.locale, days);
  const id = await savePlan(user.id, { opportunityId, title: draft.title, days, tasks: draft.tasks });
  await notify(user.id, "plan_ready", { title: draft.title }, `plan:${id}`);
  track(user.id, "plan.created", { source: "ui", tasks: draft.tasks.length, days });
  return json({ ok: true, id }, { status: 201 });
});

export const DELETE = route(async () => {
  const user = await apiUser();
  await archivePlan(user.id);
  return json({ ok: true });
});
