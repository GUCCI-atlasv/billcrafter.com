"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "./Logo";
import { setUser } from "@/lib/auth";

const ERR_MAP = {
  google_not_configured: "Google sign-in isn’t configured yet. Use a magic link or password.",
  oauth: "Google sign-in failed. Please try again.",
  oauth_state: "Google sign-in failed (session mismatch). Please try again.",
  oauth_exchange: "Google sign-in failed. Please try again.",
  oauth_email: "We couldn’t read your Google email. Try a magic link instead.",
  link: "That sign-in link is invalid or has expired. Request a new one.",
  backend: "Sign-in is temporarily unavailable. Please try again shortly.",
};

export default function AuthForm({ mode = "login" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePw, setUsePw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [devLink, setDevLink] = useState("");

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("e");
    if (e) setErr(ERR_MAP[e] || "Sign-in failed. Please try again.");
  }, []);

  async function sendMagic(e) {
    e.preventDefault(); setErr(""); setInfo(""); setDevLink("");
    const em = email.trim().toLowerCase();
    if (!/.+@.+\..+/.test(em)) { setErr("Please enter a valid email."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/auth/magic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: em }) });
      if (r.status === 503) { setErr("Magic links require the deployed backend (D1). Try password below in local dev."); return; }
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok && d.sent) { setInfo(`We emailed a sign-in link to ${em}. Check your inbox.`); return; }
      if (r.ok && d.ok && d.devLink) { setInfo("Email isn’t configured yet — use this one-time link:"); setDevLink(d.devLink); return; }
      setErr("Couldn’t send the link. Please try again.");
    } catch { setErr("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  async function submitPw(e) {
    e.preventDefault(); setErr(""); setInfo("");
    const em = email.trim().toLowerCase();
    if (!/.+@.+\..+/.test(em)) { setErr("Please enter a valid email."); return; }
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${isSignup ? "register" : "login"}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: em, password }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { setUser({ email: em, plan: data.user?.plan || "free" }); router.push("/invoicemanager"); return; }
      if (res.status === 503) { setUser({ email: em, plan: "free" }); router.push("/invoicemanager"); return; }
      const map = { email_taken: "That email is already registered. Log in instead.", invalid_credentials: "Wrong email or password.", weak_password: "Password must be at least 6 characters." };
      setErr(map[data.error] || "Something went wrong. Please try again.");
    } catch { setUser({ email: em, plan: "free" }); router.push("/invoicemanager"); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(400px,92vw)" }}>
        <Link href="/" className="logo" style={{ justifyContent: "center", marginBottom: 18, display: "flex" }}>
          <LogoMark /> BillCrafter
        </Link>
        <div style={{ background: "var(--card)", border: "1px solid var(--line-2)", borderRadius: 16, padding: 28 }}>
          <h1 style={{ fontSize: 21, marginBottom: 4 }}>{isSignup ? "Create your free account" : "Welcome back"}</h1>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>
            {isSignup ? "Save your invoices, reuse clients, and get 5 free exports every month." : "Sign in to your invoices, clients and history."}
          </p>

          <form onSubmit={usePw ? submitPw : sendMagic}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Email</label>
            <input className="sp-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ margin: "4px 0 12px" }} autoComplete="email" />
            {usePw && (<>
              <label style={{ fontSize: 12, color: "var(--muted)" }}>Password</label>
              <input className="sp-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" style={{ margin: "4px 0 12px" }} autoComplete={isSignup ? "new-password" : "current-password"} />
            </>)}
            {err && <p style={{ color: "var(--err-ink)", fontSize: 12.5, margin: "0 0 10px" }}>{err}</p>}
            {info && <p style={{ color: "var(--ink-soft)", fontSize: 12.5, margin: "0 0 10px" }}>{info}{devLink && <> <a href={devLink} style={{ color: "var(--ink)", textDecoration: "underline", wordBreak: "break-all" }}>Sign in →</a></>}</p>}
            <button className="btn btn-solid btn-block" type="submit" style={{ padding: 11 }} disabled={busy}>
              {busy ? "Please wait…" : usePw ? (isSignup ? "Create account" : "Log in") : "Email me a magic link"}
            </button>
          </form>

          <button className="link-text" style={{ marginTop: 12, display: "block", textAlign: "center", width: "100%" }} onClick={() => { setUsePw(!usePw); setErr(""); setInfo(""); }}>
            {usePw ? "← Use a magic link instead" : "Use a password instead"}
          </button>
          <p className="fineprint" style={{ marginTop: 12 }}>No password needed — we email you a secure sign-in link. Or use a password.</p>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 16 }}>
          {isSignup ? <>Already have an account? <Link href="/login" style={{ color: "var(--ink)" }}>Log in</Link></>
                    : <>New to BillCrafter? <Link href="/signup" style={{ color: "var(--ink)" }}>Sign up free</Link></>}
        </p>
      </div>
    </div>
  );
}
