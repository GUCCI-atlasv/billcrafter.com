"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { VERTICALS } from "@/lib/seo";
import { TEMPLATES } from "@/lib/templates";

function fmtDate(ms) { if (!ms) return "—"; const d = new Date(Number(ms)); return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }

export default function Admin() {
  const [admin, setAdmin] = useState(undefined); // undefined=checking, null=logged out
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [pane, setPane] = useState("overview");
  const [stats, setStats] = useState(null);
  const [statsErr, setStatsErr] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/me");
        if (r.status === 503) { setUnavailable(true); setAdmin(null); return; }
        const d = await r.json();
        setAdmin(d.admin || null);
      } catch { setAdmin(null); }
    })();
  }, []);

  useEffect(() => { if (admin) loadStats(); }, [admin]);
  async function loadStats() {
    setStatsErr("");
    try {
      const r = await fetch("/api/admin/stats");
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setStats(d); return; }
      if (d.error === "d1_quota_exceeded" || r.status === 503) {
        setStatsErr(d.detail || "Database daily read quota exceeded. Data will be available again after midnight UTC, or upgrade Cloudflare D1.");
        return;
      }
      if (r.status === 401) { setStatsErr("Session expired. Please sign in again."); return; }
      setStatsErr(d.detail || d.error || "Could not load admin data.");
    } catch {
      setStatsErr("Could not load admin data. Please try again.");
    }
  }
  async function deleteUser(email) {
    if (!confirm(`Delete ${email}? This permanently removes the account and ALL of their invoices, clients and data.`)) return;
    if (!confirm(`Really delete ${email}? This cannot be undone.`)) return;
    try { await fetch("/api/admin/delete-user", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
    loadStats();
  }

  async function login(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: pw }) });
      if (r.status === 503) { setUnavailable(true); setErr("The admin backend runs on the deployed site (D1/KV). It isn't available in this environment."); return; }
      const d = await r.json();
      if (r.ok && d.ok) { setAdmin(d.admin); return; }
      setErr("Invalid credentials.");
    } catch { setErr("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }
  async function signOut() { try { await fetch("/api/admin/logout", { method: "POST" }); } catch {} setAdmin(null); setStats(null); }

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pwForm.next.length < 6) { setPwMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: "err", text: "New passwords do not match." }); return; }
    setPwBusy(true);
    try {
      const r = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        setPwForm({ current: "", next: "", confirm: "" });
        setPwMsg({ type: "ok", text: "Password updated." });
        return;
      }
      if (d.error === "invalid_current") setPwMsg({ type: "err", text: "Current password is incorrect." });
      else if (r.status === 503) setPwMsg({ type: "err", text: "Backend unavailable." });
      else setPwMsg({ type: "err", text: "Could not update password." });
    } catch { setPwMsg({ type: "err", text: "Something went wrong. Please try again." }); }
    finally { setPwBusy(false); }
  }

  if (admin === undefined) return null;

  if (!admin) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <form onSubmit={login} style={{ width: "min(380px,92vw)", background: "var(--card)", border: "1px solid var(--line-2)", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, fontWeight: 600, fontSize: 17 }}><LogoMark /> BillCrafter <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 13 }}>Admin</span></div>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>Sign in to the management console.</p>
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Email</label>
          <input className="sp-input" style={{ margin: "4px 0 12px" }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@billcrafter.com" />
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Password</label>
          <input className="sp-input" style={{ margin: "4px 0 14px" }} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••" />
          {err && <p style={{ color: "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{err}</p>}
          <button className="btn btn-solid btn-block" type="submit" style={{ padding: 11 }} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <p className="fineprint" style={{ marginTop: 12 }}>Secured with a hashed password. Change the seed password after first login.</p>
        </form>
      </div>
    );
  }

  const NAV = [["overview", "Overview"], ["users", "Users"], ["traffic", "Traffic"], ["emails", "Email log"], ["content", "Content / SEO"], ["audit", "Audit log"], ["account", "Account"]];
  const kpis = stats ? [
    ["Total users", stats.kpis.users, "registered accounts"],
    ["Emails sent", stats.kpis.emailsSent, "invoices emailed to clients"],
    ["Invoices saved", stats.kpis.invoices, "across all users"],
    ["Clients stored", stats.kpis.clients, "in address books"],
  ] : [];
  const loadingBox = statsErr ? (
    <div className="empty-box">
      <h3>Admin data unavailable</h3>
      <div>{statsErr}</div>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={loadStats}>Retry</button>
    </div>
  ) : <div className="empty-box">Loading live data…</div>;

  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="logo" style={{ padding: "6px 8px 14px" }}><LogoMark /> Admin</Link>
        {NAV.map(([k, label]) => <button key={k} className={"navitem" + (pane === k ? " active" : "")} onClick={() => setPane(k)}>{label}</button>)}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: 12, fontSize: 12, color: "var(--muted)", padding: "12px 8px 0" }}>
          {admin.email} · {admin.role}<br /><button className="link-text" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <main className="main">
        {pane === "overview" && (
          <>
            <h1 style={{ fontSize: 22, marginBottom: 18 }}>Overview</h1>
            {!stats ? loadingBox : (
              <>
                <div className="kpis">{kpis.map(([lb, vl, dl]) => <div className="kpi" key={lb}><div className="lb">{lb}</div><div className="vl">{vl}</div><div className="dl">{dl}</div></div>)}</div>
                <div className="panel">
                  <div className="panel-h"><h3>Recent users</h3><button className="btn btn-ghost btn-sm" onClick={() => setPane("users")}>View all</button></div>
                  <UsersTable rows={(stats.recentUsers || []).slice(0, 8)} onDelete={deleteUser} />
                </div>
              </>
            )}
          </>
        )}

        {pane === "users" && (
          <><h1 style={{ fontSize: 22, marginBottom: 18 }}>Users</h1>
            <div className="panel">{stats ? <UsersTable rows={stats.recentUsers || []} onDelete={deleteUser} /> : loadingBox}</div></>
        )}

        {pane === "traffic" && (
          <><h1 style={{ fontSize: 22, marginBottom: 18 }}>Traffic</h1>
            <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              <div className="kpi"><div className="lb">Unique visitors</div><div className="vl">{stats?.kpis.uniqueVisitors ?? "—"}</div><div className="dl">distinct IPs, recent sample</div></div>
              <div className="kpi"><div className="lb">Exports</div><div className="vl">{stats?.kpis.exportsTotal ?? "—"}</div><div className="dl">all formats</div></div>
              <div className="kpi"><div className="lb">Events shown</div><div className="vl">{stats?.traffic?.length ?? "—"}</div><div className="dl">most recent 100</div></div>
            </div>

            <div className="panel">
              <div className="panel-h"><h3>Top templates</h3><span className="muted" style={{ fontSize: 12 }}>by exports</span></div>
              {stats && stats.topTemplates && stats.topTemplates.length ? (
                <table className="data"><thead><tr><th>Template</th><th style={{ textAlign: "right" }}>Exports</th></tr></thead>
                  <tbody>{stats.topTemplates.map((t, i) => (<tr key={i}><td>{t.template || "—"}</td><td style={{ textAlign: "right", fontWeight: 500 }}>{t.c}</td></tr>))}</tbody>
                </table>
              ) : <div className="empty-box">No template exports recorded yet.</div>}
            </div>

            <div className="panel">
              <div className="panel-h"><h3>Recent activity (with IP)</h3></div>
              {stats && stats.traffic && stats.traffic.length ? (
                <table className="data"><thead><tr><th>When</th><th>Event</th><th>IP</th><th>Country</th><th>Who</th><th>Template</th><th>Format</th></tr></thead>
                  <tbody>{stats.traffic.map((v, i) => (
                    <tr key={i}>
                      <td className="muted">{fmtDate(v.created_at)}</td>
                      <td><span className={"st " + (v.event === "export" ? "st-paid" : "st-draft")}>{v.event}</span></td>
                      <td className="muted">{v.ip || "—"}</td>
                      <td className="muted">{v.country || "—"}</td>
                      <td>{v.user_email || "anonymous"}</td>
                      <td className="muted">{v.template || "—"}{v.doc_type ? ` · ${v.doc_type}` : ""}</td>
                      <td className="muted">{v.format || "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <div className="empty-box"><h3>No traffic recorded yet</h3><div>Visitor IPs and template exports will appear here.</div></div>}
            </div></>
        )}

        {pane === "emails" && (
          <><h1 style={{ fontSize: 22, marginBottom: 18 }}>Email log</h1>
            <div className="kpis" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
              <div className="kpi"><div className="lb">Invoices emailed</div><div className="vl">{stats?.kpis.emailsSent ?? "—"}</div><div className="dl">successful sends</div></div>
              <div className="kpi"><div className="lb">Recent entries</div><div className="vl">{stats?.emails?.length ?? "—"}</div><div className="dl">last 100 shown</div></div>
            </div>
            <div className="panel">
              {stats && stats.emails && stats.emails.length ? (
                <table className="data"><thead><tr><th>When</th><th>From (sender)</th><th>To (client)</th><th>Subject</th><th>Status</th></tr></thead>
                  <tbody>{stats.emails.map((m, i) => (
                    <tr key={i}>
                      <td className="muted">{fmtDate(m.created_at)}</td>
                      <td>{m.user_email || "—"}</td>
                      <td>{m.to_email}</td>
                      <td className="muted" title={m.error || ""}>{m.subject || "—"}</td>
                      <td><span className={"st " + (m.status === "sent" ? "st-paid" : "st-draft")}>{m.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <div className="empty-box"><h3>No emails sent yet</h3><div>Invoices emailed from the editor will appear here.</div></div>}
            </div></>
        )}

        {pane === "content" && (
          <><h1 style={{ fontSize: 22, marginBottom: 18 }}>Content / SEO pages</h1>
            <div className="panel"><table className="data"><thead><tr><th>Path</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {VERTICALS.map((v) => (<tr key={v.slug}><td>/{v.slug}</td><td className="muted">landing</td><td><span className="st st-paid">Live</span></td></tr>))}
                {TEMPLATES.map((t) => (<tr key={t.slug}><td>/templates/{t.slug}</td><td className="muted">template</td><td><span className="st st-paid">Live</span></td></tr>))}
              </tbody>
            </table></div></>
        )}

        {pane === "audit" && (
          <><h1 style={{ fontSize: 22, marginBottom: 18 }}>Audit log</h1>
            <div className="panel">
              {stats && stats.audit && stats.audit.length ? (
                <table className="data"><thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th></tr></thead>
                  <tbody>{stats.audit.map((a, i) => (<tr key={i}><td className="muted">{fmtDate(a.created_at)}</td><td>{a.admin_email}</td><td>{a.action}</td><td className="muted">{a.target || "—"}</td></tr>))}</tbody>
                </table>
              ) : <div className="empty-box">No audit entries yet.</div>}
            </div></>
        )}

        {pane === "account" && (
          <>
            <h1 style={{ fontSize: 22, marginBottom: 18 }}>Account</h1>
            <div className="panel" style={{ maxWidth: 420 }}>
              <div className="panel-h"><h3>Change password</h3></div>
              <p className="muted" style={{ fontSize: 13, margin: "0 0 16px" }}>Signed in as {admin.email}</p>
              <form onSubmit={changePassword}>
                <label style={{ fontSize: 12, color: "var(--muted)" }}>Current password</label>
                <input className="sp-input" style={{ margin: "4px 0 12px" }} type="password" autoComplete="current-password" value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} required />
                <label style={{ fontSize: 12, color: "var(--muted)" }}>New password</label>
                <input className="sp-input" style={{ margin: "4px 0 12px" }} type="password" autoComplete="new-password" value={pwForm.next} onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))} required minLength={6} />
                <label style={{ fontSize: 12, color: "var(--muted)" }}>Confirm new password</label>
                <input className="sp-input" style={{ margin: "4px 0 14px" }} type="password" autoComplete="new-password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} required minLength={6} />
                {pwMsg.text && <p style={{ color: pwMsg.type === "ok" ? "var(--ok-ink, #0a7a3e)" : "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{pwMsg.text}</p>}
                <button className="btn btn-solid" type="submit" disabled={pwBusy}>{pwBusy ? "Saving…" : "Update password"}</button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function UsersTable({ rows, onDelete }) {
  if (!rows || !rows.length) return <div className="empty-box"><h3>No users yet</h3><div>Accounts will appear here as people sign up.</div></div>;
  // No plan tiers any more: every account is free and unlimited.
  return (
    <table className="data">
      <thead><tr><th>Email</th><th>Joined</th>{onDelete ? <th></th> : null}</tr></thead>
      <tbody>{rows.map((u) => (
        <tr key={u.email}>
          <td>{u.email}</td>
          <td className="muted">{fmtDate(u.created_at)}</td>
          {onDelete ? (
            <td>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--brand)" }} onClick={() => onDelete(u.email)}>Delete</button>
              </div>
            </td>
          ) : null}
        </tr>
      ))}</tbody>
    </table>
  );
}
