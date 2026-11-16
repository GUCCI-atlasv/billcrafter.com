"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CURRENCIES, TYPES, ACCENTS, SCENARIOS, CRYPTO, isCrypto, money, computeTotals, sectionSubtotal, nextInvNo, currencyDecimals, roundMoney, taxModeOf } from "@/lib/invoice";
import { qrSvg } from "@/lib/qr";
import { docType, t, intlTag, localeCurrency, localeTaxLabel, localeTaxPresets, stampLabel, STAMP_KEYS } from "@/lib/i18n";
import { edCopy } from "@/lib/editorI18n";
import { QUOTA_POLICY } from "@/lib/quotaConfig";
import { getUser as readUser, setUser as persistUser, clearUser } from "@/lib/auth";
import { listKind } from "@/lib/api";
import { readLogoFile, readPhotoFile } from "@/lib/logo";
import { trackEvent } from "@/lib/analytics";
import ReviewCta from "@/components/ReviewCta";
import SignatureModal from "@/components/SignatureModal";

// BillCrafter is free. Mirrors ANON_DAILY_LIMIT in lib/server/quota.js — the
// server is the authority, this is only for showing the counter and gating the
// UI early.
//
//   no account -> 1 PDF export per day (counted by IP), no status stamps
//   free account -> unlimited PDF exports and billing tools
//
// Print stays ungated on purpose — it's a browser function, and blocking it
// would only teach people to screenshot the invoice.
const ANON_DAILY_LIMIT = QUOTA_POLICY.pdfGuestDaily;
const utcDay = () => new Date().toISOString().slice(0, 10);
const blankItem = () => ({ desc: "", detail: "", qty: 1, rate: 0, tax: true });
// A timesheet row is an ordinary line item that also carries a date: qty is
// hours, rate is the hourly rate. Keeping it the same shape means totals, tax,
// sections and the PDF path all keep working with no special cases.
const timeItem = (date) => ({ date, desc: "", detail: "", qty: 1, rate: 0, tax: false });
// A section header row inside the line-item table ("Labor", "Materials"…).
// Identified by `section !== undefined`; carries no qty/rate of its own.
const sectionRow = (label = "") => ({ section: label });
const MAX_PHOTOS = 6;
const todayISO = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

const STYLES = ["modern", "minimal", "classic", "band", "ruled", "compact", "elegant", "mono"];

export default function InvoiceEditor({ initialType = "invoice", initialScenario = "blank", initialStyle = "modern", initialAccent = ACCENTS[0], initialStamp = "", locale = "en", initialSnapshot = null, initialMode = "edit", onSaved, onLibrarySaved }) {
  const [type, setTypeState] = useState(initialType);
  const [activeScenario, setActiveScenario] = useState(initialScenario);
  const [tpl, setTpl] = useState(initialStyle);
  const [accent, setAccent] = useState(initialAccent);
  const [currency, setCurrency] = useState(localeCurrency(locale));
  const [logo, setLogo] = useState(null);
  // Which arithmetic this document is billed with. New documents are "net" —
  // tax on the discounted base, rounded per currency. A record saved before the
  // 2026-08 fix reopens as "gross" so it still shows the figures on the PDF the
  // client received; the user can convert it deliberately from the sheet.
  const [taxMode, setTaxMode] = useState("net");
  const [items, setItems] = useState([blankItem()]);
  const [adj, setAdj] = useState({ taxRate: 0, discVal: 0, discType: "pct", shipping: 0, paid: 0, depositVal: 0, depositType: "pct" });
  const [f, setF] = useState({
    fromName: "", fromDetails: "", toName: "", toDetails: "", jobAddr: "",
    svcFrom: "", svcTo: "", svcFreq: "", svcScope: "", timesheet: false,
    invNo: TYPES[initialType].prefix + "-0001", issueDate: "", dueDate: "",
    poNo: "", payMethod: "", payNote: "", notes: "",
    cryptoNet: "", cryptoAddr: "", cryptoTag: "", cryptoWarnOff: false,
  });
  // Job photos on the document (before/after shots) and an optional milestone
  // payment schedule — both live on the sheet so they export with it.
  const [photos, setPhotos] = useState([]);      // [{ src, cap }]
  const [schedule, setSchedule] = useState([]);  // [{ label, due, amount }]
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTitle, setAuthTitle] = useState(null); // null → "Save your <doc type> — for free"
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [usage, setUsage] = useState({ day: "", anon: 0 });
  const [usageReady, setUsageReady] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [thanksOpen, setThanksOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [stamp, setStamp] = useState(initialStamp || (initialType === "receipt" ? "paid" : "")); // "" | paid | unpaid | overdue | draft | void
  const [shareUrl, setShareUrl] = useState("");
  const [sharing, setSharing] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  // Default to branding-free PDFs to match the "no watermark / no branding" promise.
  const [hideBrandFoot, setHideBrandFoot] = useState(true);
  // Local anti-loss draft state: tracks distinct fields/rows edited in this
  // session so we surface the subtle "Auto-saved locally" nudge once >3 lines
  // have been typed, and persist/restore in-progress drafts across refreshes.
  const [touchedCount, setTouchedCount] = useState(0);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftBannerOff, setDraftBannerOff] = useState(false);
  const [ocrImportedBanner, setOcrImportedBanner] = useState(null); // { mode, count } | null
  const touchedKeysRef = useRef(new Set());
  const readyForAutosaveRef = useRef(false);
  // The signature is part of the document, not a stamp applied to the finished
  // PDF: it renders inside the sheet, so it sits directly under the invoice like
  // any other field and exports in the right place. { png, name, at } | null
  const [sig, setSig] = useState(null);
  const [savedClients, setSavedClients] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const sheetRef = useRef(null);
  const lastFocusRef = useRef(null);
  const idRef = useRef("inv_" + Date.now());
  // Set when the user explicitly removes the logo from this draft. Two things
  // depend on it: the auto-apply-profile effect must not put the logo straight
  // back, and saveProfile must write logo:null instead of omitting the field —
  // otherwise the removal is invisible to the stored profile and the logo
  // reappears on the next document. Also set when a profile without a logo is
  // applied, so that choice sticks the same way.
  const logoRemovedRef = useRef(false);
  // The single-profile auto-fill is a convenience for the first blank draft of
  // a session, not a rule that re-asserts itself. Once it has run (or the user
  // has edited the header), it must not fire again — re-running is what made a
  // removed logo come back when the library refreshed after an export.
  const profileAutoFilledRef = useRef(false);
  // Localized document wording merged over the base TYPES config, so every
  // existing `ty.*` call site stays unchanged.
  const ty = docType(locale, type);
  const L = (k) => t(locale, k);
  const E = edCopy(locale);
  const INTL = intlTag(locale);
  const TAXL = localeTaxLabel(locale);
  const taxPresets = localeTaxPresets(locale);
  const fmt = (n) => money(n, currency, INTL);
  // The currency decides the precision every figure on this document is rounded
  // to — 2 for most, 0 for JPY/KRW/IDR/VND, which have no minor unit. Switching
  // currency therefore has to recompute the totals, not just relabel them.
  const dec = currencyDecimals(currency);

  const markTouched = (key) => {
    if (!readyForAutosaveRef.current) return;
    if (!touchedKeysRef.current.has(key)) {
      touchedKeysRef.current.add(key);
      setTouchedCount(touchedKeysRef.current.size);
    }
  };
  const setField = (k, v) => {
    markTouched("f:" + k);
    setF((p) => ({ ...p, [k]: v }));
  };
  const totals = useMemo(() => computeTotals(items, { ...adj, decimals: dec, taxMode }), [items, adj, dec, taxMode]);
  // Count non-empty user data lines so blank-canvas visitors who type >3 lines
  // (e.g. from + client + 2 line items, or 4 line items) get the local-autosave nudge.
  const enteredLineCount = useMemo(() => {
    let n = 0;
    if ((f.fromName || "").trim()) n += 1;
    n += (f.fromDetails || "").split("\n").filter((l) => l.trim()).length;
    if ((f.toName || "").trim()) n += 1;
    n += (f.toDetails || "").split("\n").filter((l) => l.trim()).length;
    n += (f.jobAddr || "").split("\n").filter((l) => l.trim()).length;
    for (const it of items) {
      if (it.section !== undefined) continue;
      if ((it.desc || "").trim() || (it.detail || "").trim() || Number(it.rate) > 0) n += 1;
    }
    return n;
  }, [f.fromName, f.fromDetails, f.toName, f.toDetails, f.jobAddr, items]);
  // Grow the multi-line fields to fit their content so nothing is clipped in the
  // PDF (html2canvas captures the element's rendered height, not its scroll area).
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    el.querySelectorAll("textarea.se").forEach((t) => { t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; });
    // `items` matters too: the line-item description fields are textareas now, so
    // they have to re-measure whenever a row is edited, added or removed.
  }, [f.fromDetails, f.toDetails, f.jobAddr, f.svcScope, f.payNote, f.notes, items, tpl, type, currency]);
  const fmtDMY = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString(INTL);
  };

  const defaultDueDays = (docTypeKey, scenObj) => {
    if (docTypeKey === "receipt") return 0;
    if (scenObj && Number.isFinite(scenObj.validDays)) return scenObj.validDays;
    if (docTypeKey === "estimate" || docTypeKey === "quote") return 30;
    return 14;
  };
  const draftStorageKey = () => {
    try { return "bc_autosave:" + (window.location.pathname || "/"); } catch { return "bc_autosave:/"; }
  };

  // ---- init (client only, avoids hydration mismatch) ----
  useEffect(() => {
    // Allow URL query parameters (?type=receipt&scenario=contractor&style=band&stamp=paid)
    // to pre-configure the editor on arrival, alongside path-based landing pages.
    let effType = initialType;
    let effScen = initialScenario;
    let effStamp = initialStamp || (initialType === "receipt" ? "paid" : "");
    let hasQueryOverride = false;
    try {
      const qs = new URLSearchParams(window.location.search);
      const qType = (qs.get("type") || "").toLowerCase();
      const qScen = (qs.get("scenario") || qs.get("template") || "").toLowerCase();
      const qStyle = (qs.get("style") || "").toLowerCase();
      const qStamp = (qs.get("stamp") || "").toLowerCase();
      if (TYPES[qType]) { effType = qType; hasQueryOverride = true; if (!qStamp && qType === "receipt") effStamp = "paid"; }
      if (SCENARIOS[qScen]) { effScen = qScen; hasQueryOverride = true; }
      if (STYLES.includes(qStyle)) { setTpl(qStyle); hasQueryOverride = true; }
      if (STAMP_KEYS.includes(qStamp) || qStamp === "none") { effStamp = qStamp === "none" ? "" : qStamp; hasQueryOverride = true; }
    } catch {}

    const u = readUser();
    if (u) setUser(u);
    // Reconcile with the real server session (source of truth for login + plan).
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d || !d.ok) return; // backend unavailable -> keep local
      if (d.user) { setUser(d.user); persistUser(d.user); syncUsage(); }
      else { setUser(null); clearUser(); } // no real session -> drop any stale local login
    }).catch(() => {});
    try { const h = JSON.parse(localStorage.getItem("bc_history")); if (h) setHistory(h); } catch {}
    try { const us = JSON.parse(localStorage.getItem("bc_usage")); if (us) setUsage(us); } catch {}
    syncUsage();  // server is the source of truth (anonymous exports are counted by IP)

    let restoredFromOcr = false;
    if (!initialSnapshot) {
      try {
        const rawOcr = sessionStorage.getItem("bc_ocr_handoff");
        if (rawOcr) {
          sessionStorage.removeItem("bc_ocr_handoff");
          const parsedOcr = JSON.parse(rawOcr);
          if (parsedOcr?.snapshot && Array.isArray(parsedOcr.snapshot.items)) {
            loadSnap(parsedOcr.snapshot);
            setOcrImportedBanner({ mode: parsedOcr.mode || "recreate", count: parsedOcr.count || 1 });
            restoredFromOcr = true;
          }
        }
      } catch {}
    }

    let restoredFromLocal = false;
    if (!initialSnapshot && !hasQueryOverride && !restoredFromOcr) {
      try {
        const rawDraft = localStorage.getItem(draftStorageKey());
        if (rawDraft) {
          const parsed = JSON.parse(rawDraft);
          // Restore uncommitted local drafts edited within the last 7 days.
          if (parsed && Array.isArray(parsed.items) && parsed.savedAt && (Date.now() - parsed.savedAt < 7 * 86400 * 1000)) {
            loadSnap(parsed);
            setDraftRestored(true);
            restoredFromLocal = true;
          }
        }
      } catch {}
    }

    if (initialSnapshot && initialSnapshot.items) {
      // Reopen or duplicate a saved invoice.
      loadSnap(initialSnapshot);
      if (initialMode === "duplicate") {
        idRef.current = "inv_" + Date.now();
        setTaxMode("net"); // a duplicate is a new document, billed correctly
        setF((p) => ({ ...p, invNo: nextInvNo(initialSnapshot.invNo || initialSnapshot.f?.invNo || "INV-0001"), issueDate: todayISO(), dueDate: todayISO(14) }));
        setAdj((p) => ({ ...p, paid: 0 }));
        setPhotos([]); // photos belong to the old job, not the duplicate
      } else if (initialSnapshot._id && initialSnapshot.id) {
        // Editing an existing record: point the id-map at the real server row so
        // Save updates it (works even if this browser never created it).
        try { const m = JSON.parse(localStorage.getItem("bc_srvmap") || "{}"); m[initialSnapshot.id] = initialSnapshot._id; localStorage.setItem("bc_srvmap", JSON.stringify(m)); } catch {}
      }
    } else if (!restoredFromLocal && !restoredFromOcr) {
      setTypeState(effType);
      setStamp(effStamp);
      const scenObj = SCENARIOS[effScen];
      const dueDays = defaultDueDays(effType, scenObj);
      setF((p) => ({
        ...p,
        invNo: TYPES[effType].prefix + "-0001",
        issueDate: todayISO(),
        dueDate: todayISO(dueDays),
      }));
      if (effScen && effScen !== "blank") {
        applyScenario(effScen, effType, effStamp);
      } else if (effType === "receipt") {
        setF((p) => ({ ...p, payMethod: p.payMethod || "Cash / Card", notes: "Payment received in full — thank you!" }));
      } else if (effType === "quote") {
        setF((p) => ({ ...p, notes: "Quote valid for 30 days from issue date. Thank you!" }));
      } else if (effType === "estimate") {
        setF((p) => ({ ...p, notes: "Estimate valid for 30 days from issue date. Thank you!" }));
      }
    }
    // Enable user-edit tracking only after initial hydration/scenario setup settles.
    const tmr = setTimeout(() => { readyForAutosaveRef.current = true; }, 80);
    // Allow below-the-fold example cards on landing pages to load directly into the editor
    const onLoadExample = (ev) => {
      const snap = ev?.detail?.snapshot;
      if (!snap || !Array.isArray(snap.items)) return;
      loadSnap(snap);
      trackEvent("editor_start", { doc_type: snap.type || effType, source: "example" });
      const anchor = document.getElementById("editor") || document.querySelector(".tool");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("bc:load-example", onLoadExample);
    // one visitor beacon per browser session
    try { if (!sessionStorage.getItem("bc_visit")) { sessionStorage.setItem("bc_visit", "1"); track("visit"); } } catch {}
    return () => {
      clearTimeout(tmr);
      window.removeEventListener("bc:load-example", onLoadExample);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(m) { setSavedMsg(m); clearTimeout(window._bcst); window._bcst = setTimeout(() => setSavedMsg(""), 1600); }

  // ---- analytics beacon (visitor IP + template usage + GA4 key events) ----
  function track(event, extra) {
    try {
      fetch("/api/track", {
        method: "POST", headers: { "content-type": "application/json" }, keepalive: true,
        body: JSON.stringify({ event, path: location.pathname, referrer: document.referrer || "", ...extra }),
      }).catch(() => {});
    } catch {}
  }
  function trackExport(format) {
    const gaName = format === "email" ? "email_doc" : "generate_pdf";
    trackEvent(
      gaName,
      {
        doc_type: type,
        template_id: tpl,
        from_ocr: Boolean(ocrImportedBanner),
        signed_in: Boolean(user),
      },
      { event: "export", template: tpl, docType: type, format }
    );
  }

  // ---- scenarios / templates ----
  function applyScenario(key, targetType = type, explicitStamp) {
    const s = SCENARIOS[key]; if (!s) return;
    setActiveScenario(key);
    const dueDays = defaultDueDays(targetType, s);
    if (key !== "blank") {
      // Adapt invoice-oriented contractor notes when loaded into an Estimate view.
      const adaptedNotes = (targetType === "estimate" && key === "contractor")
        ? "Estimate valid for 30 days. Good-faith projection of labor and materials; excludes permits or hidden structural repairs unless itemized. Converts to invoice on approval."
        : s.notes;
      const scenTotals = computeTotals(s.items, { taxRate: s.tax || 0, decimals: dec });
      const resolvedPaid = s.paid !== undefined
        ? s.paid
        : ((s.paidFull || targetType === "receipt") ? scenTotals.total : 0);
      setF((p) => ({
        ...p,
        fromName: s.name, fromDetails: s.details, payNote: s.pay, notes: adaptedNotes,
        jobAddr: s.jobAddr || "",
        payMethod: s.payMethod !== undefined ? s.payMethod : (targetType === "receipt" ? (p.payMethod || "Card / Bank transfer") : p.payMethod),
        dueDate: todayISO(dueDays),
        svcFrom: s.svc?.from || "", svcTo: s.svc?.to || "", svcFreq: s.svc?.freq || "", svcScope: s.svc?.scope || "",
        timesheet: !!s.timesheet,
      }));
      setAdj((p) => ({ ...p, taxRate: s.tax || 0, paid: resolvedPaid, depositVal: s.deposit?.val || 0, depositType: s.deposit?.type || "pct" }));
      setSchedule((s.schedule || []).map((r) => ({ ...r })));
      setPhotos([]);
      if (explicitStamp !== undefined) setStamp(explicitStamp);
      else if (s.stamp) setStamp(s.stamp);
    } else {
      const blankNotes = targetType === "receipt" ? "Payment received in full — thank you!"
        : targetType === "quote" ? "Quote valid for 30 days. Thank you!"
        : targetType === "estimate" ? "Estimate valid for 30 days. Thank you!"
        : s.notes;
      setF((p) => ({ ...p, fromName: "", fromDetails: "", toName: "", toDetails: "", jobAddr: "",
        svcFrom: "", svcTo: "", svcFreq: "", svcScope: "", timesheet: false, payNote: "", notes: blankNotes,
        dueDate: todayISO(dueDays) }));
      setAdj((p) => ({ ...p, taxRate: 0, paid: 0, depositVal: 0, depositType: "pct" }));
      setSchedule([]);
      setPhotos([]);
    }
    setItems(s.items.map((i) => ({ ...i })));
  }
  // A "receipt" template is a completed job marked paid in full.
  function applyTemplate(key) {
    markTouched("tpl:" + key);
    if (key === "receipt") {
      setActiveScenario("receipt");
      const s = SCENARIOS.receipt || SCENARIOS.photography;
      const t = computeTotals(s.items, { taxRate: s.tax || 0, decimals: dec });
      setF((p) => ({
        ...p,
        fromName: s.name, fromDetails: s.details,
        payMethod: s.payMethod || "Card ending 4242",
        payNote: s.pay,
        notes: s.notes || "Payment received in full — thank you!",
        dueDate: todayISO(0),
      }));
      setItems(s.items.map((i) => ({ ...i })));
      setAdj((p) => ({ ...p, taxRate: s.tax || 0, paid: t.total }));
      setStamp("paid");
      changeType("receipt", { keepStamp: true, keepDates: true });
      return;
    }
    applyScenario(key, type);
  }
  function resetLocalDraft() {
    try { localStorage.removeItem(draftStorageKey()); } catch {}
    touchedKeysRef.current.clear();
    setTouchedCount(0);
    setDraftRestored(false);
    const defaultStamp = initialStamp || (initialType === "receipt" ? "paid" : "");
    setTypeState(initialType);
    setStamp(defaultStamp);
    setF((p) => ({
      ...p,
      toName: "", toDetails: "", poNo: "",
      invNo: TYPES[initialType].prefix + "-0001",
      issueDate: todayISO(),
      dueDate: todayISO(defaultDueDays(initialType, SCENARIOS[initialScenario])),
    }));
    applyScenario(initialScenario || "blank", initialType, defaultStamp);
    flash("Reset to template defaults");
  }

  const TEMPLATES = [
    ["blank", E.scenarios.blank], ["freelance", E.scenarios.freelance], ["contractor", E.scenarios.contractor],
    ["consulting", E.scenarios.consulting], ["photography", E.scenarios.photography], ["cleaning", E.scenarios.cleaning],
    ["smallbusiness", E.scenarios.smallbusiness], ["receipt", docType(locale, "receipt").word],
  ];

  // ---- type ----
  function changeType(key, opts = {}) {
    setTypeState(key);
    const t = TYPES[key];
    setF((p) => {
      const m = (p.invNo || "").match(/(\d+)(?!.*\d)/);
      const nextDue = opts.keepDates ? p.dueDate : todayISO(defaultDueDays(key, SCENARIOS[activeScenario]));
      return { ...p, invNo: t.prefix + "-" + (m ? m[1] : "0001"), dueDate: nextDue };
    });
    if (!opts.keepStamp) {
      if (key === "receipt") {
        setStamp((prev) => prev || "paid");
        if (totals.total > 0 && Number(adj.paid) === 0) setAdj((p) => ({ ...p, paid: totals.total }));
      } else if (!user && stamp === "paid") {
        setStamp("");
      }
    }
  }
  function convertNext() {
    if (!ty.next) { alert("A receipt is the final document."); return; }
    const tgt = ty.next;
    if (tgt === "receipt") { setAdj((p) => ({ ...p, paid: totals.total })); setField("dueDate", todayISO()); setStamp("paid"); }
    idRef.current = "inv_" + Date.now();
    changeType(tgt, { keepStamp: tgt === "receipt", keepDates: tgt === "receipt" });
    alert("Converted to " + TYPES[tgt].word + ". The same details carried over.");
  }

  // ---- items ----
  const addItem = () => { markTouched("add:" + items.length); setItems((p) => [...p, blankItem()]); };
  const addSection = () => { markTouched("sec:" + items.length); setItems((p) => [...p, sectionRow(), blankItem()]); };
  const addTimeRow = () => { markTouched("time:" + items.length); setItems((p) => [...p, timeItem(todayISO())]); };
  const delItem = (i) => { markTouched("del:" + i); setItems((p) => p.filter((_, idx) => idx !== i)); };
  const updItem = (i, k, v) => {
    markTouched(`item:${i}:${k}`);
    setItems((p) => p.map((it, idx) => idx === i ? { ...it, [k]: (k === "qty" || k === "rate") ? parseFloat(v || 0) : v } : it));
  };
  const hasSections = items.some((it) => it.section !== undefined);
  // The date column appears when the document is in timesheet mode or any row
  // already carries a date (e.g. a saved invoice from before the toggle existed).
  const hasDates = f.timesheet || items.some((it) => it.section === undefined && it.date);
  // Only dated rows are time entries. A fixed-fee line sitting on the same
  // invoice has qty 1 and must not be counted as an hour — the earlier version
  // summed every row and reported 25 hours on a 24-hour timesheet.
  const totalHours = items.reduce((n, it) => it.section === undefined && it.date ? n + (Number(it.qty) || 0) : n, 0);
  function toggleTimesheet(on) {
    setF((p) => ({ ...p, timesheet: on }));
    if (on) setItems((p) => p.map((it) => it.section !== undefined || it.date ? it : { ...it, date: "" }));
  }

  // ---- payment schedule ----
  const addSchedule = () => setSchedule((p) => p.length ? [...p, { label: "", due: "", amount: "" }] : [
    { label: "Deposit — to schedule the work", due: "", amount: "" },
    { label: "Balance — on completion", due: "", amount: "" },
  ]);
  const delSchedule = (i) => setSchedule((p) => p.filter((_, idx) => idx !== i));
  const updSchedule = (i, k, v) => setSchedule((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  // ---- job photos ----
  async function onPhotos(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) { alert(`Up to ${MAX_PHOTOS} photos per document.`); return; }
    const picked = files.slice(0, room);
    const srcs = await Promise.all(picked.map((file) => readPhotoFile(file).catch(() => null)));
    const next = srcs.filter(Boolean).map((src) => ({ src, cap: "" }));
    if (next.length) setPhotos((p) => [...p, ...next]);
    if (files.length > room) alert(`Only ${room} more photo${room === 1 ? "" : "s"} fit — up to ${MAX_PHOTOS} per document.`);
  }
  const delPhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const updPhotoCap = (i, v) => setPhotos((p) => p.map((ph, idx) => idx === i ? { ...ph, cap: v } : ph));

  function onLogo(e) {
    const file = e.target.files?.[0];
    // Clear the input so picking the SAME file again still fires onChange —
    // otherwise re-adding a logo you just removed silently does nothing.
    e.target.value = "";
    if (!file) return;
    // Downscale before storing — a full-res data URL can blow past D1's row size.
    readLogoFile(file).then((data) => {
      if (!data) return;
      logoRemovedRef.current = false;
      setLogo(data);
    }).catch(() => {});
  }
  // Take the logo off this document. Remembered via logoRemovedRef so the
  // saved business profile is updated to match on the next save, rather than
  // quietly keeping the old image and re-applying it to the next invoice.
  function removeLogo() {
    logoRemovedRef.current = true;
    setLogo(null);
    flash("Logo removed");
  }

  // ---- persistence (mock cloud = localStorage) ----
  function snapshot() {
    return { id: idRef.current, type, activeScenario, tpl, accent, currency, logo, items, adj, f, stamp, sig, photos, schedule, taxMode,
      shareUrl, hideBrandFoot, brandPrefVersion: 2,
      invNo: f.invNo, client: f.toName || "(no client)", total: totals.total, date: f.issueDate, savedAt: Date.now() };
  }
  // Auto-save the working draft to browser localStorage whenever the user edits
  // fields, so accidental refreshes or tab closes never lose typed line items.
  useEffect(() => {
    if (!readyForAutosaveRef.current) return;
    if (touchedCount === 0) return;
    const tmr = setTimeout(() => {
      try { localStorage.setItem(draftStorageKey(), JSON.stringify(snapshot())); } catch {}
    }, 380);
    return () => clearTimeout(tmr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touchedCount, type, tpl, accent, currency, logo, items, adj, f, stamp, schedule, hideBrandFoot]);
  // Sync to D1. Maps the local invoice id -> server record id so re-saving
  // UPDATES instead of duplicating. Self-healing: if the mapped record no longer
  // exists (404 — e.g. the table was recreated or we're on another device), it
  // drops the stale mapping and CREATES a fresh record instead of failing.
  const HDR = { "content-type": "application/json" };
  const readMap = () => { try { return JSON.parse(localStorage.getItem("bc_srvmap") || "{}"); } catch { return {}; } };
  const writeMap = (m) => { try { localStorage.setItem("bc_srvmap", JSON.stringify(m)); } catch {} };
  async function createRecord(snap, payload) {
    const r = await fetch("/api/db/invoices", { method: "POST", headers: HDR, body: JSON.stringify(payload) });
    if (r && r.ok) { const d = await r.json().catch(() => ({})); const nid = d?.item?._id || d?.item?.id; if (nid) { const m = readMap(); m[snap.id] = nid; writeMap(m); } }
    return r;
  }
  async function persistServer(snap) {
    const attempt = async (payload) => {
      const sid = readMap()[snap.id];
      if (!sid) return createRecord(snap, payload);
      const r = await fetch(`/api/db/invoices/${sid}`, { method: "PUT", headers: HDR, body: JSON.stringify(payload) });
      // Stale mapping: the row is gone -> forget it and create a new record.
      if (r && r.status === 404) { const m = readMap(); delete m[snap.id]; writeMap(m); return createRecord(snap, payload); }
      return r;
    };
    try {
      let r = await attempt(snap);
      // A large logo or several job photos could exceed the storage limit —
      // retry once without the images (the local copy keeps them).
      if (r && !r.ok && (snap.logo || (snap.photos && snap.photos.length)))
        r = await attempt({ ...snap, logo: null, logoDropped: true, photos: [], photosDropped: true });
      if (r && r.ok) return { ok: true };
      const d = r ? await r.json().catch(() => ({})) : {};
      return { ok: false, status: r ? r.status : 0, error: d.error, detail: d.detail };
    } catch (e) { return { ok: false, error: "network" }; }
  }
  function writeLocalHistory(snap) {
    setHistory((p) => {
      const idx = p.findIndex((x) => x.id === idRef.current);
      const next = idx >= 0 ? p.map((x, i) => i === idx ? snap : x) : [snap, ...p];
      try { localStorage.setItem("bc_history", JSON.stringify(next)); } catch {}
      return next;
    });
  }
  // Incidental save (fired after an export/email/share). Best-effort, no UI noise.
  function doSaveInvoice(overrideShareUrl) {
    const snap = overrideShareUrl ? { ...snapshot(), shareUrl: overrideShareUrl } : snapshot();
    writeLocalHistory(snap);
    persistServer(snap).then((res) => { if (res.ok && onSaved) onSaved(); });
    autoSaveLibrary();
  }
  // Explicit Save button — awaits the server and reports honestly.
  async function saveInvoice() {
    if (!user) return openAuth("Sign in to save & keep billing");
    const snap = snapshot();
    writeLocalHistory(snap);
    flash("Saving…");
    autoSaveLibrary();
    const res = await persistServer(snap);
    if (res.ok) { flash("Saved to your account"); if (onSaved) onSaved(); return; }
    const reason = res.status === 401 ? "please sign in again"
      : res.status === 503 ? "cloud storage isn’t available yet"
      : res.detail ? res.detail
      : res.error === "network" ? "no connection — check your network"
      : "please try again";
    flash("Couldn’t save — " + reason);
  }
  // ---- saved Business profile / Clients / Items library (shared with dashboard) ----
  function refreshLibrary(email) {
    listKind(email, "clients").then((r) => setSavedClients(Array.isArray(r) ? r : [])).catch(() => {});
    listKind(email, "items").then((r) => setSavedItems(Array.isArray(r) ? r : [])).catch(() => {});
    listKind(email, "profiles").then((r) => setSavedProfiles(Array.isArray(r) ? r : [])).catch(() => {});
  }
  useEffect(() => {
    if (user?.email) refreshLibrary(user.email);
    else { setSavedClients([]); setSavedItems([]); setSavedProfiles([]); }
  }, [user?.email]);

  const rid = (x) => x._id || x.id;
  // The invoice's from/bill-to are free-text blobs; split them into the structured
  // fields Clients/Profiles use (email + tax id pulled out, the rest is address).
  function parseDetails(blob) {
    const lines = (blob || "").split("\n").map((l) => l.trim()).filter(Boolean);
    let email = "", taxId = "";
    const addr = [];
    for (const l of lines) {
      const tx = l.match(/^(?:tax\s*id|ein|vat|abn|gst)\s*(?:no\.?|number)?\s*[:\-]?\s*(.+)$/i);
      if (tx) { taxId = tx[1].trim(); continue; }
      const em = l.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (em && !email) {
        email = em[0];
        const left = l.replace(em[0], "").replace(/[,;|]+/g, " ").trim();
        if (left) addr.push(left);
        continue;
      }
      addr.push(l);
    }
    return { email, taxId, address: addr.join("\n") };
  }
  const saveReason = (res) => res.status === 401 ? "please sign in again"
    : res.status === 503 ? "cloud storage isn’t available yet"
    : res.detail ? res.detail
    : res.error === "network" ? "no connection"
    : "please try again";
  // Create, or update the record with the same name. Reports the real result.
  async function dbSave(kind, list, matchName, payload) {
    const existing = matchName ? list.find((x) => (x.name || "").toLowerCase() === matchName.toLowerCase()) : null;
    try {
      const r = existing
        ? await fetch(`/api/db/${kind}/${rid(existing)}`, { method: "PUT", headers: HDR, body: JSON.stringify({ ...existing, ...payload }) })
        : await fetch(`/api/db/${kind}`, { method: "POST", headers: HDR, body: JSON.stringify(payload) });
      if (r && r.ok) return { ok: true };
      const d = r ? await r.json().catch(() => ({})) : {};
      return { ok: false, status: r ? r.status : 0, detail: d.detail, error: d.error };
    } catch { return { ok: false, error: "network" }; }
  }

  function insertClient(id) {
    const c = savedClients.find((x) => rid(x) === id);
    if (!c) return;
    const details = [c.address, c.email].filter(Boolean).join("\n");
    setF((p) => ({ ...p, toName: c.name || "", toDetails: details }));
    flash("Client filled in");
  }
  // silent=true is used by the auto-save-on-download path: no alerts, no
  // "saved!" toast — it just quietly keeps the library in sync.
  async function saveClient(silent) {
    if (!user) return silent ? undefined : openAuth("Sign in to save clients");
    const name = (f.toName || "").trim();
    if (!name) { if (!silent) alert("Add a client name in “Bill to” first."); return; }
    const { email, address } = parseDetails(f.toDetails);
    const res = await dbSave("clients", savedClients, name, { name, email, address });
    if (res.ok) { refreshLibrary(user.email); onLibrarySaved && onLibrarySaved(); if (!silent) flash("Client saved to your list"); }
    else if (!silent) flash("Couldn’t save client — " + saveReason(res));
  }

  function insertItem(id) {
    const it = savedItems.find((x) => rid(x) === id);
    if (!it) return;
    const line = { desc: it.name || "", detail: it.description || "", qty: 1, rate: Number(it.rate) || 0, tax: !!it.taxable };
    const empty = (r) => !((r.desc || "").trim()) && !((r.detail || "").trim()) && (!r.rate || Number(r.rate) === 0);
    setItems((prev) => {
      if (prev.length === 1 && empty(prev[0])) return [line];
      if (prev.length && empty(prev[prev.length - 1])) return [...prev.slice(0, -1), line];
      return [...prev, line];
    });
    flash("Item added");
  }
  async function saveItemsToLibrary(silent) {
    if (!user) return silent ? undefined : openAuth("Sign in to save items");
    const lines = items.filter((it) => (it.desc || "").trim());
    if (!lines.length) { if (!silent) alert("Add a line item first."); return; }
    let ok = 0; let lastFail = null;
    // Re-read the list between saves so same-name dedupe sees rows added this pass.
    let list = savedItems.slice();
    for (const it of lines) {
      const name = it.desc.trim();
      const res = await dbSave("items", list, name, { name, description: it.detail || "", rate: Number(it.rate) || 0, taxable: !!it.tax });
      if (res.ok) { ok++; if (!list.some((x) => (x.name || "").toLowerCase() === name.toLowerCase())) list.push({ name }); }
      else lastFail = res;
    }
    if (ok) { refreshLibrary(user.email); onLibrarySaved && onLibrarySaved(); }
    if (!silent) flash(ok ? `Saved ${ok} item${ok === 1 ? "" : "s"} to your library` : "Couldn’t save items — " + saveReason(lastFail || {}));
  }

  function insertProfile(id) {
    const pr = savedProfiles.find((x) => rid(x) === id);
    if (!pr) return;
    const details = [pr.address, pr.email, pr.taxId ? `Tax ID: ${pr.taxId}` : ""].filter(Boolean).join("\n");
    setF((p) => ({ ...p, fromName: pr.name || "", fromDetails: details, notes: pr.terms || p.notes }));
    if (pr.currency && CURRENCIES[pr.currency]) setCurrency(pr.currency);
    if (pr.taxRate !== undefined && pr.taxRate !== "") setAdj((p) => ({ ...p, taxRate: Number(pr.taxRate) || 0 }));
    // Apply exactly the branding this profile carries. A profile with no logo
    // clears whatever is on the sheet — picking "Acme" should not leave the
    // previous business's mark in the header. The removal is remembered so the
    // profile isn't re-stamped with the old logo on the next save.
    setLogo(pr.logo || null);
    logoRemovedRef.current = !pr.logo;
    // Restore the look (template + accent) that went out with this business's
    // last invoice, so picking a profile brings its branding, not just its text.
    if (pr.tpl && STYLES.includes(pr.tpl)) setTpl(pr.tpl);
    if (pr.accent && ACCENTS.includes(pr.accent)) setAccent(pr.accent);
    flash("Business profile filled in");
  }
  async function saveProfile(silent) {
    if (!user) return silent ? undefined : openAuth("Sign in to save your business profile");
    const name = (f.fromName || "").trim();
    if (!name) { if (!silent) alert("Add your business name first."); return; }
    const { email, taxId, address } = parseDetails(f.fromDetails);
    // Include the invoice logo when present. A draft that simply never had one
    // omits the field, so a stray export can't wipe a logo already stored on the
    // profile (dbSave merges onto the existing record). But an EXPLICIT removal
    // has to travel: write null so the profile forgets it too — otherwise the
    // logo is undeletable, since every new invoice re-applies it from here.
    // Template + accent always go with it — the point is that the profile
    // remembers the look, so the next blank invoice can pick it up automatically.
    const payload = { name, email, taxId, address, currency, taxRate: adj.taxRate || 0, terms: f.notes || "", tpl, accent };
    if (logo) payload.logo = logo;
    else if (logoRemovedRef.current) payload.logo = null;
    const res = await dbSave("profiles", savedProfiles, name, payload);
    if (res.ok) { refreshLibrary(user.email); onLibrarySaved && onLibrarySaved(); if (!silent) flash("Business profile saved"); }
    else if (!silent) flash("Couldn’t save profile — " + saveReason(res));
  }
  // Auto-save the business profile / client / line items whenever the user
  // downloads, emails, signs or otherwise "saves" an invoice — so the library
  // in the sidebar builds itself instead of needing separate save buttons.
  // Best-effort and silent: failures here shouldn't interrupt the export.
  function autoSaveLibrary() {
    if (!user) return;
    saveProfile(true);
    saveClient(true);
    saveItemsToLibrary(true);
  }
  // Continue the user's branding on a fresh invoice without making them
  // reselect it: if this is a blank draft (not one restored from a save/share
  // link) and they have exactly one saved business profile, apply it — name,
  // logo, template and accent — the moment it loads. With more than one
  // profile we don't guess which business this invoice is for, so it stays
  // manual via the "Insert business profile" picker.
  useEffect(() => {
    if (initialSnapshot) return;
    if (profileAutoFilledRef.current) return;      // fills once per draft, never re-asserts
    if (logoRemovedRef.current) return;            // respect an explicit removal
    if (!user || savedProfiles.length !== 1) return;
    if (f.fromName || f.fromDetails || logo) return;
    profileAutoFilledRef.current = true;
    insertProfile(rid(savedProfiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedProfiles, user]);

  function loadSnap(snap) {
    if (!snap) return;
    idRef.current = snap.id || idRef.current;
    if (snap.type) setTypeState(snap.type);
    if (snap.activeScenario) setActiveScenario(snap.activeScenario);
    if (snap.tpl) setTpl(snap.tpl);
    if (snap.accent) setAccent(snap.accent);
    if (snap.currency) setCurrency(snap.currency);
    // A restored document defines its own branding: don't let the auto-fill
    // effect layer a profile on top of it, and treat "saved without a logo" as
    // a deliberate state rather than a blank waiting to be filled.
    profileAutoFilledRef.current = true;
    logoRemovedRef.current = !snap.logo;
    setTaxMode(taxModeOf(snap));
    setLogo(snap.logo || null); setStamp(snap.stamp || ""); setSig(snap.sig || null);
    if (snap.shareUrl !== undefined) setShareUrl(snap.shareUrl || "");
    if (snap.brandPrefVersion === 2 && snap.hideBrandFoot !== undefined) {
      setHideBrandFoot(!!snap.hideBrandFoot);
    } else if (snap.hideBrandFoot === true) {
      setHideBrandFoot(true);
    } else {
      setHideBrandFoot(true);
    }
    setPhotos(Array.isArray(snap.photos) ? snap.photos.map((p) => ({ ...p })) : []);
    setSchedule(Array.isArray(snap.schedule) ? snap.schedule.map((r) => ({ ...r })) : []);
    if (Array.isArray(snap.items) && snap.items.length) setItems(snap.items.map((i) => ({ ...i })));
    if (snap.adj) setAdj((p) => ({ ...p, ...snap.adj }));
    if (snap.f) setF((p) => ({ ...p, ...snap.f }));
  }
  function openInvoice(id) { const x = history.find((i) => i.id === id); if (x) { loadSnap(x); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); } }
  function duplicateInvoice(id) {
    const x = history.find((i) => i.id === id); if (!x) return;
    loadSnap(x); idRef.current = "inv_" + Date.now(); setTaxMode("net");
    setF((p) => ({ ...p, invNo: nextInvNo(x.invNo), issueDate: todayISO(), dueDate: todayISO(14) }));
    setAdj((p) => ({ ...p, paid: 0 })); setPhotos([]); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: "smooth" });
    alert("New draft created from " + x.invNo + ". Business + client details carried over.");
  }

  // ---- auth (real server session) ----
  function openAuth(title) { if (user) { setDrawerOpen(true); return; } setAuthTitle(title || null); setAuthOpen(true); }
  async function signInPassword() {
    const email = authEmail.trim().toLowerCase();
    if (!/.+@.+\..+/.test(email)) { alert("Please enter a valid email."); return; }
    if (!authPass || authPass.length < 6) { alert("Password must be at least 6 characters."); return; }
    setAuthBusy(true);
    try {
      let r = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: authPass }) });
      if (r.status === 401) {
        // No matching account -> create one automatically.
        r = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: authPass }) });
        if (r.status === 409) { alert("That email is already registered — the password doesn't match."); setAuthBusy(false); return; }
      }
      if (r.ok) {
        const d = await r.json().catch(() => ({}));
        const u = d.user || { email, plan: "free" };
        persistUser(u); setUser(u); setAuthOpen(false); setAuthPass("");
        doSaveInvoice(); flash("Signed in"); setDrawerOpen(true); syncUsage();
      } else if (r.status === 503) { alert("Accounts aren’t available on this server yet."); }
      else { alert("Couldn’t sign in. Please try again."); }
    } catch { alert("Couldn’t sign in. Please try again."); }
    finally { setAuthBusy(false); }
  }
  async function sendMagic() {
    const email = authEmail.trim().toLowerCase();
    if (!/.+@.+\..+/.test(email)) { alert("Please enter a valid email."); return; }
    setAuthBusy(true);
    try {
      const r = await fetch("/api/auth/magic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.sent) { alert("Check your email for a sign-in link (expires in 15 min)."); setAuthOpen(false); }
      else if (r.ok && d.devLink) { window.location.href = d.devLink; }
      else if (r.status === 503) { alert("Email sign-in isn’t available on this server yet."); }
      else { alert("Couldn’t send the link. Please try again."); }
    } catch { alert("Couldn’t send the link. Please try again."); }
    finally { setAuthBusy(false); }
  }
  async function signOut() {
    if (!confirm(E.signOutConfirm)) return;
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    clearUser(); setUser(null); setDrawerOpen(false);
    setStamp("");   // status stamps need an account
  }

  // ---- export quota ----
  function planOf() { return user ? "member" : "anon"; }
  function remaining() {
    if (user) return Infinity;
    const used = usage.day === utcDay() ? (usage.anon || 0) : 0;
    return Math.max(0, ANON_DAILY_LIMIT - used);
  }
  function storeUsage(next) {
    try { localStorage.setItem("bc_usage", JSON.stringify(next)); } catch {}
    return next;
  }
  // Pull the authoritative anonymous counter from the server (D1, keyed by IP).
  function syncUsage() {
    fetch("/api/usage")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.ok) return;
        if (d.plan === "anon") setUsage(storeUsage({ day: d.day, anon: d.count }));
      })
      .catch(() => {})
      .finally(() => setUsageReady(true));
  }
  // Record an export done by the client-side renderer. Accounts are unlimited;
  // the server still logs the export for stats.
  function bumpUsage() {
    if (!user) {
      const day = utcDay();
      setUsage((p) => storeUsage({ day, anon: (p.day === day ? p.anon || 0 : 0) + 1 }));
    }
    fetch("/api/usage", { method: "POST" }).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!d || !d.ok || d.plan !== "anon") return;
      setUsage(storeUsage({ day: d.day, anon: d.count }));
      if (d.remaining === 0) flash(E.usedTodayFlash);
    }).catch(() => {});
  }
  // Bundled, not fetched. Exporting used to depend on cdnjs.cloudflare.com being
  // reachable at the moment the user clicked Download — for anyone behind a
  // restrictive network that is the difference between having an invoice and
  // having nothing. The dynamic import keeps the ~800KB out of the initial page
  // load; it only costs a chunk fetch from our own origin on first export.
  // The CDN stays as a fallback for the case where that chunk itself fails.
  async function ensureHtml2pdf() {
    if (window.html2pdf) return;
    try {
      const mod = await import("html2pdf.js");
      const fn = mod.default || mod;
      if (typeof fn === "function") { window.html2pdf = fn; return; }
    } catch { /* fall through to the CDN copy */ }
    await new Promise((res, rej) => {
      if (window.html2pdf) return res();
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
      s.onload = res; s.onerror = rej; document.body.appendChild(s);
    });
    if (!window.html2pdf) throw new Error("export_lib_unavailable");
  }
  // html2canvas does not photograph the live page. It clones the document into a
  // detached iframe and renders that — and the iframe re-fetches every
  // <link rel="stylesheet"> over the network. When that one request fails or is
  // still in flight (a cold edge, a redirect, a blocked CDN, a slow connection),
  // the capture is taken against the browser's DEFAULT styles: naked form
  // controls, both the input and its print-only twin, the "+ Add line item"
  // buttons, no layout. That is a finished invoice arriving at a client looking
  // like a broken web form, and it is silent — nothing throws.
  //
  // The rules are already parsed in this page's memory, so copy them straight
  // into the clone and take the network out of the export path entirely.
  function inlineStylesForCapture(doc) {
    let css = "";
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; } // cross-origin sheet, unreadable by design
      if (!rules) continue;
      for (const rule of Array.from(rules)) css += rule.cssText + "\n";
    }
    // Nothing readable: leave the links alone rather than strip the only styling
    // the clone might still manage to load.
    if (!css) return;
    const style = doc.createElement("style");
    style.textContent = css;
    doc.head.appendChild(style);
    // Redundant now, and not harmless: a late-arriving link re-applies after the
    // inlined copy and can win the cascade mid-render.
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => l.remove());
  }
  // The failure mode this guards is silent. An unstyled clone still produces a
  // perfectly valid canvas, so the user gets a "successful" download of a
  // document that reaches their client as naked form controls — visible delete
  // buttons, every field printed twice, no layout. Nothing throws on its own.
  //
  // So assert two things that cannot be true unless our CSS is in force: the
  // sheet has its padding, and the editor-only "+ Add line item" button is
  // hidden. Throwing here aborts the export before a canvas exists, which turns
  // an invisible corruption into a visible failure the user can act on.
  // html2pdf does not hand html2canvas the sheet — it deep-clones it into an
  // overlay container and renders THAT. html2canvas then clones the whole
  // document, so the capture document holds TWO .sheet elements: the page's
  // own, and the copy inside .html2pdf__container that actually gets drawn.
  //
  // doc.querySelector(".sheet") returns the first — the page's own — which is
  // never rendered. Every fixup applied through it was applied to the wrong
  // copy: the flatten below rewrote an invisible sheet while the rendered one
  // kept its live inputs, and the guard checked a sheet that was correctly
  // styled by definition, so it never fired. Always resolve the container copy
  // when there is one.
  function captureRoots(doc) {
    const container = doc.querySelector(".html2pdf__container");
    const inContainer = container ? container.querySelectorAll(".sheet") : [];
    const roots = inContainer.length ? inContainer : doc.querySelectorAll(".sheet");
    return Array.from(roots);
  }
  function assertCaptureStyled(doc) {
    const sheet = captureRoots(doc)[0];
    if (!sheet) throw new Error("export_no_sheet");
    const view = doc.defaultView || window;
    // .sheet carries 44px of padding; .exporting only removes its shadow.
    if ((parseFloat(view.getComputedStyle(sheet).paddingTop) || 0) < 4) throw new Error("export_unstyled");
    // .exporting hides the add-row controls. If one is still visible, the
    // exporting rules never applied and neither did anything else.
    const btn = sheet.querySelector(".add-row") || doc.querySelector(".add-row");
    if (btn && view.getComputedStyle(btn).display !== "none") throw new Error("export_unstyled");
  }
  // html2canvas lays out form controls itself instead of letting the browser do
  // it, and it gets the vertical box wrong: the value inside an <input> is
  // clipped part-way down. A client name, a quantity, a rate, a wallet address
  // all reach the client sliced in half — the document looks corrupted even
  // though every style is correct.
  //
  // The sheet already has a static-text counterpart for this. Fields with a
  // hand-written print-only twin (invoice no, dates, addresses) swap to a
  // .se-print element and render perfectly; the clipped ones are exactly those
  // that never got a twin. Rather than hand-write twins for the rest and hope
  // the next field added gets one too, swap EVERY remaining live control for
  // the same .se-print text at capture time. Same classes, so the sheet's own
  // typography and alignment carry over untouched.
  function flattenControlsIn(sheet, doc, view) {
    sheet.querySelectorAll("input, textarea, select").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio" || el.type === "file") return;
      const cs = view.getComputedStyle(el);
      if (cs.display === "none") return;
      const val = el.tagName === "SELECT"
        ? (el.options[el.selectedIndex]?.text || "")
        : (el.value || "");
      const repl = doc.createElement("div");
      repl.className = ((el.className || "") + " se-print").trim();
      if (cs.textAlign && cs.textAlign !== "start") repl.style.textAlign = cs.textAlign;
      repl.textContent = val;
      el.replaceWith(repl);
    });
  }
  function flattenControlsForCapture(doc) {
    const view = doc.defaultView || window;
    captureRoots(doc).forEach((sheet) => {
      flattenControlsIn(sheet, doc, view);
      correctFilledCellText(sheet, doc, view);
    });
  }
  // html2canvas places text inside a padded box roughly padding-top too low —
  // it counts the top padding twice. Nowhere else does this show, because the
  // sheet is white on white; but the grand-total row is a filled band, and there
  // the figure printed hard against the band's lower edge with a gap of empty
  // fill above it. Measured on the real sheet: 19px above the text, 1px below,
  // where both should be ~10.
  //
  // Everything structural was tried first and changed nothing — vertical-align,
  // wrapping the cell text in a block, rebuilding the row as a flexbox. Only the
  // top padding moves it. So compensate for exactly that in the clone: zero the
  // top padding and give the whole amount to the bottom, which leaves the band
  // the same height while cancelling the double count. Screen rendering is
  // untouched — this only ever runs on the copy being captured.
  function correctFilledCellText(sheet, doc, view) {
    sheet.querySelectorAll(".totals tr.grand td").forEach((cell) => {
      const cs = view.getComputedStyle(cell);
      const top = parseFloat(cs.paddingTop) || 0;
      const bottom = parseFloat(cs.paddingBottom) || 0;
      if (!top) return;
      cell.style.paddingTop = "0px";
      cell.style.paddingBottom = (top + bottom) + "px";
    });
  }

  function prepareClone(doc) {
    inlineStylesForCapture(doc);
    assertCaptureStyled(doc);
    flattenControlsForCapture(doc);
  }
  // html2pdf's cloneNode copies the live value of TEXTAREA and SELECT, but not
  // INPUT. A React-controlled input keeps whatever `value` ATTRIBUTE it was
  // rendered with, so a field the user typed into can clone with the value it
  // held on first paint. Writing the live value back before the clone is taken
  // keeps the PDF equal to the screen.
  function syncInputsForCapture(root) {
    if (!root) return;
    root.querySelectorAll("input").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") {
        if (el.checked) el.setAttribute("checked", ""); else el.removeAttribute("checked");
      } else {
        el.setAttribute("value", el.value);
      }
    });
  }
  // One definition of "what a BillCrafter PDF is", shared by download, email and
  // signing — they were three copies that could drift apart.
  const pdfOptions = (filename) => ({
    ...(filename ? { filename } : {}),
    margin: 10,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 3, backgroundColor: "#ffffff", useCORS: true, onclone: prepareClone },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
  });
  // Everything that must be true before a capture is taken.
  async function prepareCapture() {
    await ensureHtml2pdf();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    document.body.classList.add("exporting");
    syncInputsForCapture(sheetRef.current);
    // A webfont still swapping mid-capture reflows the sheet after html2canvas
    // has measured it, which shifts text out of its box in the PDF.
    try { await document.fonts.ready; } catch {}
  }
  function gateExport() {
    if (remaining() > 0) return true;
    openAuth(E.quotaGateAuth);
    return false;
  }
  // Make one path segment safe without destroying non-Latin names. The old rule
  // stripped everything outside [A-Za-z0-9_], which turned "株式会社山田" into
  // "______" — so we only remove characters that are actually illegal in a
  // filename, plus control characters, and collapse whitespace to underscores.
  function safePart(s, max = 60) {
    return String(s || "")
      .replace(/[\/\\?%*:|"<>]/g, "")     // illegal on Windows / macOS
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1f\x7f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^[_.]+|[_.]+$/g, "")      // no leading dot => no hidden file
      .slice(0, max);
  }
  // <date>_<business>_<invoice no>.pdf — e.g. 20260726_Rivera_Design_Studio_INV-0042
  // The date is the invoice's own issue date (YYYYMMDD, no hyphens), not today's,
  // so re-downloading the same invoice next month still produces the same
  // filename. Empty parts are dropped rather than leaving stray underscores.
  function fileBase() {
    const raw = /^\d{4}-\d{2}-\d{2}$/.test(f.issueDate || "") ? f.issueDate : todayISO();
    const date = raw.replace(/-/g, "");
    const parts = [date, safePart(f.fromName), safePart(f.invNo, 40)].filter(Boolean);
    return parts.join("_") || "invoice";
  }
  // Lightweight review invitation (R11): shown only on/after the 3rd completed
  // task and at most once every 30 days, regardless of satisfaction.
  function shouldShowReviewNudge() {
    try {
      const count = Number(localStorage.getItem("bc_completed_tasks") || 0) + 1;
      localStorage.setItem("bc_completed_tasks", String(count));
      if (count < 3) return false;
      const last = Number(localStorage.getItem("bc_review_last_at") || 0);
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - last < THIRTY_DAYS) return false;
      localStorage.setItem("bc_review_last_at", String(Date.now()));
      return true;
    } catch {}
    return false;
  }
  // PDF is the only export format. Word (.doc) and Excel (.xls) were HTML files
  // wearing an Office extension: they opened with a security warning, reflowed
  // the layout, and lost the logo, signature, QR and job photos — so what the
  // client received was never what the editor showed. One format, done properly,
  // beats three that don't survive the trip. Print covers paper.
  // Ask the server to print the document with a real browser. Returns true if
  // the file was delivered. Any failure — binding absent, cold start timeout,
  // network — returns false and the caller falls back to the client renderer,
  // so this can never leave the user without a PDF.
  async function serverExport() {
    try {
      const r = await fetch("/api/pdf", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc: snapshot(), locale, filename: fileBase() + ".pdf" }),
      });
      if (!r.ok) {
        // The server spends the export itself. When it says it already counted
        // one, the fallback below must not count a second.
        const j = await r.json().catch(() => ({}));
        return { ok: false, counted: !!j.counted, quota: j.error === "quota" };
      }
      if (!(r.headers.get("content-type") || "").includes("application/pdf")) return { ok: false, counted: false };
      const blob = await r.blob();
      if (!blob || blob.size < 1000) return { ok: false, counted: false };   // a valid invoice PDF is never this small
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fileBase() + ".pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return { ok: true, counted: true };
    } catch { return { ok: false, counted: false }; }
  }
  async function doExport() {
    if (exportBusy) return;
    if (!gateExport()) return;
    setExportBusy(true);
    // Server first: it prints with the browser's own engine, so the output is
    // vector text at the right size in the right place. The client renderer
    // below re-implements layout and is only the fallback now.
    let serverCounted = false;
    try {
      try {
        const s = await serverExport();
        serverCounted = !!s.counted;
        if (s.quota) {
          syncUsage();
          openAuth(E.quotaGateAuth);
          return;
        }
        if (s.ok) {
          if (user) doSaveInvoice();
          syncUsage(); trackExport("pdf");
          if (shouldShowReviewNudge()) setThanksOpen(true);
          else flash(E.thanksTitle(ty.word.toLowerCase()));
          return;
        }
      } catch { /* fall through to the client renderer */ }
      try {
        await prepareCapture();
        await window.html2pdf().set(pdfOptions(fileBase() + ".pdf")).from(sheetRef.current).save();
        if (user) doSaveInvoice(); // exports show up in the dashboard + activity
        if (serverCounted) syncUsage(); else bumpUsage();
        trackExport("pdf");
        if (shouldShowReviewNudge()) setThanksOpen(true);
        else flash(E.thanksTitle(ty.word.toLowerCase()));
      } catch (err) {
        console.error("[BillCrafter] PDF export failed:", err);
        const code = (err && err.message) || "unknown";
        const unstyled = code === "export_unstyled";
        const msg = unstyled
          ? "Your PDF couldn't be generated correctly, so it wasn't downloaded — sending it would have produced a broken invoice. Please check your connection and try again."
          : "Your PDF couldn't be generated, so it wasn't downloaded. Please try again.";
        if (confirm(msg + "\n\n(" + String(code).slice(0, 80) + ")\n\nOpen the print dialog instead? You can save as PDF from there.")) window.print();
      } finally {
        document.body.classList.remove("exporting");
      }
    } finally {
      setExportBusy(false);
    }
  }
  // ---- share link + view tracking (free with an account) ----
  async function doShare() {
    if (!user) return openAuth("Sign in to share invoices");
    setSharing(true);
    try {
      const snap = snapshot();
      const r = await fetch("/api/share", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc: snap, title: `${f.invNo} · ${f.toName || "client"}`, locale }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.url) {
        setShareUrl(d.url);
        try { await navigator.clipboard.writeText(d.url); flash("Link copied"); } catch { flash("Link created"); }
        if (user) doSaveInvoice(d.url);
      } else if (r.status === 401) { openAuth("Sign in to share invoices"); }
      else { alert("Couldn't create the link. Please try again."); }
    } catch { alert("Couldn't create the link. Please try again."); }
    finally { setSharing(false); }
  }

  function doPrint() {
    trackEvent("print_doc", { doc_type: type });
    window.print();
  }

  // Render the current sheet to a base64 PDF for the signing flow. Same pipeline
  // as Download, minus the save-to-disk step.
  async function pdfBase64ForSigning() {
    await prepareCapture();
    try {
      const dataUri = await window.html2pdf().set(pdfOptions()).from(sheetRef.current).outputPdf("datauristring");
      return (dataUri.split(",")[1]) || "";
    } finally {
      document.body.classList.remove("exporting");
    }
  }
  function doSign() {
    if (!user) return openAuth("Sign in to e-sign your invoices — free with an account");
    setSignOpen(true);
  }

  // Called by the modal once a signature has been drawn and consented to.
  // Order matters: put the signature into the document, let it paint, and only
  // then capture the PDF — so the file contains the signature exactly where the
  // editor shows it. The server adds the audit record, storage and email.
  async function applySignature({ png, name, sendTo }) {
    const at = new Date().toISOString();
    setSig({ png, name, at });
    // Two frames: one for React to commit, one for the browser to paint the image.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const pdfBase64 = await pdfBase64ForSigning();
    const res = await fetch("/api/sign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        pdfBase64, signaturePng: png, signerName: name, consent: true,
        invoiceNo: f.invNo, invoiceId: idRef.current, docType: ty.word,
        sendTo: sendTo || null,
      }),
    });
    const d = await res.json().catch(() => null);
    if (!res.ok || !d?.ok) {
      // The signature stays on the document — only the server record failed.
      const e = new Error(d?.error || "sign_failed"); e.status = res.status; throw e;
    }
    doSaveInvoice();   // keep the signed version in the user's history
    return d;
  }
  function doEmail() {
    if (!user) return openAuth("Sign in to email invoices");
        setEmailTo("");
    setEmailSubject(`${ty.word} ${f.invNo} from ${f.fromName || "BillCrafter"}`);
    setEmailMsg(`Hi,\n\nPlease find ${ty.word.toLowerCase()} ${f.invNo} attached.\n\nThank you,\n${f.fromName || ""}`);
    setEmailOpen(true);
  }
  async function sendEmail() {
    if (sending) return;
    if (!/.+@.+\..+/.test(emailTo.trim())) { alert(E.emailInvalidTo); return; }
    setSending(true);
    try {
      await prepareCapture();
      const dataUri = await window.html2pdf().set(pdfOptions()).from(sheetRef.current).outputPdf("datauristring");
      document.body.classList.remove("exporting");
      const base64 = (dataUri.split(",")[1]) || "";
      const r = await fetch("/api/send-invoice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ to: emailTo.trim(), subject: emailSubject, message: emailMsg, filename: fileBase() + ".pdf", pdfBase64: base64 }) });
      if (r.ok) { doSaveInvoice(); bumpUsage(); trackExport("email"); setEmailOpen(false); flash(E.emailSubmitted); }
      else if (r.status === 401) { setEmailOpen(false); openAuth(E.myInvAuth); }
      else if (r.status === 429) {
        const d = await r.json().catch(() => ({}));
        alert(d?.error === "daily_limit_exceeded" ? E.emailDailyCap : E.emailRateCap);
      }
      else if (r.status === 503) { alert(E.emailUnavailable); }
      else { alert(E.emailSendFailed); }
    } catch {
      document.body.classList.remove("exporting");
      alert(E.emailSendFailed);
    } finally { setSending(false); }
  }

  const anyModalOpen = authOpen || drawerOpen || emailOpen || thanksOpen || signOpen;
  const prevAnyModalRef = useRef(false);
  useEffect(() => {
    if (anyModalOpen && !prevAnyModalRef.current && typeof document !== "undefined") {
      lastFocusRef.current = document.activeElement;
    } else if (!anyModalOpen && prevAnyModalRef.current) {
      try { lastFocusRef.current?.focus?.(); } catch {}
    }
    prevAnyModalRef.current = anyModalOpen;
  }, [anyModalOpen]);

  useEffect(() => {
    if (!(authOpen || drawerOpen || emailOpen || thanksOpen)) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setAuthOpen(false); setDrawerOpen(false); setEmailOpen(false); setThanksOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, drawerOpen, emailOpen, thanksOpen]);

  const remDisplay = remaining();
  const sheetStyle = { ["--accent"]: accent };
  const canShowStamp = Boolean(stamp && (user || (type === "receipt" && stamp === "paid")));
  const showAutosaveBanner = Boolean(
    !user && !draftBannerOff && (
      draftRestored ||
      touchedCount > 3 ||
      (activeScenario === "blank" && touchedCount > 0 && enteredLineCount > 3)
    )
  );

  return (
    <>
      <div className="tool">
        <div className="tool-grid">
          {/* EDITOR (WYSIWYG) */}
          <div className="editor-pane">
            {ocrImportedBanner ? (
              <div className="autosave-bar print-hide" role="status">
                <div className="ab-msg">
                  <span className="ab-dot" aria-hidden="true" />
                  <span>
                    {ocrImportedBanner.mode === "bill_expenses"
                      ? E.ocrImportedBillExpenses(ocrImportedBanner.count)
                      : E.ocrImportedSingle}
                  </span>
                </div>
                <div className="ab-acts">
                  <button
                    type="button"
                    className="ab-x"
                    aria-label="Dismiss OCR import notice"
                    onClick={() => setOcrImportedBanner(null)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : null}
            {showAutosaveBanner ? (
              <div className="autosave-bar print-hide" role="status">
                <div className="ab-msg">
                  <span className="ab-dot" aria-hidden="true" />
                  <span>
                    {draftRestored ? E.draftRestored : E.autoSavedLocally}
                  </span>
                </div>
                <div className="ab-acts">
                  {draftRestored ? (
                    <button type="button" className="ab-reset" onClick={resetLocalDraft}>{E.reset}</button>
                  ) : null}
                  <button
                    type="button"
                    className="ab-cta"
                    onClick={() => openAuth(E.syncDraftAuth)}
                  >
                    {E.signUpFreeCta}
                  </button>
                  <button
                    type="button"
                    className="ab-x"
                    aria-label={E.dismiss}
                    onClick={() => setDraftBannerOff(true)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : null}
            <div ref={sheetRef} className={"sheet " + tpl} style={sheetStyle}>
              {/* Status stamp. It has to live inside .sheet — sheetRef is what
                  html2pdf captures and what print sees, so a stamp rendered
                  anywhere else exists on screen and vanishes from the PDF.
                  aria-hidden because the status is already stated in the totals
                  ("Paid in full" / "Balance due"); the stamp is decoration over
                  the top of it, and reading it out twice helps nobody. */}
              {canShowStamp ? <div className={"stamp stamp-" + stamp} aria-hidden="true">{stampLabel(locale, stamp)}</div> : null}
              <div className="inv-head">
                <div className="brandblock">
                  {/* The remove control is a sibling of the label, not a child:
                      nested inside it, every click would also open the file
                      picker. .logo-wrap is display:contents-free so the layout
                      of .logo-drop itself is untouched, and both the export and
                      print paths hide the button. */}
                  <div className="logo-wrap">
                    <label className="logo-drop">
                      {logo ? <img src={logo} alt="logo" /> : <span className="logo-ph">{E.addLogo}</span>}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={onLogo} />
                    </label>
                    {logo ? (
                      <button type="button" className="logo-x" onClick={removeLogo}
                        title={E.remove} aria-label={E.remove}>×</button>
                    ) : null}
                  </div>
                  <input className="se biz" aria-label={E.bizName} value={f.fromName} onChange={(e) => setField("fromName", e.target.value)} placeholder={E.bizName} />
                  <textarea className="se dets print-hide" rows={2} value={f.fromDetails} onChange={(e) => setField("fromDetails", e.target.value)} placeholder={E.bizDetails} />
                  <div className="se dets se-print print-only">{f.fromDetails}</div>
                </div>
                <div className="inv-meta">
                  <div className="inv-word">{ty.word}</div>
                  <div className="metarow"><span>{L("doc.no")}</span><input className="se print-hide" aria-label={L("doc.no")} value={f.invNo} onChange={(e) => setField("invNo", e.target.value)} /><span className="metaval print-only">{f.invNo}</span></div>
                  <div className="metarow"><span>{L("doc.issued")}</span><input className="se print-hide" type="date" aria-label={L("doc.issued")} value={f.issueDate} onChange={(e) => setField("issueDate", e.target.value)} /><span className="metaval print-only">{fmtDMY(f.issueDate)}</span></div>
                  <div className="metarow"><span>{ty.d2}</span><input className="se print-hide" type="date" aria-label={ty.d2} value={f.dueDate} onChange={(e) => setField("dueDate", e.target.value)} /><span className="metaval print-only">{fmtDMY(f.dueDate)}</span></div>
                  <div className={"metarow hide-empty-print" + (f.poNo ? "" : " is-empty")}><span>{L("doc.po")}</span><input className="se print-hide" aria-label={L("doc.po")} value={f.poNo} onChange={(e) => setField("poNo", e.target.value)} placeholder={E.poPh} />{f.poNo ? <span className="metaval print-only">{f.poNo}</span> : null}</div>
                  {ty.method && <div className={"metarow hide-empty-print" + (f.payMethod ? "" : " is-empty")}><span>{L("doc.method")}</span><input className="se print-hide" aria-label={L("doc.method")} value={f.payMethod} onChange={(e) => setField("payMethod", e.target.value)} placeholder={E.payMethodPh} />{f.payMethod ? <span className="metaval print-only">{f.payMethod}</span> : null}</div>}
                </div>
              </div>

              <div className="billto">
                <div className="tag">{ty.party}</div>
                <input className="se cli" aria-label={E.clientNamePh} value={f.toName} onChange={(e) => setField("toName", e.target.value)} placeholder={E.clientNamePh} />
                <textarea className="se dets print-hide" rows={2} value={f.toDetails} onChange={(e) => setField("toDetails", e.target.value)} placeholder={E.clientDetailsPh} />
                <div className="se dets se-print print-only">{f.toDetails}</div>
              </div>

              {/* Job site / service address — trades bill the work address, not the
                  billing address. Optional; disappears from the PDF when empty. */}
              <div className={"jobsite hide-empty-print" + (f.jobAddr ? "" : " is-empty")}>
                <div className="tag">{L("doc.jobsite")}</div>
                <textarea className="se dets print-hide" rows={1} value={f.jobAddr} onChange={(e) => setField("jobAddr", e.target.value)} placeholder={E.jobsitePh} />
                <div className="se dets se-print print-only">{f.jobAddr}</div>
              </div>

              {/* Service period — for recurring work (cleaning, lawn care,
                  maintenance plans), the invoice covers a span of visits rather
                  than one job. Shown only once a period or frequency is set. */}
              {(f.svcFrom || f.svcTo || f.svcFreq || f.svcScope) ? (
                <div className="svc-period">
                  <div className="tag">{L("doc.servicePeriod")}</div>
                  <div className="svc-row">
                    <input className="se svc-date print-hide" type="date" aria-label={L("doc.servicePeriod")} value={f.svcFrom} onChange={(e) => setField("svcFrom", e.target.value)} />
                    <span className="svc-dash">–</span>
                    <input className="se svc-date print-hide" type="date" aria-label={L("doc.servicePeriod")} value={f.svcTo} onChange={(e) => setField("svcTo", e.target.value)} />
                    <span className="se-print print-only svc-range">{[fmtDMY(f.svcFrom), fmtDMY(f.svcTo)].filter(Boolean).join(" – ")}</span>
                    <span className={"svc-freq-wrap hide-empty-print" + (f.svcFreq ? "" : " is-empty")}>
                      <span className="svc-lb">{L("doc.frequency")}</span>
                      <input className="se svc-freq print-hide" value={f.svcFreq} onChange={(e) => setField("svcFreq", e.target.value)} placeholder={E.freqPh} />
                      {f.svcFreq ? <span className="se-print print-only">{f.svcFreq}</span> : null}
                    </span>
                    <button type="button" className="del-row svc-x print-hide" title={E.remove} onClick={() => setF((p) => ({ ...p, svcFrom: "", svcTo: "", svcFreq: "", svcScope: "" }))}>×</button>
                  </div>
                  <div className={"hide-empty-print" + (f.svcScope ? "" : " is-empty")}>
                    <textarea className="se dets print-hide" rows={1} value={f.svcScope} onChange={(e) => setField("svcScope", e.target.value)} placeholder={E.scopePh} />
                    <div className="se dets se-print print-only">{f.svcScope}</div>
                  </div>
                </div>
              ) : null}

              <table className="inv">
                {/* Column widths live in CSS as percentages (see table.inv col rules).
                    Fixed px widths used to overflow narrow phones, which crushed the
                    description column to a single-character sliver. */}
                <thead><tr>
                  {hasDates ? <th className="col-date">{L("doc.date")}</th> : null}
                  <th className="col-desc">{L("doc.description")}</th><th className="num col-qty">{hasDates ? L("doc.hours") : L("doc.qty")}</th>
                  <th className="num col-rate">{L("doc.rate")}</th><th className="tc col-tax">{L("doc.tax")}</th>
                  <th className="num col-amt">{L("doc.amount")}</th><th className="col-act"></th>
                </tr></thead>
                <tbody>
                  {items.map((it, i) => it.section !== undefined ? (
                    // Section header ("Labor", "Materials"…) with the section's
                    // own subtotal on the right — computed, not typed.
                    <tr key={i} className="sec-row">
                      <td colSpan={hasDates ? 5 : 4} className="sec-cell">
                        <input className="se sec-name print-hide" value={it.section} onChange={(e) => updItem(i, "section", e.target.value)} placeholder={E.sectionPh} />
                        <div className="se sec-name se-print print-only">{it.section}</div>
                      </td>
                      <td className="amount-cell sec-sub">{fmt(sectionSubtotal(items, i, dec))}</td>
                      <td className="col-act"><button className="del-row" onClick={() => delItem(i)} title={E.remove}>×</button></td>
                    </tr>
                  ) : (
                    <tr key={i}>
                      {hasDates ? (
                        <td className="col-date">
                          <input className="se print-hide" type="date" aria-label={`${L("doc.date")} ${i + 1}`} value={it.date || ""} onChange={(e) => updItem(i, "date", e.target.value)} />
                          <span className="se se-print print-only">{fmtDMY(it.date)}</span>
                        </td>
                      ) : null}
                      <td>
                        <textarea className="se print-hide" rows={1} value={it.desc} onChange={(e) => updItem(i, "desc", e.target.value)} placeholder={E.itemPh} />
                        <textarea className="se it-detail print-hide" rows={1} value={it.detail} onChange={(e) => updItem(i, "detail", e.target.value)} placeholder={E.detailPh} />
                        <div className="se se-print print-only">{it.desc}</div>
                        {it.detail ? <div className="se it-detail se-print print-only">{it.detail}</div> : null}
                      </td>
                      <td className="num"><input className="se" type="number" min="0" step="any" aria-label={`${L("doc.qty")} ${i + 1}`} value={it.qty} onChange={(e) => updItem(i, "qty", e.target.value)} /></td>
                      <td className="num"><input className="se" type="number" min="0" step="any" aria-label={`${L("doc.rate")} ${i + 1}`} value={it.rate} onChange={(e) => updItem(i, "rate", e.target.value)} /></td>
                      <td className="col-tax" style={{ textAlign: "center" }}><input type="checkbox" checked={it.tax} onChange={(e) => updItem(i, "tax", e.target.checked)} title={L("doc.tax")} aria-label={`${L("doc.tax")} ${i + 1}`} /></td>
                      <td className="amount-cell">{fmt(roundMoney((it.qty || 0) * (it.rate || 0), dec))}</td>
                      <td className="col-act"><button className="del-row" onClick={() => delItem(i)} title={E.remove}>×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="add-rows print-hide">
                <button className="add-row" onClick={hasDates ? addTimeRow : addItem}>{hasDates ? E.addTimeEntry : E.addLineItem}</button>
                <button className="add-row" onClick={addSection}>{E.addSection}{hasSections ? "" : E.laborMaterialsHint}</button>
                {hasDates
                  ? <button className="add-row" onClick={() => toggleTimesheet(false)}>{E.removeTimesheet}</button>
                  : <button className="add-row" onClick={() => toggleTimesheet(true)}>{E.addTimesheet}</button>}
              </div>

              <div className="totals">
                <table>
                  <tbody>
                    {hasDates && totalHours > 0 ? <tr className="hours-row"><td>{L("doc.totalHours")}</td><td className="num">{Number(totalHours.toFixed(2))}</td></tr> : null}
                    <tr><td>{L("doc.subtotal")}</td><td className="num">{fmt(totals.subtotal)}</td></tr>
                    {totals.discAmt ? <tr><td>{L("doc.discount")}{adj.discType === "pct" ? ` (${adj.discVal}%)` : ""}</td><td className="num">−{fmt(totals.discAmt)}</td></tr> : null}
                    {Number(adj.taxRate) ? <tr><td>{TAXL} ({adj.taxRate}%)</td><td className="num">{fmt(totals.taxAmt)}</td></tr> : null}
                    {totals.ship ? <tr><td>{E.shippingFees}</td><td className="num">{fmt(totals.ship)}</td></tr> : null}
                    <tr className="grand"><td>{ty.total}</td><td className="num">{fmt(totals.total)}</td></tr>
                    {type !== "receipt" && totals.depositAmt > 0 ? (
                      <tr className="due dep"><td>{L("doc.depositDue")}{adj.depositType === "pct" ? ` (${adj.depositVal}%)` : ""}</td><td className="num">{fmt(totals.depositAmt)}</td></tr>
                    ) : null}
                    {type === "invoice" && Number(adj.paid) ? (<>
                      <tr><td>{L("doc.amountPaid")}</td><td className="num">−{fmt(roundMoney(adj.paid, dec))}</td></tr>
                      <tr className="due"><td>{L("doc.balanceDue")}</td><td className="num">{fmt(totals.due)}</td></tr>
                    </>) : null}
                    {type === "receipt" ? (<>
                      <tr><td>{L("doc.amountPaid")}</td><td className="num">−{fmt(roundMoney(adj.paid, dec))}</td></tr>
                      <tr className="due"><td>{Math.abs(totals.due) < 0.005 ? L("doc.paidInFull") : L("doc.balanceDue")}</td><td className="num">{fmt(totals.due)}</td></tr>
                    </>) : null}
                  </tbody>
                </table>
                {/* Only surfaced when the legacy arithmetic actually changes the
                    figures — i.e. this document has both a discount and a tax
                    rate, which is the case where tax was charged on the
                    undiscounted base. print-hide keeps it off the PDF: it is a
                    note to the person editing, not part of the document. */}
                {taxMode === "gross" && totals.discAmt > 0 && Number(adj.taxRate) ? (
                  <div className="taxmode-note print-hide">
                    <span>Tax here was charged on the pre-discount amount, as it was when this {ty.word.toLowerCase()} was sent. Newer documents tax the discounted amount.</span>
                    <button type="button" className="add-row" onClick={() => { setTaxMode("net"); flash("Recalculated — the total has changed"); }}>Recalculate</button>
                  </div>
                ) : null}
              </div>

              <div className="inv-foot">
                {isCrypto(currency) && (
                  <div className="crypto-pay">
                    <div className="cp-fields">
                      <span className="tag">Pay in {currency} · {CRYPTO[currency].name}</span>
                      <div className="cp-row">
                        <span className="cp-lb">Network</span>
                        <select className="se cp-sel print-hide" value={f.cryptoNet || ""} onChange={(e) => setField("cryptoNet", e.target.value)}>
                          <option value="">Select network…</option>
                          {CRYPTO[currency].networks.map((net) => <option key={net} value={net}>{net}</option>)}
                        </select>
                        <span className="se cp-netval print-only">{f.cryptoNet || "—"}</span>
                      </div>
                      <div className="cp-row">
                        <span className="cp-lb">Address</span>
                        <input className="se cp-addr" value={f.cryptoAddr || ""} onChange={(e) => setField("cryptoAddr", e.target.value)} placeholder={`Your ${currency} wallet address`} spellCheck={false} />
                      </div>
                      <div className="cp-row">
                        <span className="cp-lb">Memo/Tag</span>
                        <input className="se cp-tag" value={f.cryptoTag || ""} onChange={(e) => setField("cryptoTag", e.target.value)} placeholder="Optional — only if your exchange requires it" spellCheck={false} />
                      </div>
                      {!f.cryptoWarnOff && (
                        <div className="cp-warn">
                          <span>Send only {currency}{f.cryptoNet ? ` on the ${f.cryptoNet.split(" · ")[0]} network` : ""} to this address — a different asset or network can lose the funds.</span>
                          <button type="button" className="cp-warn-x print-hide" title="Hide this note" onClick={() => setField("cryptoWarnOff", true)}>×</button>
                        </div>
                      )}
                    </div>
                    <div className="cp-qr">
                      {f.cryptoAddr
                        ? <div className="cp-qr-img" dangerouslySetInnerHTML={{ __html: qrSvg(f.cryptoAddr, { size: 118 }) }} />
                        : <div className="cp-qr-ph">QR appears once you add an address</div>}
                      <span className="cp-qr-cap">Scan to pay</span>
                    </div>
                  </div>
                )}
                {/* Milestone payment schedule — deposit / progress / final. Lives on
                    the sheet so it prints; the whole block disappears when empty. */}
                {schedule.length > 0 && (
                  <div className="pay-sched">
                    <span className="tag">{L("doc.schedule")}</span>
                    <table className="ps-table"><tbody>
                      {schedule.map((row, i) => (
                        <tr key={i}>
                          <td className="ps-label">
                            <input className="se print-hide" value={row.label} onChange={(e) => updSchedule(i, "label", e.target.value)} placeholder={E.milestonePh} />
                            <span className="se-print print-only">{row.label}</span>
                          </td>
                          <td className="ps-due">
                            <input className="se print-hide" type="date" value={row.due} onChange={(e) => updSchedule(i, "due", e.target.value)} />
                            <span className="se-print print-only">{fmtDMY(row.due)}</span>
                          </td>
                          <td className="ps-amt num">
                            <input className="se print-hide" type="number" min="0" step="0.01" aria-label={`Payment ${i + 1} amount`} value={row.amount} onChange={(e) => updSchedule(i, "amount", e.target.value)} placeholder="0.00" />
                            <span className="se-print print-only">{fmt(Number(row.amount) || 0)}</span>
                          </td>
                          <td className="col-act"><button className="del-row print-hide" onClick={() => delSchedule(i)} title={E.remove}>×</button></td>
                        </tr>
                      ))}
                    </tbody></table>
                    <button className="add-row print-hide" onClick={addSchedule}>{E.addMilestone}</button>
                  </div>
                )}

                <div className="foot-adders print-hide">
                  {!(f.svcFrom || f.svcTo || f.svcFreq || f.svcScope) && (
                    <button className="add-row" onClick={() => setF((p) => ({ ...p, svcFrom: todayISO(-30), svcTo: todayISO(), svcFreq: "Weekly" }))}>{E.addSvcPeriod}</button>
                  )}
                  {schedule.length === 0 && <button className="add-row" onClick={addSchedule}>{E.addPaySched}</button>}
                  {photos.length < MAX_PHOTOS && (
                    <label className="add-row add-photos">
                      {photos.length ? E.addMorePhotos : E.addJobPhotos}
                      <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onPhotos} />
                    </label>
                  )}
                </div>

                <span className="tag">{L("doc.payment")}</span>
                <textarea className="se" rows={1} value={f.payNote} onChange={(e) => setField("payNote", e.target.value)} placeholder={E.payNotePh} />
                <span className="tag" style={{ marginTop: 10 }}>{L("doc.notes")}</span>
                <textarea className="se" rows={2} value={f.notes} onChange={(e) => setField("notes", e.target.value)} placeholder={E.notesPh} />

                {/* Job photos — proof of work, at the foot of the document like a
                    completed-job report. Captions print under each photo. */}
                {photos.length > 0 && (
                  <div className="photos-block">
                    <span className="tag">{L("doc.photos")}</span>
                    <div className="photos-grid">
                      {photos.map((p, i) => (
                        <figure key={i} className="ph">
                          <img src={p.src} alt={p.cap || "Job photo"} />
                          <input className="se ph-cap print-hide" value={p.cap} onChange={(e) => updPhotoCap(i, e.target.value)} placeholder={E.captionPh} />
                          {p.cap ? <figcaption className="ph-cap-print print-only">{p.cap}</figcaption> : null}
                          <button className="del-row ph-x print-hide" onClick={() => delPhoto(i)} title={E.remove}>×</button>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature lives in the document, so it exports exactly where it
                    appears on screen instead of being stamped at a fixed page
                    coordinate — which left it stranded in the bottom margin. */}
                {sig?.png ? (
                  <div className="sig-block">
                    <img className="sig-block-img" src={sig.png} alt={`Signature of ${sig.name}`} />
                    <div className="sig-block-line" />
                    <div className="sig-block-meta">
                      <span className="sig-block-name">{sig.name}</span>
                      <span className="sig-block-date">{fmtDMY((sig.at || "").slice(0, 10))}</span>
                    </div>
                    <button type="button" className="sig-block-x print-hide" title={E.remove} onClick={() => setSig(null)}>×</button>
                  </div>
                ) : null}
              </div>

              {/* Subtle footer attribution & online verification link on exported PDFs.
                  Attribution is OFF by default to match our no-branding promise; users
                  can opt in from the side panel. */}
              {(!hideBrandFoot || shareUrl) ? (
                <div className="doc-brand-foot">
                  <div className="dbf-links">
                    {shareUrl ? (
                      <>
                        <span>{E.viewOnline} <a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl.replace(/^https?:\/\//, "")}</a></span>
                        {!hideBrandFoot ? <span className="dbf-sep">·</span> : null}
                      </>
                    ) : null}
                    {!hideBrandFoot ? (
                      <a href="https://billcrafter.com" target="_blank" rel="noopener noreferrer">
                        {E.poweredBy}
                      </a>
                    ) : null}
                  </div>
                  {!hideBrandFoot ? (
                    <button
                      type="button"
                      className="dbf-toggle print-hide"
                      onClick={() => setHideBrandFoot(true)}
                    >
                      {E.remove}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {/* SIDE PANEL */}
          <aside className="side-panel">
            <div className="sp-actions">
              <button className="btn btn-solid btn-block" onClick={doExport} disabled={exportBusy}>{exportBusy ? E.exportingPdf : L("ed.downloadPdf")}</button>
              {user ? (
                <>
                  {/* Logged-in: full toolbox. PDF is the one export format — print covers paper. */}
                  <button className="btn btn-ghost btn-block" onClick={doEmail}>{E.emailInvoice}</button>
                  <button className="btn btn-ghost btn-block" onClick={doSign}>{E.signSave}</button>
                  <button className="btn btn-ghost btn-block" onClick={doShare} disabled={sharing}>{sharing ? E.creatingLink : E.shareLink}</button>
                  {shareUrl ? <div className="share-url" title={shareUrl}><a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl.replace(/^https?:\/\//, "")}</a></div> : null}
                  <button className="btn btn-ghost btn-block" onClick={doPrint}>{L("ed.print")}</button>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-block" onClick={saveInvoice}>{L("ed.save")}</button>
                    <button className="btn btn-ghost btn-block" onClick={() => openAuth(E.myInvAuth)}>{L("ed.myInvoices")}</button>
                  </div>
                </>
              ) : (
                <>
                  {/* Anonymous: PDF + Print only. Share/stamps and the rest unlock at sign-up. */}
                  <button className="btn btn-ghost btn-block" onClick={doPrint}>{L("ed.print")}</button>
                  <button className="btn btn-line btn-block" onClick={() => openAuth(E.signupBannerAuth)}>{E.signUpFreeCta}</button>
                </>
              )}
              <div className="saved">{savedMsg ? "● " + savedMsg : ""}</div>
              <div className="quota-note" data-nosnippet="">{!usageReady ? E.checkingQuota : remDisplay === Infinity ? E.freeAcctUnlimited : E.freeExportsLeft(remDisplay, ANON_DAILY_LIMIT)}</div>
            </div>

            {/* Review nudge — right under the download actions */}
            <div className="sp-review print-hide">
              <span className="sr-txt">{E.reviewPrompt(ty.word.toLowerCase())}</span>
              <ReviewCta label={E.reviewTrustpilot} variant="ghost" className="review-cta--block" />
            </div>

            {user && (
              <div className="sp-group"><div className="sp-h">{E.savedGroupTitle}</div>
                <select value="" onChange={(e) => { insertProfile(e.target.value); e.target.value = ""; }}>
                  <option value="">{savedProfiles.length ? E.insertProfile : E.noProfileYet}</option>
                  {savedProfiles.map((pr) => <option key={rid(pr)} value={rid(pr)}>{pr.name || "(unnamed)"}</option>)}
                </select>
                <select value="" style={{ marginTop: 12 }} onChange={(e) => { insertClient(e.target.value); e.target.value = ""; }}>
                  <option value="">{savedClients.length ? E.insertClient : E.noClientYet}</option>
                  {savedClients.map((c) => <option key={rid(c)} value={rid(c)}>{c.name || "(unnamed)"}</option>)}
                </select>
                <select value="" style={{ marginTop: 12 }} onChange={(e) => { insertItem(e.target.value); e.target.value = ""; }}>
                  <option value="">{savedItems.length ? E.addSavedItem : E.noItemYet}</option>
                  {savedItems.map((it) => <option key={rid(it)} value={rid(it)}>{it.name || "(unnamed)"}{it.rate ? ` — ${money(Number(it.rate) || 0, currency, INTL)}` : ""}</option>)}
                </select>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 7 }}>{E.manageDashboardPrefix}<Link href="/invoicemanager" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>{E.manageDashboardLink}</Link>.</div>
              </div>
            )}

            <div className="sp-group"><div className="sp-h">{E.docTypeLabel}</div>
              <div className="sp-presets">
                {Object.keys(TYPES).map((k) => (
                  <button key={k} className={"chip" + (type === k ? " active" : "")} onClick={() => changeType(k)}>{docType(locale, k).word}</button>
                ))}
              </div>
              <button className="btn btn-ghost btn-block" style={{ marginTop: 8, opacity: ty.next ? 1 : 0.5 }} onClick={convertNext}>
                {ty.next ? E.convertLabels[ty.next] : E.convertLabels.final}
              </button>
            </div>

            <div className="sp-group"><div className="sp-h">{E.templatesLabel}</div>
              <div className="sp-presets">
                {TEMPLATES.map(([k, label]) => (
                  <button key={k} className={"chip" + (activeScenario === k ? " active" : "")} onClick={() => applyTemplate(k)}>{label}</button>
                ))}
              </div>
            </div>

            <div className="sp-group"><div className="sp-h">{E.tplStyleLabel}</div>
              <select value={tpl} onChange={(e) => setTpl(e.target.value)}>
                {STYLES.map((st) => (<option key={st} value={st}>{E.styles[st] || (st[0].toUpperCase() + st.slice(1))}</option>))}
              </select>
            </div>

            {(user || type === "receipt") && (
            <div className="sp-group">
              <div className="sp-h">{E.stampLabel}</div>
              <div className="tpl-select" style={{ flexWrap: "wrap", gap: 6 }}>
                <button className={"tpl-btn" + (stamp === "" ? " active" : "")} onClick={() => setStamp("")}>{E.none}</button>
                {STAMP_KEYS.map((k) => (
                  <button key={k} className={"tpl-btn" + (stamp === k ? " active" : "")}
                    onClick={() => {
                      if (!user && !(type === "receipt" && k === "paid")) { openAuth(E.stampAuth); return; }
                      setStamp(k);
                    }}>{stampLabel(locale, k)}</button>
                ))}
              </div>
            </div>
            )}
            <div className="sp-group"><div className="sp-h">{E.accentLabel}</div>
              <div className="swatches">
                {ACCENTS.map((c) => (
                  <div key={c} className={"sw" + (accent === c ? " active" : "")} style={{ background: c }} onClick={() => setAccent(c)} />
                ))}
              </div>
            </div>

            <div className="sp-group" data-nosnippet=""><div className="sp-h">{E.currencyLabel}</div>
              <select aria-label={E.currencyLabel} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {Object.keys(CURRENCIES).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="sp-group"><div className="sp-h">{E.taxAdjLabel} <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--faint)" }}>{E.optionalTag}</span></div>
              <div className="sp-row"><label>{E.taxPct}</label><input className="sp-input" aria-label={E.taxPct} type="number" min="0" step="0.01" value={adj.taxRate} onChange={(e) => setAdj((p) => ({ ...p, taxRate: e.target.value }))} /></div>
              {taxPresets.length > 0 && (
                <div className="sp-tax-presets" data-nosnippet="">
                  <span className="sp-tax-lbl">{TAXL}</span>
                  {taxPresets.map((rate) => {
                    const active = Number(adj.taxRate) === rate;
                    return (
                      <button
                        key={rate}
                        type="button"
                        className={"chip chip-sm" + (active ? " active" : "")}
                        aria-pressed={active}
                        onClick={() => setAdj((p) => ({ ...p, taxRate: active ? 0 : rate }))}
                      >
                        {rate}%
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="sp-row"><label>{E.discount}</label>
                <input className="sp-input" aria-label={E.discount} type="number" min="0" step="0.01" value={adj.discVal} onChange={(e) => setAdj((p) => ({ ...p, discVal: e.target.value }))} />
                <select style={{ width: 78 }} value={adj.discType} onChange={(e) => setAdj((p) => ({ ...p, discType: e.target.value }))}><option value="pct">%</option><option value="flat">{E.flat}</option></select>
              </div>
              <div className="sp-row"><label>{E.shipping}</label><input className="sp-input" aria-label={E.shipping} type="number" min="0" step="0.01" value={adj.shipping} onChange={(e) => setAdj((p) => ({ ...p, shipping: e.target.value }))} /></div>
              <div className="sp-row"><label>{E.deposit}</label>
                <input className="sp-input" aria-label={E.deposit} type="number" min="0" step="0.01" value={adj.depositVal} onChange={(e) => setAdj((p) => ({ ...p, depositVal: e.target.value }))} />
                <select style={{ width: 78 }} value={adj.depositType} onChange={(e) => setAdj((p) => ({ ...p, depositType: e.target.value }))}><option value="pct">%</option><option value="flat">{E.flat}</option></select>
              </div>
              <div className="sp-row"><label>{E.paid}</label><input className="sp-input" aria-label={E.paid} type="number" min="0" step="0.01" value={adj.paid} onChange={(e) => setAdj((p) => ({ ...p, paid: e.target.value }))} /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>
                <input type="checkbox" checked={!hideBrandFoot} onChange={(e) => setHideBrandFoot(!e.target.checked)} />
                <span>{E.addBrandFoot}</span>
              </label>
            </div>
          </aside>
        </div>
      </div>

      {/* AUTH / EMAIL / THANKS / HISTORY MODALS (mounted only when open) */}
      {(authOpen || drawerOpen || emailOpen || thanksOpen) ? (
        <div className="overlay show" onClick={() => { setAuthOpen(false); setDrawerOpen(false); setEmailOpen(false); setThanksOpen(false); }} />
      ) : null}

      {/* EMAIL MODAL */}
      {emailOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={E.modalEmailTitle(ty.word.toLowerCase())}>
          <button type="button" className="x" onClick={() => setEmailOpen(false)} aria-label="Close">×</button>
          <div className="modal-title">{E.modalEmailTitle(ty.word.toLowerCase())}</div>
          <p className="sub">{E.modalEmailSub(user?.email)}</p>
          <label style={{ fontSize: 12, color: "var(--muted)" }}>{E.to}</label>
          <input className="sp-input" type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="client@email.com" style={{ margin: "4px 0 10px" }} />
          <label style={{ fontSize: 12, color: "var(--muted)" }}>{E.subject}</label>
          <input className="sp-input" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} style={{ margin: "4px 0 10px" }} />
          <label style={{ fontSize: 12, color: "var(--muted)" }}>{E.message}</label>
          <textarea className="sp-input" value={emailMsg} onChange={(e) => setEmailMsg(e.target.value)} style={{ minHeight: 90, resize: "vertical", margin: "4px 0 12px" }} />
          <button type="button" className="btn btn-solid btn-block" onClick={sendEmail} disabled={sending} style={{ padding: 11 }}>{sending ? E.sending : E.sendInvoice}</button>
        </div>
      ) : null}

      {authOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={authTitle || E.authDefaultTitle(ty.word.toLowerCase())}>
          <button type="button" className="x" onClick={() => setAuthOpen(false)} aria-label="Close">×</button>
          <div className="modal-title">{authTitle || E.authDefaultTitle(ty.word.toLowerCase())}</div>
          <p className="sub">{E.authSub}</p>
          {E.authBenefits.map((b) => (
            <div className="benefit" key={b}>✓ <span>{b}</span></div>
          ))}
          <div style={{ height: 14 }} />
          <input className="sp-input" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="you@email.com" />
          <input className="sp-input" type="password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} placeholder={E.passwordPh} style={{ marginTop: 8 }} onKeyDown={(e) => { if (e.key === "Enter") signInPassword(); }} />
          <button type="button" className="btn btn-solid" onClick={signInPassword} disabled={authBusy}>{authBusy ? E.pleaseWait : E.logInCreate}</button>
          <div className="or">{E.or}</div>
          <button type="button" className="btn btn-line" onClick={sendMagic} disabled={authBusy}>{E.magicLink}</button>
          <p className="fineprint">{E.newHere}</p>
          <p className="fineprint" style={{ marginTop: 10 }}>
            {E.preferFullPage} <Link href="/login" style={{ color: "var(--ink)" }}>{L("nav.login")}</Link> / <Link href="/signup" style={{ color: "var(--ink)" }}>{L("nav.signup")}</Link>
          </p>
        </div>
      ) : null}

      {/* DOWNLOAD-COMPLETE / REVIEW MODAL */}
      {thanksOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={E.thanksTitle(ty.word.toLowerCase())}>
          <button type="button" className="x" onClick={() => setThanksOpen(false)} aria-label="Close">×</button>
          <div className="thanks-emoji">✅</div>
          <div className="modal-title">{E.thanksTitle(ty.word.toLowerCase())}</div>
          <p className="sub">{E.thanksSub(fileBase())}</p>
          <div className="benefit">✓ <span>{E.thanksBenefit}</span></div>
          <div className="thanks-review">
            <ReviewCta label={E.leaveReview} variant="solid" className="review-cta--block" />
          </div>
          <button type="button" className="link-text" style={{ marginTop: 12 }} onClick={() => setThanksOpen(false)}>{E.maybeLater}</button>
        </div>
      ) : null}

      {/* E-SIGNATURE (registered users) */}
      {signOpen ? (
        <SignatureModal
          open={signOpen}
          onClose={() => setSignOpen(false)}
          defaultName={f.fromName}
          // "Bill to" is a free-text block, so pull the first address out of it as a
          // convenience prefill — the signer can always correct it.
          defaultRecipient={(String(f.toDetails || "").match(/[^\s<>,;]+@[^\s<>,;]+\.[^\s<>,;]{2,}/) || [""])[0]}
          docType={ty.word}
          locale={locale}
          onSubmit={applySignature}
          onSigned={(d) => {
            if (d?.emailed?.ok) flash(`${E.emailSubmitted} (${d.emailed.to})`);
            else if (d?.emailed && !d.emailed.ok) {
              const msg = d.emailed.error === "daily_limit_exceeded"
                ? E.emailDailyCap
                : d.emailed.error === "rate_limited"
                  ? E.emailRateCap
                  : E.emailSendFailed;
              alert(msg);
            }
            else flash(E.signSave);
          }}
        />
      ) : null}

      {/* HISTORY DRAWER */}
      {drawerOpen ? (
        <div className="drawer show" role="dialog" aria-modal="true" aria-label={L("ed.myInvoices")}>
          <button type="button" className="x" onClick={() => setDrawerOpen(false)} aria-label="Close">×</button>
          <div className="modal-title">{L("ed.myInvoices")}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginBottom: 8 }}>
            {user ? <>{E.signedInAs} <strong>{user.email}</strong> · {E.freeAccount} · <button type="button" className="link-text" onClick={signOut}>{E.signOut}</button></> : E.notSignedIn}
          </div>
          <div>
            {history.length === 0 ? (
              <div className="empty">{E.noSavedInvoices}<br />{E.clickSaveHint}</div>
            ) : history.map((x) => (
              <div className="hist-item" key={x.id}>
                <div className="top">
                  <span className="no">{x.invNo} {x.id === idRef.current ? <span className="badge">{E.current}</span> : null}</span>
                  <span className="amt">{money(x.total, x.currency, INTL)}</span>
                </div>
                <div className="cli">{x.client} · {x.date}</div>
                <div className="acts">
                  <button type="button" className="btn btn-ghost" onClick={() => openInvoice(x.id)}>{E.open}</button>
                  <button type="button" className="btn btn-solid" onClick={() => duplicateInvoice(x.id)}>{E.duplicate}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
