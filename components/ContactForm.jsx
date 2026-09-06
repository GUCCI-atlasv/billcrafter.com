"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault(); setErr("");
    if (!/.+@.+\..+/.test(email.trim())) { setErr("Please enter a valid email."); return; }
    if (message.trim().length < 5) { setErr("Please add a short message."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, message, website }) });
      if (r.ok) { setDone(true); return; }
      if (r.status === 503) { setErr("Our form isn’t connected yet — please email support@billcrafter.com directly."); return; }
      setErr("Couldn’t send your message. Please email support@billcrafter.com.");
    } catch { setErr("Couldn’t send. Please email support@billcrafter.com."); }
    finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="panel" style={{ padding: 20, margin: 0 }}>
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>Thanks — message sent</h3>
        <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>We’ll get back to you at {email} within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form className="panel" style={{ padding: 20, margin: 0 }} onSubmit={submit}>
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Send us a message</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div><label className="field-label">Name (optional)</label><input className="sp-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label className="field-label">Email</label><input className="sp-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
      </div>
      <div style={{ marginTop: 10 }}><label className="field-label">Message</label>
        <textarea className="sp-input" style={{ minHeight: 110, resize: "vertical" }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" /></div>
      <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} aria-hidden="true" />
      {err && <p style={{ color: "var(--err-ink)", fontSize: 12.5, margin: "10px 0 0" }}>{err}</p>}
      <button className="btn btn-solid" type="submit" style={{ marginTop: 14, padding: "10px 18px" }} disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
    </form>
  );
}
