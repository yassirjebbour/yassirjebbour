import { z } from "zod";
import { route, readJson, json, apiUser, ApiError } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { reviewVerification } from "@/server/repo/institution";
import { notify } from "@/server/notify";

export const POST = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await apiUser(["institution_admin"]);
  if (!user.institutionId) throw new ApiError("forbidden", "no_institution");
  const { decision, note } = await readJson(req, z.object({ decision: z.enum(["approved", "rejected"]), note: z.string().trim().max(1000).optional() }));
  const vr = await reviewVerification({ id: user.id, institutionId: user.institutionId }, zUuid.parse((await params).id), decision, note ?? null);
  await notify(vr.user_id, "announcement", { text: decision === "approved" ? "verification_approved" : "verification_declined" });
  return json({ ok: true });
});
