"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import InvoiceEditor from "@/components/InvoiceEditor";
import { money } from "@/lib/invoice";
import { getUser, setUser, clearUser } from "@/lib/auth";
import { buildActivity, heatLevel } from "@/lib/store";
import { listKind, createKind, updateKind, removeKind } from "@/lib/api";
import { readLogoFile } from "@/lib/logo";
import { PRO_BETA } from "@/lib/billing";
import RecurringPane from "@/components/RecurringPane";
import ReviewCta from "@/components/ReviewCta";

const NAV = [["dashboard", "Dashboard"], ["invoices", "Invoices"], ["recurring", "Recurring"], ["clients", "Clients"], ["items", "Items & services"], ["profile", "Business profile"]];

const TEMPLATES = [
  ["Blank", "invoice", "blank", "B"], ["Freelance", "invoice", "freelance", "F"],
  ["Contractor", "invoice", "contractor", "C"], ["Consulting", "invoice", "consulting", "Co"],
  ["Photography", "invoice", "photography", "Ph"], ["Cleaning", "invoice", "cleaning", "Cl"],
  ["Small business", "invoice", "smallbusiness", "Sb"], ["Receipt", "receipt", "photography", "Rc"],
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUserState] = useState(undefined);
  const [pane, setPane] = useState("dashboard");
  const [data, setData] = useState({ clients: [], items: [], profiles: [] });
  const [history, setHistory] = useState([]);
  const [creating, setCreating] = useState(null); // {type, scenario} | null
  const [form, setForm] = useState(null); // {kind, id, values}
  const [showWelcome, setShowWelcome] = useState(false);

  // Show the welcome + review invite once (until dismissed).
  useEffect(() => { try { if (!localStorage.getItem("bc_review_welcomed")) setShowWelcome(true); } catch {} }, []);
  function dismissWelcome() { setShowWelcome(false); try { localStorage.setItem("bc_review_welcomed", "1"); } catch {} }

  useEffect(() => {
    (async () => {
      let u = null;
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) { const d = await res.json(); if (d.user) u = d.user; else if (d.ok) { router.replace("/login"); return; } }
      } catch {}
      if (!u) u = getUser();
      if (!u) { router.replace("/login"); return; }
      setUser(u); setUserState(u);
      const [clients, items, profiles, invoices] = await Promise.all([
        listKind(u.email, "clients"), listKind(u.email, "items"), listKind(u.email, "profiles"), listKind(u.email, "invoices"),
      ]);
      setData({ clients, items, profiles });
      setHistory(invoices);
    })();
  }, [router]);

  if (user === undefined) return null;

  const plan = user.plan || "free";
  const name = (user.email || "there").split("@")[0];
  const initials = (user.email || "U").slice(0, 2).toUpperCase();
  const canMultiProfile = plan === "teams";

  async function signOut() { try { await fetch("/api/auth/logout", { method: "POST" }); } catch {} clearUser(); router.replace("/login"); }
  async function refreshHistory() { setHistory(await listKind(user.email, "invoices")); }
  async function reloadLibrary() {
    const [clients, items, profiles] = await Promise.all([
      listKind(user.email, "clients"), listKind(user.email, "items"), listKind(user.email, "profiles"),
    ]);
    setData({ clients, items, profiles });
  }
  async function deleteInvoice(h) {
    if (!confirm(`Delete invoice ${h.invNo || ""}? This can’t be undone.`)) return;
    try { await fetch(`/api/db/invoices/${h._id || h.id}`, { method: "DELETE" }); } catch {}
    // Also drop it from local history + id map so it disappears even in offline fallback.
    try {
      const hist = JSON.parse(localStorage.getItem("bc_history") || "[]").filter((x) => x.id !== h.id && x.id !== h._id);
      localStorage.setItem("bc_history", JSON.stringify(hist));
      const map = JSON.parse(localStorage.getItem("bc_srvmap") || "{}"); delete map[h.id]; localStorage.setItem("bc_srvmap", JSON.stringify(map));
    } catch {}
    setHistory((p) => p.filter((x) => x.id !== h.id));
    refreshHistory();
  }

  // ---- entity forms ----
  const FIELDS = {
    client: [["name", "Client / company name", "text", true], ["email", "Email", "email"], ["address", "Address", "textarea"]],
    item: [["name", "Item / service", "text", true], ["description", "Description", "text"], ["rate", "Default rate", "number"], ["taxable", "Taxable", "check"]],
    profile: [["logo", "Logo", "logo"], ["name", "Business name", "text", true], ["email", "Email", "email"], ["address", "Address", "textarea"], ["taxId", "Tax ID / EIN", "text"], ["currency", "Default currency", "text"], ["taxRate", "Default tax %", "number"], ["terms", "Default terms", "text"]],
  };
  const listKey = (k) => k + "s";
  function openForm(kind, item) { setForm({ kind, id: item?.id || null, values: { ...(item || {}) } }); }
  function setVal(k, v) { setForm((f) => ({ ...f, values: { ...f.values, [k]: v } })); }
  async function saveForm() {
    const { kind, id, values } = form;
    if (!values.name || !values.name.trim()) { alert("Name is required."); return; }
    if (values.email && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      alert("Please enter a valid email address (e.g. name@company.com), or leave it empty.");
      return;
    }
    const key = listKey(kind);
    if (id) {
      await updateKind(user.email, key, id, values);
      setData((d) => ({ ...d, [key]: d[key].map((x) => x.id === id ? { ...x, ...values } : x) }));
    } else {
      const created = await createKind(user.email, key, values);
      setData((d) => ({ ...d, [key]: [created, ...d[key]] }));
    }
    setForm(null);
  }
  async function del(kind, id) {
    if (!confirm("Delete this " + kind + "?")) return;
    const key = listKey(kind);
    await removeKind(user.email, key, id);
    setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }));
  }
  async function toggleFav(id) {
    const c = data.clients.find((x) => x.id === id); if (!c) return;
    const updated = { ...c, favorite: !c.favorite };
    await updateKind(user.email, "clients", id, updated);
    setData((d) => ({ ...d, clients: d.clients.map((x) => x.id === id ? updated : x) }));
  }

  const act = buildActivity(history);
  const clientsSorted = [...data.clients].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="logo" style={{ padding: "6px 8px 14px" }}><LogoMark /> BillCrafter</Link>
        {NAV.map(([k, label]) => (
          <button key={k} className={"navitem" + (pane === k ? " active" : "")} onClick={() => { setPane(k); setCreating(null); setForm(null); }}>{label}</button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div className="side-review">
            <span className="sr-txt">Enjoying BillCrafter? Your review keeps it free for everyone.</span>
            <ReviewCta label="Review on Trustpilot" variant="ghost" className="review-cta--block" />
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--white)", color: "var(--on-white)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{initials}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
              <button className="link-text" style={{ fontSize: 11.5 }} onClick={signOut}>Sign out</button>
            </div>
          </div>
          </div>
        </div>
      </aside>

      <main className="main">
        {showWelcome && (
          <div className="welcome-banner">
            <div className="wb-txt">👋 <strong>Welcome, {name}!</strong> Thanks for using BillCrafter — we hope it makes billing effortless. If it’s helping, we’d love a quick review.</div>
            <div className="wb-actions">
              <ReviewCta label="Review on Trustpilot" />
              <button className="wb-x" onClick={dismissWelcome} aria-label="Dismiss">×</button>
            </div>
          </div>
        )}
        {plan !== "pro" && (
          <div className="upgrade-banner">
            <div className="txt">
              <strong>You’re on the Free plan</strong> <span className="muted">— 5 exports/month. {PRO_BETA ? "Pro (unlimited exports) is in private beta." : "Go Pro for unlimited exports, status stamps and share links."}</span>
            </div>
            <Link className="btn btn-solid" href="/upgrade">{PRO_BETA ? "About Pro" : "Upgrade to Pro — $9.90/mo"}</Link>
          </div>
        )}
        {/* DASHBOARD */}
        {pane === "dashboard" && (
          <>
            <div className="welcome">
              <div><h1>Welcome back, {name} <span className="plan-badge">{plan === "teams" ? "Teams" : plan === "pro" ? "Pro" : "Free"} member</span></h1>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Here's your billing activity.</div></div>
              <button className="btn btn-solid" onClick={() => { setPane("invoices"); setForm(null); setCreating({ type: "invoice", scenario: "blank", key: "new-" + Date.now() }); }}>+ New invoice</button>
            </div>

            <div className="kpis">
              <div className="kpi"><div className="lb">Invoices</div><div className="vl">{history.length}</div><div className="dl">saved to your account</div></div>
              <div className="kpi"><div className="lb">Clients</div><div className="vl">{data.clients.length}</div><div className="dl">in your address book</div></div>
              <div className="kpi"><div className="lb">Saved items</div><div className="vl">{data.items.length}</div><div className="dl">reusable line items</div></div>
              <div className="kpi"><div className="lb">Activity (26w)</div><div className="vl">{act.total}</div><div className="dl">documents created</div></div>
            </div>

            <div className="panel">
              <div className="panel-h"><h3>Activity</h3><span className="muted" style={{ fontSize: 12 }}>last 26 weeks</span></div>
              <div style={{ padding: "16px 18px" }}>
                <div className="heat">
                  {act.cols.map((col, ci) => (
                    <div className="heat-col" key={ci}>
                      {col.map((cell) => (<div key={cell.date} className={"heat-cell l" + heatLevel(cell.count)} title={`${cell.date}: ${cell.count}`} />))}
                    </div>
                  ))}
                </div>
                <div className="heat-legend"><span>Less</span><span className="heat-cell" /><span className="heat-cell l1" /><span className="heat-cell l2" /><span className="heat-cell l3" /><span className="heat-cell l4" /><span>More</span></div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-h"><h3>Recent invoices</h3><button className="btn btn-ghost btn-sm" onClick={() => setPane("invoices")}>View all</button></div>
              {history.length === 0 ? (
                <div className="empty-box"><h3>No invoices yet</h3><div>Create your first invoice — it'll show up here.</div><div style={{ marginTop: 14 }}><button className="btn btn-solid" onClick={() => { setPane("invoices"); setCreating({ type: "invoice", scenario: "blank", key: "new-" + Date.now() }); }}>+ New invoice</button></div></div>
              ) : (
                <table className="data"><thead><tr><th>Document</th><th>Client</th><th>Date</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                  <tbody>{history.slice(0, 6).map((h) => (
                    <tr key={h.id}><td><strong>{h.invNo}</strong> <span className="typetag">{(h.type || "invoice")[0].toUpperCase() + (h.type || "invoice").slice(1)}</span></td><td>{h.client}</td><td className="muted">{h.date}</td><td style={{ textAlign: "right", fontWeight: 500 }}>{money(h.total, h.currency)}</td></tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* INVOICES */}
        {pane === "invoices" && (
          <>
            {creating ? (
              <>
                <div className="welcome"><div><h1>{creating.snapshot ? (creating.mode === "duplicate" ? "Duplicate" : "Edit") + " " + creating.type : "New " + creating.type}</h1><div className="muted" style={{ fontSize: 13 }}>Signed in as {user.email}</div></div>
                  <button className="btn btn-ghost" onClick={() => { setCreating(null); refreshHistory(); }}>← Back to invoices</button></div>
                <InvoiceEditor
                  /* Remount per document. InvoiceEditor reads initialSnapshot in
                     a mount-only effect, so without a key React reuses the
                     instance when `creating` changes and the previous document's
                     state — logo, line items, client — survives into what the
                     user asked for as a NEW invoice. */
                  key={creating.key || (creating.snapshot ? (creating.mode || "edit") + ":" + (creating.snapshot.id || creating.snapshot._id) : "new")}
                  initialType={creating.type}
                  initialScenario={creating.scenario || "blank"}
                  initialSnapshot={creating.snapshot || null}
                  initialMode={creating.mode || "edit"}
                  onSaved={refreshHistory}
                  onLibrarySaved={reloadLibrary}
                />
              </>
            ) : (
              <>
                <div className="welcome">
                  <div><h1>Invoices</h1><div className="muted" style={{ fontSize: 13 }}>Create a new invoice in the editor, or reopen a saved one.</div></div>
                  <button className="btn btn-solid" onClick={() => setCreating({ type: "invoice", scenario: "blank", key: "new-" + Date.now() })}>+ New invoice</button>
                </div>
                <div className="panel">
                  <div className="panel-h"><h3>Your records</h3><span className="muted" style={{ fontSize: 12 }}>{history.length} saved</span></div>
                  {history.length === 0 ? (
                    <div className="empty-box"><h3>No saved invoices yet</h3><div>Click “New invoice” to open the editor and build your first one.</div><div style={{ marginTop: 14 }}><button className="btn btn-solid" onClick={() => setCreating({ type: "invoice", scenario: "blank", key: "new-" + Date.now() })}>+ New invoice</button></div></div>
                  ) : (
                    <table className="data"><thead><tr><th>Document</th><th>Client</th><th>Date</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr></thead>
                      <tbody>{history.map((h) => (
                        <tr key={h.id}><td><strong>{h.invNo}</strong> <span className="typetag">{(h.type || "invoice")[0].toUpperCase() + (h.type || "invoice").slice(1)}</span></td><td>{h.client}</td><td className="muted">{h.date}</td><td style={{ textAlign: "right", fontWeight: 500 }}>{money(h.total, h.currency)}</td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCreating({ type: h.type || "invoice", scenario: "blank", snapshot: h, mode: "edit" })}>Open</button>
                            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6 }} onClick={() => setCreating({ type: h.type || "invoice", scenario: "blank", snapshot: h, mode: "duplicate" })}>Duplicate</button>
                            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6, color: "var(--brand)" }} onClick={() => deleteInvoice(h)}>Delete</button>
                          </td></tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
                <details className="tpl-fold" style={{ marginTop: 18 }}>
                  <summary>Or start from a preset — freelance, contractor, receipt, and more</summary>
                  <div className="tpl-mini" style={{ marginTop: 12 }}>
                    {TEMPLATES.map(([label, type, scenario, m]) => (
                      <button key={label} onClick={() => setCreating({ type, scenario, key: "new-" + Date.now() })}>
                        <div className="mono">{m}</div><div className="nm">{label}</div>
                      </button>
                    ))}
                  </div>
                </details>
              </>
            )}
          </>
        )}

        {/* CLIENTS */}
        {pane === "recurring" && <RecurringPane plan={plan} history={history} />}

        {pane === "clients" && (
          <EntityPane
            title="Clients" subtitle="Saved client details — reused on every invoice. Star your regulars."
            kind="client" fields={FIELDS.client} rows={clientsSorted} form={form}
            onAdd={() => openForm("client")} onEdit={(x) => openForm("client", x)} onDelete={(id) => del("client", id)}
            setVal={setVal} onSave={saveForm} onCancel={() => setForm(null)}
            renderRow={(c) => (<>
              <td><strong>{c.name}</strong> {c.favorite ? <span className="chip-fav on">★ Regular</span> : null}</td>
              <td className="muted">{c.email || "—"}</td><td className="muted">{(c.address || "").replace(/\n/g, ", ") || "—"}</td>
              <td className="row-actions"><button className="chip-fav" onClick={() => toggleFav(c.id)}>{c.favorite ? "Unstar" : "★ Star"}</button><button className="btn btn-ghost btn-sm" onClick={() => openForm("client", c)}>Edit</button><button className="btn btn-ghost btn-sm" onClick={() => del("client", c.id)}>Delete</button></td>
            </>)}
            head={<><th>Client</th><th>Email</th><th>Address</th><th></th></>}
          />
        )}

        {/* ITEMS */}
        {pane === "items" && (
          <EntityPane
            title="Items & services" subtitle="Saved line items with default rates — add to an invoice in one click."
            kind="item" fields={FIELDS.item} rows={data.items} form={form}
            onAdd={() => openForm("item")} onEdit={(x) => openForm("item", x)} onDelete={(id) => del("item", id)}
            setVal={setVal} onSave={saveForm} onCancel={() => setForm(null)}
            renderRow={(it) => (<>
              <td><strong>{it.name}</strong></td><td className="muted">{it.description || "—"}</td>
              <td style={{ textAlign: "right", fontWeight: 500 }}>{it.rate ? money(Number(it.rate)) : "—"}</td><td className="muted">{it.taxable ? "Yes" : "—"}</td>
              <td className="row-actions"><button className="btn btn-ghost btn-sm" onClick={() => openForm("item", it)}>Edit</button><button className="btn btn-ghost btn-sm" onClick={() => del("item", it.id)}>Delete</button></td>
            </>)}
            head={<><th>Item / service</th><th>Description</th><th style={{ textAlign: "right" }}>Rate</th><th>Taxable</th><th></th></>}
          />
        )}

        {/* PROFILES */}
        {pane === "profile" && (
          <>
            <div className="welcome">
              <div><h1>Business profile{canMultiProfile ? "s" : ""}</h1>
                <div className="muted" style={{ fontSize: 13 }}>{canMultiProfile ? "Teams can keep multiple profiles (brands/entities)." : "Auto-filled into the “From” block of every document."}</div></div>
              {(canMultiProfile || data.profiles.length === 0) && !form && (<button className="btn btn-solid" onClick={() => openForm("profile")}>+ Add profile</button>)}
            </div>

            {form && form.kind === "profile" && <EntityForm fields={FIELDS.profile} values={form.values} setVal={setVal} onSave={saveForm} onCancel={() => setForm(null)} editing={!!form.id} />}

            {data.profiles.length === 0 && !form ? (
              <div className="empty-box"><h3>No business profile yet</h3><div>Add your business details once — they'll fill in automatically on every invoice.</div><div style={{ marginTop: 14 }}><button className="btn btn-solid" onClick={() => openForm("profile")}>+ Add profile</button></div></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: canMultiProfile ? "1fr 1fr" : "1fr", gap: 16 }}>
                {data.profiles.map((p) => (
                  <div className="panel" key={p.id} style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        {p.logo ? (
                          <img src={p.logo} alt="" style={{ maxHeight: 40, maxWidth: 100, objectFit: "contain", flex: "0 0 auto" }} />
                        ) : null}
                        <h3 style={{ fontSize: 16 }}>{p.name}</h3>
                      </div>
                      <div className="row-actions"><button className="btn btn-ghost btn-sm" onClick={() => openForm("profile", p)}>Edit</button><button className="btn btn-ghost btn-sm" onClick={() => del("profile", p.id)}>Delete</button></div>
                    </div>
                    {[["Email", p.email], ["Address", p.address], ["Tax ID", p.taxId], ["Currency", p.currency], ["Tax %", p.taxRate], ["Terms", p.terms]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}><span className="muted">{k}</span><span style={{ textAlign: "right", maxWidth: "60%", whiteSpace: "pre-line" }}>{v || "—"}</span></div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EntityForm({ fields, values, setVal, onSave, onCancel, editing }) {
  async function onLogoPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readLogoFile(file);
      if (data) setVal("logo", data);
    } catch {}
    e.target.value = "";
  }
  return (
    <div className="entity-form">
      {fields.map(([k, label, type]) => (
        <div key={k} className={type === "textarea" || type === "logo" ? "full" : ""}>
          <label className="field-label">{label}</label>
          {type === "check" ? (
            <label style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}><input type="checkbox" checked={!!values[k]} onChange={(e) => setVal(k, e.target.checked)} /> {label}</label>
          ) : type === "textarea" ? (
            <textarea className="sp-input" style={{ minHeight: 56, resize: "vertical" }} value={values[k] || ""} onChange={(e) => setVal(k, e.target.value)} />
          ) : type === "logo" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <label className="logo-drop" style={{ marginBottom: 0 }}>
                {values.logo ? <img src={values.logo} alt="logo" /> : <span className="logo-ph">Upload logo</span>}
                <input type="file" accept="image/*" hidden onChange={onLogoPick} />
              </label>
              {values.logo ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVal("logo", null)}>Remove</button>
              ) : (
                <span className="muted" style={{ fontSize: 12 }}>Optional — also saved when you export an invoice with a logo.</span>
              )}
            </div>
          ) : (
            <input className="sp-input" type={type === "number" ? "number" : type === "email" ? "email" : "text"} placeholder={type === "email" ? "name@company.com" : undefined} value={values[k] ?? ""} onChange={(e) => setVal(k, e.target.value)} />
          )}
        </div>
      ))}
      <div className="actions"><button className="btn btn-solid" onClick={onSave}>{editing ? "Save changes" : "Add"}</button><button className="btn btn-ghost" onClick={onCancel}>Cancel</button></div>
    </div>
  );
}

function EntityPane({ title, subtitle, kind, fields, rows, form, onAdd, onSave, onCancel, setVal, renderRow, head }) {
  const formOpen = form && form.kind === kind;
  return (
    <>
      <div className="welcome"><div><h1>{title}</h1><div className="muted" style={{ fontSize: 13 }}>{subtitle}</div></div>
        {!formOpen && <button className="btn btn-solid" onClick={onAdd}>+ Add {kind}</button>}</div>
      {formOpen && <EntityForm fields={fields} values={form.values} setVal={setVal} onSave={onSave} onCancel={onCancel} editing={!!form.id} />}
      {rows.length === 0 && !formOpen ? (
        <div className="empty-box"><h3>No {kind}s yet</h3><div>Add your first {kind} to reuse it on every invoice.</div><div style={{ marginTop: 14 }}><button className="btn btn-solid" onClick={onAdd}>+ Add {kind}</button></div></div>
      ) : rows.length > 0 ? (
        <div className="panel"><table className="data"><thead><tr>{head}</tr></thead><tbody>{rows.map((r) => (<tr key={r.id}>{renderRow(r)}</tr>))}</tbody></table></div>
      ) : null}
    </>
  );
}
