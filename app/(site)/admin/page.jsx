"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { VERTICALS } from "@/lib/seo";
import { TEMPLATES } from "@/lib/templates";

function fmtDate(ms) { if (!ms) return "—"; const d = new Date(Number(ms)); return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }

const ADMIN_OAUTH_ERRORS = {
  not_admin: "This Google account is not authorized for admin access.",
  google_not_configured: "Google sign-in isn’t configured yet. Use email & password or a reset link.",
  oauth: "Google sign-in failed. Please try again.",
  oauth_state: "Google sign-in failed (session mismatch). Please try again.",
  oauth_exchange: "Google sign-in failed. Please try again.",
  oauth_email: "We couldn’t read a verified email from Google.",
  backend: "Admin backend is temporarily unavailable. Please try again shortly.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export default function Admin() {
  const [admin, setAdmin] = useState(undefined); // undefined=checking, null=logged out
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [loginMode, setLoginMode] = useState("login"); // login | forgot
  const [forgotInfo, setForgotInfo] = useState("");
  const [forgotDevLink, setForgotDevLink] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetForm, setResetForm] = useState({ next: "", confirm: "" });
  const [resetErr, setResetErr] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [pane, setPane] = useState("overview");
  const [stats, setStats] = useState(null);
  const [statsErr, setStatsErr] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const [accountResetMsg, setAccountResetMsg] = useState({ type: "", text: "", devLink: "" });
  const [accountResetBusy, setAccountResetBusy] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const e = sp.get("e");
    const tok = sp.get("reset");
    if (e) setErr(ADMIN_OAUTH_ERRORS[e] || "Sign-in failed. Please try again.");
    if (tok) setResetToken(tok);
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
  async function sendResetLink(e) {
    e.preventDefault();
    setErr(""); setForgotInfo(""); setForgotDevLink("");
    const em = email.trim().toLowerCase();
    if (!/.+@.+\..+/.test(em)) { setErr("Please enter a valid admin email."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: em }),
      });
      if (r.status === 503) { setUnavailable(true); setErr("The admin backend runs on the deployed site (D1/KV). It isn't available in this environment."); return; }
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok && d.sent) {
        setForgotInfo(`If ${em} is an admin account, a password reset link has been emailed. Check your inbox.`);
        return;
      }
      if (r.ok && d.ok && d.devLink) {
        setForgotInfo("Email isn’t configured in local dev — use this one-time reset link:");
        setForgotDevLink(d.devLink);
        return;
      }
      setErr("Could not send reset email. Please try again.");
    } catch { setErr("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  async function submitResetPassword(e) {
    e.preventDefault();
    setResetErr("");
    if (resetForm.next.length < 6) { setResetErr("New password must be at least 6 characters."); return; }
    if (resetForm.next !== resetForm.confirm) { setResetErr("New passwords do not match."); return; }
    setResetBusy(true);
    try {
      const r = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword: resetForm.next }),
      });
      if (r.status === 503) { setUnavailable(true); setResetErr("The admin backend isn't available in this environment."); return; }
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        window.history.replaceState({}, "", "/admin");
        setResetToken("");
        setResetForm({ next: "", confirm: "" });
        setAdmin(d.admin);
        setPane("account");
        setPwMsg({ type: "ok", text: "Password updated and signed in." });
        return;
      }
      if (d.error === "invalid_or_expired") setResetErr("This reset link is invalid or has expired. Please request a new one.");
      else setResetErr("Could not reset password. Please try again.");
    } catch { setResetErr("Something went wrong. Please try again."); }
    finally { setResetBusy(false); }
  }

  async function sendAccountResetLink() {
    setAccountResetMsg({ type: "", text: "", devLink: "" });
    setAccountResetBusy(true);
    try {
      const r = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: admin.email }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok && d.sent) {
        setAccountResetMsg({ type: "ok", text: `Reset link sent to ${admin.email}. Check your inbox.`, devLink: "" });
        return;
      }
      if (r.ok && d.ok && d.devLink) {
        setAccountResetMsg({ type: "ok", text: "Email isn’t configured in local dev — use this link:", devLink: d.devLink });
        return;
      }
      setAccountResetMsg({ type: "err", text: "Could not send reset email.", devLink: "" });
    } catch { setAccountResetMsg({ type: "err", text: "Something went wrong. Please try again.", devLink: "" }); }
    finally { setAccountResetBusy(false); }
  }

  async function signOut() { try { await fetch("/api/admin/logout", { method: "POST" }); } catch {} setAdmin(null); setStats(null); }

  const canSetWithoutCurrent = admin?.authMethod === "google" || admin?.authMethod === "reset";

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pwForm.next.length < 6) { setPwMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: "err", text: "New passwords do not match." }); return; }
    setPwBusy(true);
    try {
      const payload = canSetWithoutCurrent
        ? { newPassword: pwForm.next }
        : { currentPassword: pwForm.current, newPassword: pwForm.next };
      const r = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
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

  if (resetToken) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <form onSubmit={submitResetPassword} style={{ width: "min(390px,92vw)", background: "var(--card)", border: "1px solid var(--line-2)", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, fontWeight: 600, fontSize: 17 }}><LogoMark /> BillCrafter <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 13 }}>Admin</span></div>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>Set a new password for your admin account.</p>
          <label style={{ fontSize: 12, color: "var(--muted)" }}>New password</label>
          <input className="sp-input" style={{ margin: "4px 0 12px" }} type="password" autoComplete="new-password" value={resetForm.next} onChange={(e) => setResetForm((f) => ({ ...f, next: e.target.value }))} placeholder="At least 6 characters" required minLength={6} />
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Confirm new password</label>
          <input className="sp-input" style={{ margin: "4px 0 14px" }} type="password" autoComplete="new-password" value={resetForm.confirm} onChange={(e) => setResetForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" required minLength={6} />
          {resetErr && <p style={{ color: "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{resetErr}</p>}
          <button className="btn btn-solid btn-block" type="submit" style={{ padding: 11 }} disabled={resetBusy}>{resetBusy ? "Saving…" : "Set new password"}</button>
          <button
            type="button"
            className="link-text"
            style={{ marginTop: 12, display: "block", width: "100%", textAlign: "center" }}
            onClick={() => {
              window.history.replaceState({}, "", "/admin");
              setResetToken("");
              setResetErr("");
              setLoginMode(resetErr ? "forgot" : "login");
            }}
          >
            {resetErr ? "Request a new reset link" : "← Back to sign in"}
          </button>
        </form>
      </div>
    );
  }

  if (!admin) {
    if (loginMode === "forgot") {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <form onSubmit={sendResetLink} style={{ width: "min(390px,92vw)", background: "var(--card)", border: "1px solid var(--line-2)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, fontWeight: 600, fontSize: 17 }}><LogoMark /> BillCrafter <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 13 }}>Admin</span></div>
            <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>Enter your admin email to receive a one-time password reset link.</p>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Admin email</label>
            <input className="sp-input" style={{ margin: "4px 0 14px" }} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@billcrafter.com" required />
            {err && <p style={{ color: "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{err}</p>}
            {forgotInfo && (
              <p style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 0 }}>
                {forgotInfo}
                {forgotDevLink && <> <a href={forgotDevLink} style={{ color: "var(--ink)", textDecoration: "underline", wordBreak: "break-all" }}>Reset password →</a></>}
              </p>
            )}
            <button className="btn btn-solid btn-block" type="submit" style={{ padding: 11 }} disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
            <button type="button" className="link-text" style={{ marginTop: 12, display: "block", width: "100%", textAlign: "center" }} onClick={() => { setLoginMode("login"); setErr(""); setForgotInfo(""); setForgotDevLink(""); }}>
              ← Back to sign in
            </button>
          </form>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ width: "min(390px,92vw)", background: "var(--card)", border: "1px solid var(--line-2)", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, fontWeight: 600, fontSize: 17 }}><LogoMark /> BillCrafter <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 13 }}>Admin</span></div>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>Sign in to the management console.</p>

          <a href="/api/auth/google?mode=admin" className="btn btn-ghost btn-block" style={{ padding: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <GoogleIcon />
            Continue with Google
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0", fontSize: 12, color: "var(--faint)" }}>
            <span style={{ flex: 1, height: 1, background: "var(--line-2)" }} />or<span style={{ flex: 1, height: 1, background: "var(--line-2)" }} />
          </div>

          <form onSubmit={login}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Email</label>
            <input className="sp-input" style={{ margin: "4px 0 12px" }} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@billcrafter.com" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: 12, color: "var(--muted)" }}>Password</label>
              <button type="button" className="link-text" style={{ fontSize: 12 }} onClick={() => { setLoginMode("forgot"); setErr(""); setForgotInfo(""); setForgotDevLink(""); }}>Forgot password?</button>
            </div>
            <input className="sp-input" style={{ margin: "4px 0 14px" }} type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••" />
            {err && <p style={{ color: "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{err}</p>}
            <button className="btn btn-solid btn-block" type="submit" style={{ padding: 11 }} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="fineprint" style={{ marginTop: 12 }}>Restricted to authorized admin accounts.</p>
        </div>
      </div>
    );
  }

  const NAV = [["overview", "Overview"], ["users", "Users"], ["traffic", "Traffic"], ["emails", "Email log"], ["content", "Content / SEO"], ["audit", "Audit log"], ["account", "Account"]];
  const kpis = stats ? [
    ["Total users", stats.kpis.users, "registered accounts"],
    ["OCR scans today", `${stats.kpis.ocrToday || 0} / 3,000`, `${stats.kpis.ocrScansTotal || 0} total AI extractions`],
    ["Invoices saved", stats.kpis.invoices, "across all users"],
    ["Emails sent", stats.kpis.emailsSent, "invoices emailed to clients"],
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
              <div className="panel-h"><h3>{canSetWithoutCurrent ? "Set / change password" : "Change password"}</h3></div>
              <div style={{ padding: 18 }}>
                <p className="muted" style={{ fontSize: 13, margin: "0 0 16px" }}>
                  Signed in as {admin.email}
                  {admin.authMethod === "google" ? " · via Google" : admin.authMethod === "reset" ? " · via reset link" : ""}
                </p>
                {canSetWithoutCurrent && (
                  <p className="muted" style={{ fontSize: 12.5, margin: "0 0 14px" }}>
                    You signed in {admin.authMethod === "google" ? "with Google" : "via an email reset link"}, so you can set a new password directly without entering your old password.
                  </p>
                )}
                <form onSubmit={changePassword}>
                  {!canSetWithoutCurrent && (
                    <>
                      <label style={{ fontSize: 12, color: "var(--muted)" }}>Current password</label>
                      <input className="sp-input" style={{ margin: "4px 0 12px" }} type="password" autoComplete="current-password" value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} required />
                    </>
                  )}
                  <label style={{ fontSize: 12, color: "var(--muted)" }}>New password</label>
                  <input className="sp-input" style={{ margin: "4px 0 12px" }} type="password" autoComplete="new-password" value={pwForm.next} onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))} placeholder="At least 6 characters" required minLength={6} />
                  <label style={{ fontSize: 12, color: "var(--muted)" }}>Confirm new password</label>
                  <input className="sp-input" style={{ margin: "4px 0 14px" }} type="password" autoComplete="new-password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" required minLength={6} />
                  {pwMsg.text && <p style={{ color: pwMsg.type === "ok" ? "var(--ok-ink, #0a7a3e)" : "var(--err-ink)", fontSize: 12.5, marginTop: 0 }}>{pwMsg.text}</p>}
                  <button className="btn btn-solid" type="submit" disabled={pwBusy}>{pwBusy ? "Saving…" : canSetWithoutCurrent ? "Set password" : "Update password"}</button>
                </form>
                {!canSetWithoutCurrent && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                    <p className="muted" style={{ fontSize: 12.5, margin: "0 0 8px" }}>Forgot your current password?</p>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={sendAccountResetLink} disabled={accountResetBusy}>
                      {accountResetBusy ? "Sending…" : `Email reset link to ${admin.email}`}
                    </button>
                    {accountResetMsg.text && (
                      <p style={{ color: accountResetMsg.type === "ok" ? "var(--ok-ink, #0a7a3e)" : "var(--err-ink)", fontSize: 12.5, margin: "8px 0 0" }}>
                        {accountResetMsg.text}
                        {accountResetMsg.devLink && <> <a href={accountResetMsg.devLink} style={{ color: "var(--ink)", textDecoration: "underline", wordBreak: "break-all" }}>Reset password →</a></>}
                      </p>
                    )}
                  </div>
                )}
              </div>
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
