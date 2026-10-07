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
  try {
    const a = await getAdmin(request, env);
    return Response.json(
      { ok: true, admin: a ? { email: a.email, role: a.role } : null },
      { headers: { "cache-control": "private, no-store" } },
    );
  } catch (e) {
    if (e?.code === "d1_quota_exceeded" || /d1_quota_exceeded/i.test(String(e?.message || ""))) {
      return Response.json(
        { ok: false, error: "d1_quota_exceeded", detail: "D1 free-tier daily row read limit exceeded. Wait until midnight UTC or upgrade Cloudflare." },
        { status: 503, headers: { "cache-control": "no-store" } },
      );
    }
    return Response.json({ ok: false, error: "server_error" }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
