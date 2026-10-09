"use client";

// Draw-to-sign modal (registered users). Uses signature_pad for the drawing, then
// hands the PNG plus the invoice PDF to /api/sign, which embeds and stores them.
import { useEffect, useRef, useState } from "react";

// Matches CONSENT_TEXT in app/api/sign/route.js. Shown here and stored verbatim
// with the signature, so the record always reflects what was actually agreed to.
const CONSENT_TEXT =
  "I agree to sign this document electronically and intend this signature to have the " +
  "same effect as my handwritten signature, to the extent the law that applies to this " +
  "document allows. I understand that a record of this signature — including the time, " +
  "my IP address and this consent — will be kept.";

export default function SignatureModal({ open, onClose, defaultName = "", defaultRecipient = "", docType, onSubmit, onSigned }) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [name, setName] = useState(defaultName);
  const [sendTo, setSendTo] = useState(defaultRecipient);
  const [alsoEmail, setAlsoEmail] = useState(Boolean(defaultRecipient));
  const [consent, setConsent] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

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
      // Match the backing store to the device pixel ratio, otherwise the drawing
      // is blurry on retina screens and looks poor once embedded in the PDF.
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
    if (!name.trim()) return setErr("Enter the name you're signing under.");
    if (empty || padRef.current?.isEmpty()) return setErr("Draw your signature in the box above.");
    if (!consent) return setErr("Tick the consent box to sign.");
    if (alsoEmail && !/.+@.+\..+/.test(sendTo.trim())) return setErr("Enter a valid recipient email, or untick sending.");

    setBusy(true);
    try {
      // The editor places the signature on the invoice, captures the PDF and
      // stores it — this modal only collects the input.
      const d = await onSubmit({
        png: padRef.current.toDataURL("image/png"),
        name: name.trim(),
        sendTo: alsoEmail ? sendTo.trim() : null,
      });
      onSigned?.(d);
      onClose?.();
    } catch (e) {
      if (e?.status === 401) setErr("Please sign in again to sign documents.");
      else if (e?.status === 503) setErr("Signing isn’t set up on the server yet.");
      else setErr("The signature was added, but saving it failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className={"overlay" + (open ? " show" : "")} onClick={onClose} />
      <div className={"modal" + (open ? " show" : "")}>
        <button className="x" onClick={onClose}>×</button>
        <div className="modal-title">Sign this {(docType || "invoice").toLowerCase()}</div>
        <p className="sub">Draw your signature below. It’s embedded into the PDF and stored with a signing record.</p>

        <label className="sig-label">Full legal name</label>
        <input className="sp-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Rivera" />

        <label className="sig-label" style={{ marginTop: 12 }}>Signature</label>
        <div className="sig-wrap">
          <canvas ref={canvasRef} className="sig-canvas" />
          {empty ? <span className="sig-hint">Draw here</span> : null}
        </div>
        <button className="link-text" onClick={clear} style={{ marginTop: 6 }}>Clear</button>

        <label className="sig-consent" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={alsoEmail} onChange={(e) => setAlsoEmail(e.target.checked)} />
          <span style={{ color: "var(--ink)" }}>Email the signed copy to the recipient</span>
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
          <span>{CONSENT_TEXT}</span>
        </label>

        {err ? <p className="sig-err">{err}</p> : null}

        <button className="btn btn-solid btn-block" onClick={submit} disabled={busy} style={{ marginTop: 14 }}>
          {busy ? "Signing…" : "Sign & save"}
        </button>
      </div>
    </>
  );
}
