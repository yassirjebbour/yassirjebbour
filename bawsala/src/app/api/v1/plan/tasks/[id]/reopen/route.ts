import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { reopenTask } from "@/server/repo/plans";

export const POST = route<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await apiUser();
  await reopenTask(user.id, zUuid.parse((await params).id));
  return json({ ok: true });
});
