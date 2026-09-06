"use client";
// Per-account data store. New accounts start EMPTY (no demo data).
// Persists per user in localStorage now; swap to the D1 API routes for cross-device sync.

const EMPTY = { clients: [], items: [], profiles: [] };

export function keyFor(email) { return "bc_data_" + (email || "anon"); }

export function loadData(email) {
  try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(keyFor(email))) || {}) }; }
  catch { return { ...EMPTY }; }
}
export function saveData(email, data) {
  try { localStorage.setItem(keyFor(email), JSON.stringify(data)); } catch {}
}
export function uid() { return "id_" + Math.random().toString(36).slice(2, 9); }

// Saved invoices are written by the editor to 'bc_history' (per browser).
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem("bc_history")) || []; }
  catch { return []; }
}

// GitHub-style activity: counts per day for the last `weeks` weeks.
export function buildActivity(history, weeks = 26) {
  const days = weeks * 7;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // align end to end-of-week (Sat)
  const end = new Date(today); end.setDate(end.getDate() + (6 - end.getDay()));
  const start = new Date(end); start.setDate(start.getDate() - (days - 1));
  const counts = {};
  for (const h of history) {
    const t = h.savedAt ? new Date(h.savedAt) : (h.date ? new Date(h.date) : null);
    if (!t || isNaN(t)) continue;
    const key = t.toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  }
  const cells = [];
  const cur = new Date(start);
  let total = 0;
  for (let i = 0; i < days; i++) {
    const key = cur.toISOString().slice(0, 10);
    const c = counts[key] || 0; total += c;
    cells.push({ date: key, count: c });
    cur.setDate(cur.getDate() + 1);
  }
  // split into weeks (columns of 7)
  const cols = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));
  return { cols, total };
}
export function heatLevel(c) { return c <= 0 ? 0 : c === 1 ? 1 : c <= 3 ? 2 : c <= 6 ? 3 : 4; }
