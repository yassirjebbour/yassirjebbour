/** Liveness: the process is up. */
export function GET() {
  return Response.json({ status: "ok", time: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
