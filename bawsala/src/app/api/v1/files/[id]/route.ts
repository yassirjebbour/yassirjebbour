import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { deleteFile, getFileContent } from "@/server/repo/files";

type Ctx = { params: Promise<{ id: string }> };
export const GET = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  const f = await getFileContent(user.id, zUuid.parse((await params).id));
  return new Response(new Uint8Array(f.content), {
    headers: {
      "content-type": f.mime,
      "content-disposition": `attachment; filename="${encodeURIComponent(f.filename)}"`,
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox",
      "cache-control": "private, no-store",
    },
  });
});
export const DELETE = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await deleteFile(user.id, zUuid.parse((await params).id));
  return json({ ok: true });
});
