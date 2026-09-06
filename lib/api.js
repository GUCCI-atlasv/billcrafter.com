"use client";
// Hybrid data access: use the D1-backed API when available (deployed on Cloudflare),
// otherwise fall back to per-account localStorage so the app still works locally.
import { loadData, saveData, uid, loadHistory } from "./store";

async function req(url, opts) {
  try { const r = await fetch(url, opts); if (r.status === 503) return null; return r; }
  catch { return null; }
}

// kind: 'clients' | 'items' | 'profiles' | 'invoices'
export async function listKind(email, kind) {
  const r = await req(`/api/db/${kind}`);
  if (r && r.ok) { const d = await r.json(); if (d.ok) return d.items || []; }
  if (kind === "invoices") return loadHistory();
  return loadData(email)[kind] || [];
}

export async function createKind(email, kind, item) {
  const r = await req(`/api/db/${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(item) });
  if (r && r.ok) { const d = await r.json(); if (d.ok) return d.item; }
  const created = { id: uid(), createdAt: Date.now(), ...item };
  if (kind !== "invoices") { const data = loadData(email); saveData(email, { ...data, [kind]: [created, ...(data[kind] || [])] }); }
  return created;
}

export async function updateKind(email, kind, id, item) {
  const r = await req(`/api/db/${kind}/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(item) });
  if (r && r.ok) return true;
  if (kind !== "invoices") { const data = loadData(email); saveData(email, { ...data, [kind]: (data[kind] || []).map((x) => x.id === id ? { ...x, ...item } : x) }); }
  return true;
}

export async function removeKind(email, kind, id) {
  const r = await req(`/api/db/${kind}/${id}`, { method: "DELETE" });
  if (r && r.ok) return true;
  if (kind !== "invoices") { const data = loadData(email); saveData(email, { ...data, [kind]: (data[kind] || []).filter((x) => x.id !== id) }); }
  return true;
}
