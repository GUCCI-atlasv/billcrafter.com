"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES, money, roundMoney, currencyDecimals } from "@/lib/invoice";
import { intlTag, localePath, DEFAULT_LOCALE, TIER1_OCR_LOCALES, primaryLocaleOf } from "@/lib/i18n";
import { ocrUi } from "@/lib/ocrUiI18n";
import { getUser as readUser, setUser as persistUser } from "@/lib/auth";
import { EXPENSE_CATEGORIES, verifyOcrMath, ocrToEditorSnapshot } from "@/lib/ocrSchema";
import { prepareOcrFile, downloadOcrCsv, downloadOcrXlsx } from "@/lib/ocrClient";
import { OCR_SAMPLES, OCR_DISCREPANCY_DEMO, loadSampleDocument } from "@/lib/ocrSamples";
import { QUOTA_POLICY } from "@/lib/quotaConfig";
import { trackEvent } from "@/lib/analytics";

export default function OcrWorkbench({
  locale = "en",
  mode = "full", // "full" | "embedded"
  defaultCsvPreset = "itemized", // "itemized" | "ledger" | "accounting"
}) {
  const C = ocrUi(locale);
  const INTL = intlTag(locale);
  const router = useRouter();
  const primary = primaryLocaleOf(locale);
  const ocrScannerHref =
    locale === DEFAULT_LOCALE
      ? "/invoice-ocr-scanner"
      : TIER1_OCR_LOCALES.includes(locale)
      ? `/${locale}/invoice-ocr-scanner`
      : TIER1_OCR_LOCALES.includes(primary)
      ? `/${primary}/invoice-ocr-scanner`
      : "/invoice-ocr-scanner";
  const editorHref = `${localePath(locale, "/")}?from=ocr#editor`;

  const [queue, setQueue] = useState([]); // [{ id, status: 'scanning'|'ready'|'error', fileName, errorMsg, doc, rawFile }]
  const [activeId, setActiveId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [csvPreset, setCsvPreset] = useState(defaultCsvPreset);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [editorMenuOpen, setEditorMenuOpen] = useState(false);
  const [attachPhotosOnBill, setAttachPhotosOnBill] = useState(true);
  const [toast, setToast] = useState("");

  // Quota & zero-data-loss auth modal state
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState({ plan: "anon", used: 0, limit: QUOTA_POLICY.ocrGuestDaily, remaining: QUOTA_POLICY.ocrGuestDaily });
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authPrompt, setAuthPrompt] = useState("");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const pendingFilesRef = useRef([]);
  const lastFocusRef = useRef(null);
  const prevAuthOpenRef = useRef(false);

  useEffect(() => {
    if (authOpen && !prevAuthOpenRef.current && typeof document !== "undefined") {
      lastFocusRef.current = document.activeElement;
    } else if (!authOpen && prevAuthOpenRef.current) {
      try { lastFocusRef.current?.focus?.(); } catch {}
    }
    prevAuthOpenRef.current = authOpen;
  }, [authOpen]);

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setAuthOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(window.__bcOcrToast);
    window.__bcOcrToast = setTimeout(() => setToast(""), 2600);
  };

  const refreshQuota = async () => {
    try {
      const r = await fetch("/api/ocr");
      if (!r.ok) return;
      const d = await r.json();
      if (d?.ok) {
        setQuota({
          plan: d.plan || "anon",
          used: d.used ?? 0,
          limit: d.limit ?? QUOTA_POLICY.ocrGuestDaily,
          remaining: d.remaining ?? QUOTA_POLICY.ocrGuestDaily,
        });
      }
    } catch {
      // ignore offline
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    const localU = readUser();
    if (localU) setUser(localU);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.user) {
          setUser(d.user);
          persistUser(d.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        refreshQuota();
      });
  }, []);

  // Global clipboard screenshot paste (⌘V / Ctrl+V) when not typing in an input
  useEffect(() => {
    const onPaste = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;
      const items = Array.from(e.clipboardData?.items || []);
      const imgItem = items.find((it) => it.type && it.type.startsWith("image/"));
      if (!imgItem) return;
      const blob = imgItem.getAsFile();
      if (!blob) return;
      e.preventDefault();
      const stamp = new Date().toTimeString().slice(0, 8).replace(/:/g, "");
      const namedFile = new File([blob], `pasted-bill-${stamp}.png`, { type: blob.type || "image/png" });
      handleIncomingFiles([namedFile], "paste");
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, quota]);

  const readyItems = useMemo(() => queue.filter((q) => q.status === "ready" && q.doc), [queue]);
  const readyDocs = useMemo(() => readyItems.map((q) => q.doc), [readyItems]);
  const activeEntry = useMemo(
    () => queue.find((q) => q.id === activeId) || queue[0] || null,
    [queue, activeId]
  );
  const activeDoc = activeEntry?.doc || null;
  const mathStatus = useMemo(() => (activeDoc ? verifyOcrMath(activeDoc) : null), [activeDoc]);

  const fmtCurr = (n, curr = activeDoc?.currency || "USD") => money(n, curr, INTL);

  async function scanSingleEntry(entryId, file, sourceTag = "upload") {
    try {
      const prep = await prepareOcrFile(file);
      // Immediately attach preview so user sees their receipt under the laser beam
      setQueue((prev) =>
        prev.map((item) =>
          item.id === entryId
            ? {
                ...item,
                previewUrl: prep.fullPreviewUrl || prep.previewDataUrl,
                thumbUrl: prep.previewDataUrl,
                isPdf: prep.isPdf,
              }
            : item
        )
      );

      trackEvent("ocr_scan_start", {
        file_type: prep.isPdf ? "pdf" : sourceTag === "paste" ? "paste" : "image",
        signed_in: Boolean(user),
      });

      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: prep.fileName,
          mimeType: prep.mimeType,
          dataBase64: prep.dataBase64,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 402 || data?.error === "quota") {
        setQueue((prev) => prev.filter((item) => item.id !== entryId));
        if (data?.quota) setQuota(data.quota);
        else setQuota((q) => ({ ...q, remaining: 0 }));
        trackEvent("ocr_quota_gate", {});
        if (user) {
          showToast(C.memberQuotaGateMsg);
        } else {
          pendingFilesRef.current = [...pendingFilesRef.current, file];
          setAuthPrompt(C.quotaGateMsg);
          setAuthOpen(true);
        }
        return;
      }

      if (!res.ok || !data?.ok || !data?.document) {
        trackEvent("ocr_scan_failed", { reason: data?.error || `http_${res.status}` });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === entryId
              ? {
                  ...item,
                  status: "error",
                  errorMsg: data?.message || C.scanFailedMsg,
                }
              : item
          )
        );
        if (data?.quota) setQuota(data.quota);
        return;
      }

      const enrichedDoc = {
        ...data.document,
        previewDataUrl: prep.previewDataUrl,
        fullPreviewUrl: prep.fullPreviewUrl || prep.previewDataUrl,
        isPdf: prep.isPdf,
      };
      const mCheck = verifyOcrMath(enrichedDoc);

      if (data.quota) setQuota(data.quota);
      trackEvent("ocr_scan_success", {
        doc_type: enrichedDoc.docType,
        line_count: enrichedDoc.lineItems?.length || 0,
        math_verified: mCheck.verified,
        latency_ms: data.latencyMs || 0,
      });

      setQueue((prev) =>
        prev.map((item) =>
          item.id === entryId
            ? {
                ...item,
                status: "ready",
                doc: enrichedDoc,
                latencyMs: data.latencyMs,
              }
            : item
        )
      );
    } catch (err) {
      trackEvent("ocr_scan_failed", { reason: err?.code || "client_error" });
      setQueue((prev) =>
        prev.map((item) =>
          item.id === entryId
            ? {
                ...item,
                status: "error",
                errorMsg: err?.message || "Failed to read file.",
              }
            : item
        )
      );
    }
  }

  async function handleIncomingFiles(fileList, sourceTag = "upload") {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) return;
    const maxBatch = user ? QUOTA_POLICY.ocrMemberBatchMax : QUOTA_POLICY.ocrGuestBatchMax;
    const sliced = files.slice(0, maxBatch);
    if (files.length > maxBatch) {
      showToast(user ? C.batchMemberCap(maxBatch) : C.batchGuestCap(maxBatch));
    }

    // Check early if anonymous quota is already 0 before uploading bytes
    if (!quotaLoading && !user && quota.remaining <= 0) {
      pendingFilesRef.current = sliced;
      trackEvent("ocr_quota_gate", {});
      setAuthPrompt(C.quotaGateMsg);
      setAuthOpen(true);
      return;
    }

    if (!quotaLoading && user && quota.remaining <= 0) {
      showToast(C.memberQuotaGateMsg);
      return;
    }

    const newEntries = sliced.map((file, idx) => ({
      id: `ocr_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      status: "scanning",
      fileName: file.name || `bill-${idx + 1}`,
      rawFile: file,
      previewUrl: "",
      isPdf: /\.pdf$/i.test(file.name || "") || file.type === "application/pdf",
      doc: null,
      errorMsg: "",
    }));

    setZoom(1);
    setRotation(0);
    setQueue((prev) => [...prev, ...newEntries]);
    setActiveId(newEntries[0].id);

    // Process sequentially so rate-limits and quota stay orderly
    for (const entry of newEntries) {
      await scanSingleEntry(entry.id, entry.rawFile, sourceTag);
    }
  }

  function handleTrySample(sampleId) {
    const { sample, document } = loadSampleDocument(sampleId);
    const id = `sample_${sample.id}_${Date.now()}`;
    setZoom(1);
    setRotation(0);
    trackEvent("ocr_sample_try", { sample_id: sample.id });

    setQueue((prev) => [
      ...prev.filter((x) => !x.id.startsWith(`sample_${sample.id}`)),
      {
        id,
        status: "ready",
        fileName: sample.fileName,
        previewUrl: sample.previewUrl,
        isPdf: false,
        isSample: true,
        doc: document,
        latencyMs: null,
      },
    ]);
    setActiveId(id);
  }

  function retryEntry(entry) {
    if (!entry?.rawFile) return;
    setQueue((prev) =>
      prev.map((it) => (it.id === entry.id ? { ...it, status: "scanning", errorMsg: "" } : it))
    );
    scanSingleEntry(entry.id, entry.rawFile, "retry");
  }

  function removeEntry(id) {
    setQueue((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (activeId === id) setActiveId(next[0]?.id || null);
      return next;
    });
  }

  // ---- Editing helpers on activeDoc ----
  function updateDoc(patch) {
    if (!activeEntry) return;
    setQueue((prev) =>
      prev.map((item) =>
        item.id === activeEntry.id && item.doc
          ? { ...item, doc: { ...item.doc, ...(typeof patch === "function" ? patch(item.doc) : patch) } }
          : item
      )
    );
  }

  function updateLine(lineIdx, field, val) {
    updateDoc((doc) => {
      const dec = currencyDecimals(doc.currency || "USD");
      const nextLines = doc.lineItems.map((ln, i) => {
        if (i !== lineIdx) return ln;
        const updated = { ...ln, [field]: val };
        if (field === "qty" || field === "rate") {
          const q = Number(field === "qty" ? val : updated.qty) || 0;
          const r = Number(field === "rate" ? val : updated.rate) || 0;
          updated.amount = roundMoney(q * r, dec);
        }
        return updated;
      });
      const newSub = roundMoney(
        nextLines.reduce((acc, l) => acc + (Number(l.amount) || 0), 0),
        dec
      );
      return { ...doc, lineItems: nextLines, subtotal: newSub };
    });
  }

  function addLineItem() {
    updateDoc((doc) => ({
      ...doc,
      lineItems: [
        ...(doc.lineItems || []),
        {
          id: `ln_${Date.now()}`,
          date: "",
          category: "Other",
          desc: "",
          detail: "",
          qty: 1,
          rate: 0,
          amount: 0,
          taxable: true,
        },
      ],
    }));
  }

  function deleteLineItem(idx) {
    updateDoc((doc) => {
      const dec = currencyDecimals(doc.currency || "USD");
      const nextLines = doc.lineItems.filter((_, i) => i !== idx);
      const safeLines = nextLines.length
        ? nextLines
        : [{ id: "ln_empty", date: "", category: "Other", desc: "", detail: "", qty: 1, rate: 0, amount: 0, taxable: true }];
      const newSub = roundMoney(
        safeLines.reduce((acc, l) => acc + (Number(l.amount) || 0), 0),
        dec
      );
      return { ...doc, lineItems: safeLines, subtotal: newSub };
    });
  }

  function applyMathFix(fixMode) {
    if (!activeDoc || !mathStatus) return;
    const dec = currencyDecimals(activeDoc.currency || "USD");
    if (fixMode === "match_total") {
      updateDoc({ total: mathStatus.computedTotal });
      showToast("Updated document total to match line items + tax.");
    } else if (fixMode === "add_adjustment") {
      const diff = roundMoney(mathStatus.diff, dec);
      updateDoc((doc) => ({
        ...doc,
        lineItems: [
          ...(doc.lineItems || []),
          {
            id: `ln_adj_${Date.now()}`,
            date: "",
            category: "Other",
            desc: diff > 0 ? "Unitemized fee / adjustment" : "Adjustment / credit",
            detail: "Added to reconcile total",
            qty: 1,
            rate: diff,
            amount: diff,
            taxable: false,
          },
        ],
        subtotal: roundMoney((Number(doc.subtotal) || 0) + diff, dec),
      }));
      showToast("Added reconciliation line.");
    }
  }

  // ---- Exports & Handoff to InvoiceEditor ----
  function handleExportCsv(presetOverride) {
    if (!readyDocs.length) return;
    const chosen = presetOverride || csvPreset;
    const fname = downloadOcrCsv(readyDocs, chosen);
    trackEvent("export_csv", { preset: chosen, file_count: readyDocs.length });
    showToast(`Downloaded ${fname}`);
  }

  function handleExportXlsx() {
    if (!readyDocs.length) return;
    const fname = downloadOcrXlsx(readyDocs);
    trackEvent("export_xlsx", { file_count: readyDocs.length });
    showToast(`Downloaded ${fname} (Summary + Line Items)`);
  }

  function handleSendToEditor(handoffMode = "recreate") {
    const sourceDocs = handoffMode === "bill_expenses" ? readyDocs : [activeDoc].filter(Boolean);
    if (!sourceDocs.length) return;
    const snap = ocrToEditorSnapshot(sourceDocs, {
      mode: handoffMode,
      attachPhotos: attachPhotosOnBill,
    });
    if (!snap) return;
    try {
      sessionStorage.setItem(
        "bc_ocr_handoff",
        JSON.stringify({
          snapshot: snap,
          mode: handoffMode,
          count: sourceDocs.length,
          at: Date.now(),
        })
      );
    } catch {
      // ignore storage quota
    }
    trackEvent("ocr_to_editor", { handoff_mode: handoffMode, file_count: sourceDocs.length });
    setEditorMenuOpen(false);
    router.push(editorHref);
  }

  // ---- In-place Auth for zero-loss resume ----
  async function handleSignIn() {
    const email = authEmail.trim().toLowerCase();
    if (!/.+@.+\..+/.test(email)) {
      alert(C.invalidEmailMsg);
      return;
    }
    if (!authPass || authPass.length < 6) {
      alert(C.shortPassMsg);
      return;
    }
    setAuthBusy(true);
    try {
      let isNewAccount = false;
      let r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: authPass }),
      });
      if (r.status === 401) {
        r = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password: authPass }),
        });
        isNewAccount = true;
        if (r.status === 409) {
          alert(C.wrongPassMsg);
          setAuthBusy(false);
          return;
        }
      }
      if (r.ok) {
        const d = await r.json().catch(() => ({}));
        const u = d.user || { email, plan: "free" };
        persistUser(u);
        setUser(u);
        setAuthOpen(false);
        setAuthPass("");
        if (isNewAccount) trackEvent("sign_up", { method: "password", trigger_source: "ocr_quota" });
        await refreshQuota();
        showToast(C.signedInToast);

        // Resume any queued files automatically without losing prior work!
        if (pendingFilesRef.current.length > 0) {
          const resumeFiles = [...pendingFilesRef.current];
          pendingFilesRef.current = [];
          setTimeout(() => handleIncomingFiles(resumeFiles, "resumed"), 80);
        }
      } else {
        alert(C.signInErrorMsg);
      }
    } catch {
      alert(C.networkErrorMsg);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleMagicLink() {
    const email = authEmail.trim().toLowerCase();
    if (!/.+@.+\..+/.test(email)) {
      alert(C.invalidEmailMsg);
      return;
    }
    setAuthBusy(true);
    try {
      const r = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.sent) {
        alert(C.magicSentMsg);
        setAuthOpen(false);
      } else if (r.ok && d.devLink) {
        window.location.href = d.devLink;
      } else {
        alert(C.magicErrorMsg);
      }
    } catch {
      alert(C.magicErrorMsg);
    } finally {
      setAuthBusy(false);
    }
  }

  const isEmbedded = mode === "embedded";

  return (
    <div className={`ocr-shell${isEmbedded ? " ocr-shell--embedded" : ""}`}>
      {/* Hidden file inputs: standard multi-file picker + mobile rear-camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          handleIncomingFiles(e.target.files, "browse");
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          handleIncomingFiles(e.target.files, "camera");
          e.target.value = "";
        }}
      />

      {/* Top quota & batch status bar */}
      <div className="ocr-topbar" data-nosnippet="">
        <div className="ocr-quota-pill">
          <span className="ocr-dot" aria-hidden="true" />
          <span>{quotaLoading ? C.quotaLoading : C.freeQuota(quota.remaining, quota.limit, quota.plan === "member" || !!user)}</span>
          {!quotaLoading && !user && (
            <button
              type="button"
              className="ocr-inline-link"
              onClick={() => {
                setAuthPrompt(C.unlockPrompt);
                setAuthOpen(true);
              }}
            >
              {C.unlockBtn}
            </button>
          )}
        </div>
        {queue.length > 0 && (
          <div className="ocr-top-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()}>
              {C.addMore}
            </button>
            <button
              type="button"
              className="link-text"
              onClick={() => {
                setQueue([]);
                setActiveId(null);
              }}
            >
              {C.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* STATE 1: Empty Dropzone (shown when queue is empty) */}
      {queue.length === 0 ? (
        <div
          className={`ocr-dropzone${dragOver ? " is-dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleIncomingFiles(e.dataTransfer?.files, "drop");
          }}
        >
          <div className="ocr-drop-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <div className="ocr-drop-title">{C.dropTitle}</div>
          <p className="ocr-drop-sub">{C.dropSub}</p>

          <div className="ocr-drop-btns">
            <button type="button" className="btn btn-accent ocr-camera-btn" onClick={() => cameraInputRef.current?.click()}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 7, verticalAlign: "-3px" }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              {C.cameraBtn}
            </button>
            <button type="button" className="btn btn-solid" onClick={() => fileInputRef.current?.click()}>
              {C.browseBtn}
            </button>
          </div>

          <div className="ocr-samples-row">
            <span className="ocr-samples-lead">{C.sampleLead}</span>
            <div className="ocr-samples-chips">
              {[...OCR_SAMPLES, OCR_DISCREPANCY_DEMO].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="ocr-sample-chip"
                  onClick={() => handleTrySample(s.id)}
                >
                  <span className="ocr-sample-dot" aria-hidden="true" />
                  <span>{C.sampleLabels?.[s.id] || s.chipLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="ocr-privacy-foot">
            {C.privacyNote}{" "}
            <Link href="/privacy#ocr-data" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
              {C.privacyLinkLabel}
            </Link>
          </p>
        </div>
      ) : (
        /* STATE 2: Active Split-View Workbench */
        <div
          className="ocr-workbench"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleIncomingFiles(e.dataTransfer?.files, "drop");
          }}
        >
          {/* Multi-file batch queue strip */}
          {queue.length > 1 && (
            <div className="ocr-batch-strip" role="tablist" aria-label="Scanned documents">
              {queue.map((item) => {
                const isAct = item.id === activeEntry?.id;
                const m = item.doc ? verifyOcrMath(item.doc) : null;
                return (
                  <div
                    key={item.id}
                    className={`ocr-batch-tab${isAct ? " active" : ""}`}
                    onClick={() => {
                      setActiveId(item.id);
                      setZoom(1);
                      setRotation(0);
                    }}
                  >
                    <span
                      className={`ocr-status-dot is-${
                        item.status === "scanning"
                          ? "scanning"
                          : item.status === "error"
                          ? "error"
                          : m?.verified
                          ? "ok"
                          : "warn"
                      }`}
                    />
                    <div className="ocr-batch-meta">
                      <div className="ocr-batch-name">
                        {item.doc?.vendorName || item.fileName}
                      </div>
                      <div className="ocr-batch-sub">
                        {item.status === "scanning"
                          ? C.scanningTab
                          : item.status === "error"
                          ? C.failedTab
                          : fmtCurr(item.doc?.total || 0, item.doc?.currency)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ocr-batch-x"
                      aria-label="Remove file"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(item.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Export action toolbar */}
          {readyDocs.length > 0 && (
            <div className="ocr-export-bar">
              <div className="ocr-export-left">
                <div className="ocr-csv-group">
                  <select
                    aria-label="CSV export preset"
                    className="ocr-preset-select"
                    value={csvPreset}
                    onChange={(e) => setCsvPreset(e.target.value)}
                  >
                    <option value="itemized">{C.presetItemized}</option>
                    <option value="ledger">{C.presetLedger(readyDocs.length)}</option>
                    <option value="accounting">{C.presetAccounting}</option>
                  </select>
                  <button type="button" className="btn btn-solid btn-sm" onClick={() => handleExportCsv()}>
                    ↓ {C.exportCsv}
                  </button>
                </div>
                <button type="button" className="btn btn-line btn-sm" onClick={handleExportXlsx}>
                  ↓ {C.exportXlsx}
                </button>
              </div>

              <div className="ocr-editor-dropdown-wrap">
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={() => setEditorMenuOpen((v) => !v)}
                >
                  {C.toEditor}
                </button>
                {editorMenuOpen && (
                  <div className="ocr-editor-menu">
                    <button
                      type="button"
                      className="ocr-menu-item"
                      onClick={() => handleSendToEditor("recreate")}
                    >
                      <strong>{C.recreatePdf}</strong>
                      <span>{C.recreateSub}</span>
                    </button>
                    <div className="ocr-menu-sep" />
                    <button
                      type="button"
                      className="ocr-menu-item"
                      onClick={() => handleSendToEditor("bill_expenses")}
                    >
                      <strong>
                        {C.billClient} {C.billsSuffix(readyDocs.length)}
                      </strong>
                      <span>{C.billClientSub}</span>
                    </button>
                    <label className="ocr-attach-chk">
                      <input
                        type="checkbox"
                        checked={attachPhotosOnBill}
                        onChange={(e) => setAttachPhotosOnBill(e.target.checked)}
                      />
                      <span>{C.attachPhotos}</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Split pane: Left viewer | Right structured table */}
          <div className="ocr-split">
            {/* LEFT PANE: Original Image / PDF Viewer */}
            <div className="ocr-viewer-pane">
              <div className="ocr-viewer-bar">
                <span className="ocr-file-tag" title={activeEntry?.fileName}>
                  {activeEntry?.isSample ? C.sampleFixture : activeEntry?.fileName}
                </span>
                {!activeEntry?.isPdf && (
                  <div className="ocr-zoom-btns">
                    <button type="button" onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))} title={C.zoomOut} aria-label={C.zoomOut}>
                      −
                    </button>
                    <button type="button" onClick={() => { setZoom(1); setRotation(0); }} title={C.resetView} aria-label={C.resetView}>
                      {Math.round(zoom * 100)}%
                    </button>
                    <button type="button" onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))} title={C.zoomIn} aria-label={C.zoomIn}>
                      +
                    </button>
                    <button type="button" onClick={() => setRotation((r) => (r + 90) % 360)} title={C.rotate90} aria-label={C.rotate90}>
                      ↻
                    </button>
                  </div>
                )}
              </div>

              <div className="ocr-stage">
                {activeEntry?.status === "scanning" && <div className="ocr-laser" aria-hidden="true" />}
                {activeEntry?.isPdf ? (
                  activeEntry.previewUrl ? (
                    <object
                      data={activeEntry.previewUrl}
                      type="application/pdf"
                      className="ocr-pdf-frame"
                      aria-label="Uploaded PDF preview"
                    >
                      <div className="ocr-pdf-fallback">
                        <strong>{activeEntry.fileName}</strong>
                        <span>PDF loaded in memory for extraction</span>
                      </div>
                    </object>
                  ) : (
                    <div className="ocr-pdf-fallback">
                      <strong>{activeEntry.fileName}</strong>
                      <span>Reading PDF…</span>
                    </div>
                  )
                ) : activeEntry?.previewUrl ? (
                  <img
                    src={activeEntry.previewUrl}
                    alt={`Scanned document ${activeEntry.fileName}`}
                    className="ocr-preview-img"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                ) : (
                  <div className="ocr-pdf-fallback">Preparing image…</div>
                )}
              </div>

              <div className="ocr-samples-mini">
                <span>{C.switchSample}</span>
                {[...OCR_SAMPLES, OCR_DISCREPANCY_DEMO].map((s) => (
                  <button key={s.id} type="button" onClick={() => handleTrySample(s.id)}>
                    {C.sampleLabels?.[s.id] || s.chipLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT PANE: Structured Review & Editable Table */}
            <div className="ocr-table-pane">
              {activeEntry?.status === "scanning" ? (
                <div className="ocr-state-box">
                  <div className="ocr-spinner" aria-hidden="true" />
                  <div className="ocr-state-title">{C.scanning}</div>
                  <p className="ocr-state-sub">{C.readingSub}</p>
                </div>
              ) : activeEntry?.status === "error" ? (
                <div className="ocr-state-box is-error">
                  <div className="ocr-state-title">{C.errorTitle}</div>
                  <p className="ocr-state-sub">{activeEntry.errorMsg}</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
                    {activeEntry.rawFile && (
                      <button type="button" className="btn btn-solid btn-sm" onClick={() => retryEntry(activeEntry)}>
                        {C.retryScan}
                      </button>
                    )}
                    <button type="button" className="btn btn-line btn-sm" onClick={() => fileInputRef.current?.click()}>
                      {C.tryAnother}
                    </button>
                  </div>
                </div>
              ) : activeDoc ? (
                <div className="ocr-form-stack">
                  {/* Math Sanity Check Banner */}
                  {mathStatus && (
                    <div className={`ocr-math-bar ${mathStatus.verified ? "is-ok" : "is-warn"}`} role="status">
                      {mathStatus.verified ? (
                        <span>
                          <strong>{C.mathOkTag}</strong> — {C.mathOk(
                            fmtCurr(activeDoc.total, activeDoc.currency),
                            activeEntry.latencyMs ? (activeEntry.latencyMs / 1000).toFixed(1) : null,
                            Boolean(activeEntry?.isSample)
                          )}
                        </span>
                      ) : (
                        <>
                          <span>
                            <strong>{C.mathWarnTag}</strong>{" "}
                            {C.mathWarnBody(
                              fmtCurr(mathStatus.computedTotal, activeDoc.currency),
                              fmtCurr(mathStatus.scannedTotal, activeDoc.currency),
                              fmtCurr(Math.abs(mathStatus.diff), activeDoc.currency)
                            )}
                          </span>
                          <div className="ocr-math-acts">
                            <button type="button" onClick={() => applyMathFix("match_total")}>
                              {C.setTotalTo(fmtCurr(mathStatus.computedTotal, activeDoc.currency))}
                            </button>
                            <button type="button" onClick={() => applyMathFix("add_adjustment")}>
                              {C.addDiffLine(fmtCurr(mathStatus.diff, activeDoc.currency))}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Header Metadata Grid */}
                  <div className="ocr-meta-grid">
                    <div>
                      <label className="field-label">{C.docType}</label>
                      <select
                        className="sp-input"
                        value={activeDoc.docType}
                        onChange={(e) => updateDoc({ docType: e.target.value })}
                      >
                        <option value="receipt">{C.docTypes.receipt}</option>
                        <option value="invoice">{C.docTypes.invoice}</option>
                        <option value="quote">{C.docTypes.quote}</option>
                        <option value="estimate">{C.docTypes.estimate}</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">{C.currency}</label>
                      <select
                        className="sp-input"
                        value={activeDoc.currency}
                        onChange={(e) => updateDoc({ currency: e.target.value })}
                      >
                        {Object.keys(CURRENCIES).map((c) => (
                          <option key={c} value={c}>
                            {c} ({CURRENCIES[c].trim()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">{C.docNo}</label>
                      <input
                        className="sp-input"
                        value={activeDoc.documentNumber}
                        placeholder={C.docNoPh}
                        onChange={(e) => updateDoc({ documentNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label">{C.issueDate}</label>
                      <input
                        type="date"
                        className="sp-input"
                        value={activeDoc.issueDate}
                        onChange={(e) => updateDoc({ issueDate: e.target.value })}
                      />
                    </div>
                    <div className="span-2">
                      <label className="field-label">{C.vendorName}</label>
                      <input
                        className="sp-input"
                        value={activeDoc.vendorName}
                        placeholder={C.vendorPh}
                        onChange={(e) => updateDoc({ vendorName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        {activeDoc.docType === "receipt" ? C.payMethod : C.clientBillTo}
                      </label>
                      {activeDoc.docType === "receipt" ? (
                        <input
                          className="sp-input"
                          value={activeDoc.paymentMethod}
                          placeholder={C.payMethodPh}
                          onChange={(e) => updateDoc({ paymentMethod: e.target.value })}
                        />
                      ) : (
                        <input
                          className="sp-input"
                          value={activeDoc.clientName}
                          placeholder={C.clientPh}
                          onChange={(e) => updateDoc({ clientName: e.target.value })}
                        />
                      )}
                    </div>
                    <div>
                      <label className="field-label">
                        {activeDoc.docType === "receipt" ? C.poRef : C.dueDate}
                      </label>
                      {activeDoc.docType === "receipt" ? (
                        <input
                          className="sp-input"
                          value={activeDoc.poNumber}
                          placeholder={C.optionalPh}
                          onChange={(e) => updateDoc({ poNumber: e.target.value })}
                        />
                      ) : (
                        <input
                          type="date"
                          className="sp-input"
                          value={activeDoc.dueDate}
                          onChange={(e) => updateDoc({ dueDate: e.target.value })}
                        />
                      )}
                    </div>
                  </div>

                  {/* Line Items Editable Table */}
                  <div className="ocr-lines-wrap">
                    <div className="ocr-lines-head">
                      <span>{C.extractedLines(activeDoc.lineItems.length)}</span>
                      <button type="button" className="ocr-add-line" onClick={addLineItem}>
                        {C.addRow}
                      </button>
                    </div>
                    <div className="ocr-table-scroll">
                      <table className="ocr-lines-table">
                        <thead>
                          <tr>
                            <th>{C.colDesc}</th>
                            <th style={{ width: 112 }}>{C.colCat}</th>
                            <th style={{ width: 66, textAlign: "right" }}>{C.colQty}</th>
                            <th style={{ width: 88, textAlign: "right" }}>{C.colRate}</th>
                            <th style={{ width: 46, textAlign: "center" }}>{C.colTax}</th>
                            <th style={{ width: 92, textAlign: "right" }}>{C.colAmt}</th>
                            <th style={{ width: 28 }} />
                          </tr>
                        </thead>
                        <tbody>
                          {activeDoc.lineItems.map((ln, idx) => (
                            <tr key={ln.id || idx}>
                              <td>
                                <input
                                  className="ocr-cell-in"
                                  value={ln.desc}
                                  placeholder={C.colDescPh}
                                  onChange={(e) => updateLine(idx, "desc", e.target.value)}
                                />
                                {ln.detail ? (
                                  <input
                                    className="ocr-cell-sub"
                                    value={ln.detail}
                                    onChange={(e) => updateLine(idx, "detail", e.target.value)}
                                  />
                                ) : null}
                              </td>
                              <td>
                                <select
                                  className="ocr-cell-sel"
                                  aria-label={C.colCat}
                                  value={ln.category || "Other"}
                                  onChange={(e) => updateLine(idx, "category", e.target.value)}
                                >
                                  {EXPENSE_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {C.categories?.[cat] || cat}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="any"
                                  className="ocr-cell-in num"
                                  value={ln.qty}
                                  onChange={(e) => updateLine(idx, "qty", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="ocr-cell-in num"
                                  value={ln.rate}
                                  onChange={(e) => updateLine(idx, "rate", e.target.value)}
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={ln.taxable !== false}
                                  onChange={(e) => updateLine(idx, "taxable", e.target.checked)}
                                  aria-label={C.taxableLine}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="ocr-cell-in num strong"
                                  value={ln.amount}
                                  onChange={(e) => updateLine(idx, "amount", Number(e.target.value || 0))}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="ocr-row-del"
                                  aria-label={C.deleteLine}
                                  onClick={() => deleteLineItem(idx)}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Totals Block */}
                  <div className="ocr-totals-grid">
                    <div className="ocr-notes-col">
                      <label className="field-label">{C.vendorDetailsLabel}</label>
                      <textarea
                        className="sp-input"
                        rows={3}
                        value={activeDoc.vendorDetails || activeDoc.notes}
                        placeholder={C.vendorDetailsPh}
                        onChange={(e) => updateDoc({ vendorDetails: e.target.value })}
                      />
                    </div>
                    <div className="ocr-figures-col">
                      <div className="ocr-fig-row">
                        <span>{C.subtotal}</span>
                        <span>{fmtCurr(mathStatus?.linesSum ?? activeDoc.subtotal, activeDoc.currency)}</span>
                      </div>
                      {(activeDoc.discountAmount > 0 || activeDoc.shippingAmount > 0) && (
                        <>
                          <div className="ocr-fig-row">
                            <span>{C.discount}</span>
                            <input
                              type="number"
                              step="0.01"
                              className="ocr-tot-in"
                              value={activeDoc.discountAmount}
                              onChange={(e) => updateDoc({ discountAmount: Number(e.target.value || 0) })}
                            />
                          </div>
                          <div className="ocr-fig-row">
                            <span>{C.shipping}</span>
                            <input
                              type="number"
                              step="0.01"
                              className="ocr-tot-in"
                              value={activeDoc.shippingAmount}
                              onChange={(e) => updateDoc({ shippingAmount: Number(e.target.value || 0) })}
                            />
                          </div>
                        </>
                      )}
                      <div className="ocr-fig-row">
                        <span>{C.tax} {activeDoc.taxRatePercent ? `(${activeDoc.taxRatePercent}%)` : ""}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="ocr-tot-in"
                          value={activeDoc.taxAmount}
                          onChange={(e) => updateDoc({ taxAmount: Number(e.target.value || 0) })}
                        />
                      </div>
                      {(activeDoc.docType === "receipt" || activeDoc.tipAmount > 0) && (
                        <div className="ocr-fig-row">
                          <span>{C.tip}</span>
                          <input
                            type="number"
                            step="0.01"
                            className="ocr-tot-in"
                            value={activeDoc.tipAmount}
                            onChange={(e) => updateDoc({ tipAmount: Number(e.target.value || 0) })}
                          />
                        </div>
                      )}
                      <div className="ocr-fig-row is-grand">
                        <span>{C.totalLabel(activeDoc.currency)}</span>
                        <input
                          type="number"
                          step="0.01"
                          className="ocr-tot-in grand"
                          value={activeDoc.total}
                          onChange={(e) => updateDoc({ total: Number(e.target.value || 0) })}
                        />
                      </div>
                    </div>
                  </div>

                  {isEmbedded && (
                    <div className="ocr-embedded-cta">
                      <span>{C.embeddedPrompt}</span>
                      <Link href={ocrScannerHref}>{C.embeddedLink}</Link>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile Sticky Export Footer */}
          {readyDocs.length > 0 && (
            <div className="ocr-mobile-bar">
              <button type="button" className="btn btn-solid btn-sm" onClick={() => handleExportCsv()}>
                CSV
              </button>
              <button type="button" className="btn btn-line btn-sm" onClick={handleExportXlsx}>
                {C.exportXlsx}
              </button>
              <button type="button" className="btn btn-accent btn-sm" onClick={() => handleSendToEditor("recreate")}>
                {C.mobileMakePdf}
              </button>
            </div>
          )}
        </div>
      )}

      {toast ? <div className="ocr-toast" role="status">{toast}</div> : null}

      {/* Zero-Data-Loss Auth Modal (mounted only when open) */}
      {authOpen ? (
        <>
          <div className="overlay show" onClick={() => setAuthOpen(false)} />
          <div className="modal show" role="dialog" aria-modal="true" aria-label={C.authTitle}>
            <button type="button" className="x" onClick={() => setAuthOpen(false)} aria-label="Close">
              ×
            </button>
            <div className="modal-title">{C.authTitle}</div>
            <p className="sub">
              {authPrompt || C.authDefaultSub}
            </p>
            {C.authBenefits.map((b) => (
              <div className="benefit" key={b}>✓ <span>{b}</span></div>
            ))}
            <div style={{ height: 12 }} />
            <input
              className="sp-input"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <input
              className="sp-input"
              type="password"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              placeholder={C.passwordPh}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignIn();
              }}
            />
            <button type="button" className="btn btn-solid" onClick={handleSignIn} disabled={authBusy}>
              {authBusy ? C.pleaseWait : C.logInCreate}
            </button>
            <div className="or">{C.or}</div>
            <button type="button" className="btn btn-line" onClick={handleMagicLink} disabled={authBusy}>
              {C.magicLink}
            </button>
            <p className="fineprint">{C.authFineprint}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
