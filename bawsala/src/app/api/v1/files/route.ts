import { route, json, apiUser, ApiError } from "@/server/http/api";
import { listFiles, saveUpload, MAX_FILE_BYTES } from "@/server/repo/files";
import { rateLimit } from "@/server/ratelimit";
import { isEnabled } from "@/server/flags";
import { track } from "@/server/events";

export const GET = route(async () => {
  const user = await apiUser();
  return json(await listFiles(user.id));
});

export const POST = route(async (req) => {
  const user = await apiUser();
  if (!(await isEnabled("uploads.cv", user))) throw new ApiError("forbidden", "uploads_disabled");
  await rateLimit(`upload:${user.id}`, 20, 3600);
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new ApiError("validation", "file_size");
  const form = await req.formData();
  const file = form.get("file");
  const purpose = form.get("purpose") === "evidence" ? "evidence" : "cv";
  if (!(file instanceof File)) throw new ApiError("validation", "file_missing");
  const buf = Buffer.from(await file.arrayBuffer());
  const saved = await saveUpload(user.id, purpose, file.name, buf);
  track(user.id, "cv.uploaded", { mime: saved.mime, ok: !saved.extract_error });
  return json(saved, { status: 201 });
});
