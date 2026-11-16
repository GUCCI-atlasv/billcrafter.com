"use client";

// Draw-to-sign modal (registered users). Uses signature_pad for the drawing, then
// hands the PNG plus the invoice PDF to /api/sign, which embeds and stores them.
import { useEffect, useRef, useState } from "react";
import { edCopy } from "@/lib/editorI18n";

export default function SignatureModal({ open, onClose, defaultName = "", defaultRecipient = "", docType, locale = "en", onSubmit, onSigned }) {
  const S = edCopy(locale).sig;
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [name, setName] = useState(defaultName);
  const [sendTo, setSendTo] = useState(defaultRecipient);
  const [alsoEmail, setAlsoEmail] = useState(Boolean(defaultRecipient));
  const [consent, setConsent] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => { if (open) setName((n) => n || defaultName); }, [open, defaultName]);
  useEffect(() => {
    if (!open || !defaultRecipient) return;
    setSendTo((v) => v || defaultRecipient);
    setAlsoEmail(true);
  }, [open, defaultRecipient]);

  useEffect(() => {
    if (!open) return;
    let pad;
    let cancelled = false;
    (async () => {
      const { default: SignaturePad } = await import("signature_pad");
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      pad = new SignaturePad(canvas, { penColor: "#16181C", backgroundColor: "rgba(0,0,0,0)", minWidth: 0.7, maxWidth: 2.2 });
      pad.addEventListener("endStroke", () => setEmpty(pad.isEmpty()));
      padRef.current = pad;
      setEmpty(true);
    })();
    return () => { cancelled = true; try { pad?.off(); } catch {} padRef.current = null; };
  }, [open]);

  function clear() { padRef.current?.clear(); setEmpty(true); setErr(""); }

  async function submit() {
    setErr("");
    if (!name.trim()) return setErr(S.errName);
    if (empty || padRef.current?.isEmpty()) return setErr(S.errDraw);
    if (!consent) return setErr(S.errConsent);
    if (alsoEmail && !/.+@.+\..+/.test(sendTo.trim())) return setErr(S.errEmail);

    setBusy(true);
    try {
      const d = await onSubmit({
        png: padRef.current.toDataURL("image/png"),
        name: name.trim(),
        sendTo: alsoEmail ? sendTo.trim() : null,
      });
      onSigned?.(d);
      onClose?.();
    } catch (e) {
      if (e?.status === 401) setErr(S.errUnauth);
      else if (e?.status === 503) setErr(S.errUnavailable);
      else setErr(S.errFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className={"overlay" + (open ? " show" : "")} onClick={onClose} />
      <div className={"modal" + (open ? " show" : "")} role="dialog" aria-modal="true" aria-label={S.title((docType || "invoice").toLowerCase())}>
        <button type="button" className="x" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-title">{S.title((docType || "invoice").toLowerCase())}</div>
        <p className="sub">{S.sub}</p>

        <label className="sig-label">{S.nameLabel}</label>
        <input className="sp-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={S.namePh} />

        <label className="sig-label" style={{ marginTop: 12 }}>{S.sigLabel}</label>
        <div className="sig-wrap">
          <canvas ref={canvasRef} className="sig-canvas" />
          {empty ? <span className="sig-hint">{S.drawHere}</span> : null}
        </div>
        <button type="button" className="link-text" onClick={clear} style={{ marginTop: 6 }}>{S.clear}</button>

        <label className="sig-consent" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={alsoEmail} onChange={(e) => setAlsoEmail(e.target.checked)} />
          <span style={{ color: "var(--ink)" }}>{S.alsoEmail}</span>
        </label>
        {alsoEmail ? (
          <input
            className="sp-input" type="email" value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            placeholder="client@company.com" style={{ marginTop: 8 }}
          />
        ) : null}

        <label className="sig-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{S.consent}</span>
        </label>

        {err ? <p className="sig-err" role="alert">{err}</p> : null}

        <button type="button" className="btn btn-solid btn-block" onClick={submit} disabled={busy} style={{ marginTop: 14 }}>
          {busy ? S.signing : S.submit}
        </button>
      </div>
    </>
  );
}
