import { z } from "zod";
import { route, readJson, json, apiUser, ApiError } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { takePendingAction } from "@/server/repo/conversations";
import { savePlan } from "@/server/repo/plans";
import { notify } from "@/server/notify";
import { track } from "@/server/events";
import type { DraftTask } from "@/server/domain/roadmap";

/**
 * The only way a "confirm"-class tool takes effect: the student presses Confirm in the UI.
 * The pending action belongs to the signed-in user (RLS); the payload was produced server-side.
 */
export const POST = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await apiUser();
  const { decision } = await readJson(req, z.object({ decision: z.enum(["confirm", "cancel"]) }));
  const action = await takePendingAction(user.id, zUuid.parse((await params).id), decision === "confirm" ? "confirmed" : "cancelled");
  if (decision === "cancel") return json({ ok: true, status: "cancelled" });
  if (action.kind === "create_plan") {
    const p = action.payload as { opportunityId: string; title: string; days: number; tasks: DraftTask[] };
    const id = await savePlan(user.id, { opportunityId: p.opportunityId, title: p.title, days: p.days, tasks: p.tasks });
    await notify(user.id, "plan_ready", { title: p.title }, `plan:${id}`);
    track(user.id, "plan.created", { source: "assistant", tasks: p.tasks.length, days: p.days });
    return json({ ok: true, status: "confirmed", planId: id });
  }
  throw new ApiError("bad_request", "unsupported_action");
});
