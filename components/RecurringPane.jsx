"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/invoice";

const FREQS = [
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["quarterly", "Quarterly"],
  ["yearly", "Yearly"],
];

const fmtDate = (ms) => {
  if (!ms) return "—";
  const d = new Date(Number(ms));
  return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const todayISO = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

export default function RecurringPane({ history = [] }) {
  const [items, setItems] = useState(null);   // null = loading
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ invoiceId: "", toEmail: "", freq: "monthly", startDate: todayISO(1) });

  async function load() {
    try {
      const r = await fetch("/api/recurring");
      const d = await r.json().catch(() => ({}));
      setItems(d.ok ? (d.items || []) : []);
    } catch { setItems([]); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    const src = history.find((h) => h.id === form.invoiceId);
    if (!src) { alert("Pick a saved invoice to repeat."); return; }
    if (!/.+@.+\..+/.test(form.toEmail.trim())) { alert("Enter the client's email address."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/recurring", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          doc: src,
          toEmail: form.toEmail.trim(),
          freq: form.freq,
          startDate: form.startDate,
          title: `${src.invNo} · ${src.client || "client"}`,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setOpen(false); setForm({ invoiceId: "", toEmail: "", freq: "monthly", startDate: todayISO(1) }); load(); }
      else alert("Couldn't create the schedule. Please try again.");
    } catch { alert("Couldn't create the schedule. Please try again."); }
    finally { setBusy(false); }
  }

  async function toggle(id, active) {
    setItems((p) => p.map((x) => x.id === id ? { ...x, active: active ? 1 : 0 } : x));
    try { await fetch("/api/recurring", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, active }) }); } catch {}
  }
  async function remove(id) {
    if (!confirm("Delete this schedule? Future invoices won't be sent.")) return;
    setItems((p) => p.filter((x) => x.id !== id));
    try { await fetch("/api/recurring", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) }); } catch {}
  }

  return (
    <>
      <div className="welcome">
        <div>
          <h1>Recurring invoices</h1>
          <div className="muted" style={{ fontSize: 13 }}>
            Reissue a saved invoice on a schedule and email it to your client automatically.
          </div>
        </div>
        {!open && <button className="btn btn-solid" onClick={() => setOpen(true)}>+ New schedule</button>}
      </div>

      {open && (
        <div className="entity-form">
          <div>
            <label className="field-label">Repeat this saved invoice</label>
            <select className="sp-input" value={form.invoiceId} onChange={(e) => {
              const id = e.target.value;
              const src = history.find((h) => h.id === id);
              setForm((f) => ({ ...f, invoiceId: id, toEmail: f.toEmail || (src?.f?.toDetails?.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] || "") }));
            }}>
              <option value="">Select an invoice…</option>
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.invNo} · {h.client || "client"} · {money(h.total, h.currency)}
                </option>
              ))}
            </select>
            {history.length === 0 && (
              <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
                Save an invoice first — schedules are built from a saved one.
              </div>
            )}
          </div>
          <div>
            <label className="field-label">Send to (client email)</label>
            <input className="sp-input" type="email" placeholder="client@company.com"
              value={form.toEmail} onChange={(e) => setForm((f) => ({ ...f, toEmail: e.target.value }))} />
          </div>
          <div>
            <label className="field-label">Frequency</label>
            <select className="sp-input" value={form.freq} onChange={(e) => setForm((f) => ({ ...f, freq: e.target.value }))}>
              {FREQS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">First send</label>
            <input className="sp-input" type="date" min={todayISO()} value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div className="full muted" style={{ fontSize: 11.5 }}>
            Each run creates a new invoice number and emails your client a secure link to view it — so you also
            see when they open it.
          </div>
          <div className="actions">
            <button className="btn btn-solid" onClick={create} disabled={busy}>{busy ? "Creating…" : "Create schedule"}</button>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {items === null ? (
        <div className="empty-box">Loading…</div>
      ) : items.length === 0 ? (
        <div className="empty-box">
          <h3>No schedules yet</h3>
          <div>Set one up and the same invoice goes out every week, month or quarter — automatically.</div>
          {history.length > 0 && !open && (
            <div style={{ marginTop: 14 }}><button className="btn btn-solid" onClick={() => setOpen(true)}>+ New schedule</button></div>
          )}
        </div>
      ) : (
        <div className="panel">
          <table className="data">
            <thead><tr><th>Invoice</th><th>Client</th><th>Every</th><th>Next send</th><th>Sent</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.title || "—"}</strong></td>
                  <td className="muted">{r.to_email}</td>
                  <td className="muted">{(FREQS.find(([v]) => v === r.freq) || [, r.freq])[1]}</td>
                  <td className="muted">{r.active ? fmtDate(r.next_run) : "—"}</td>
                  <td className="muted">{r.runs || 0}×{r.last_run ? ` · last ${fmtDate(r.last_run)}` : ""}</td>
                  <td><span className={"st " + (r.active ? "st-paid" : "st-draft")}>{r.active ? "Active" : "Paused"}</span></td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggle(r.id, !r.active)}>{r.active ? "Pause" : "Resume"}</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => remove(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
