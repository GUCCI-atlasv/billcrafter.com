import { getEnv } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB) {
    return Response.json({ ok: false, error: "backend_unavailable" }, {
      status: 503,
      headers: { "cache-control": "no-store" },
    });
  }
  const a = await getAdmin(request, env);
  return Response.json(
    { ok: true, admin: a ? { email: a.email, role: a.role } : null },
    { headers: { "cache-control": "private, no-store" } },
  );
}
