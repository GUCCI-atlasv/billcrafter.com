// E-signature for registered users.
//
// Flow: the browser produces the invoice PDF (html2pdf) and the drawn signature
// (signature_pad) → this route embeds the signature with pdf-lib, stamps a small
// audit block on the page, stores the result in R2, and writes the evidence row
// to D1.
//
// The evidence matters more than the drawing. An electronic signature is only
// defensible if you can show intent, consent, attribution and an unaltered copy —
// so we record the exact consent wording, the moment it was accepted, the IP and
// user agent, and a SHA-256 of the precise bytes we stored.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { sendPdfEmail, isEmail } from "@/lib/server/email";

export const dynamic = "force-dynamic";

const MAX_PDF = 12 * 1024 * 1024;    // 12 MB
const MAX_SIG = 2 * 1024 * 1024;

// Wording the signer accepts. Stored verbatim with each signature so we can always
// show what was actually agreed to, even if this text changes later.
export const CONSENT_TEXT =
  "I agree to sign this document electronically and intend this signature to have the " +
  "same effect as my handwritten signature, to the extent the law that applies to this " +
  "document allows. I understand that a record of this signature — including the time, " +
  "my IP address and this consent — will be kept.";

function b64ToBytes(b64) {
  const bin = atob(String(b64).replace(/^data:[^,]+,/, ""));
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}
// Chunked so a multi-MB PDF doesn't blow the argument limit of String.fromCharCode.
function bytesToB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}
async function sha256Hex(bytes) {
  const d = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const clientIp = (req) =>
  req.headers.get("cf-connecting-ip") ||
  req.headers.get("x-real-ip") ||
  (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
  null;

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  // Registered users only — this is an account benefit.
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  if (!env.FILE_STORAGE) return Response.json({ ok: false, error: "storage_unavailable" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const {
    pdfBase64, signaturePng, signerName, consent, invoiceNo, invoiceId, docType,
    sendTo, emailSubject, emailMessage,   // optional: mail the signed copy to the recipient
  } = body || {};

  if (!pdfBase64 || !signaturePng) return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  if (!signerName || !String(signerName).trim()) return Response.json({ ok: false, error: "name_required" }, { status: 400 });
  // Consent is not a checkbox we can infer — it must be explicitly true.
  if (consent !== true) return Response.json({ ok: false, error: "consent_required" }, { status: 400 });

  let pdfBytes, sigBytes;
  try {
    pdfBytes = b64ToBytes(pdfBase64);
    sigBytes = b64ToBytes(signaturePng);
  } catch {
    return Response.json({ ok: false, error: "decode_failed" }, { status: 400 });
  }
  if (pdfBytes.length > MAX_PDF || sigBytes.length > MAX_SIG) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const signedAt = Date.now();
  const ip = clientIp(request);
  const ua = (request.headers.get("user-agent") || "").slice(0, 300);
  const country = request.headers.get("cf-ipcountry") || null;
  const name = String(signerName).trim().slice(0, 120);

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // The signature drawing is already part of the document — the editor renders
    // it in the invoice, so it lands wherever the sheet puts it. Stamping it here
    // at a fixed page coordinate is what previously left it marooned in the
    // bottom margin, ~190pt below the end of the invoice.
    //
    // What still belongs on the server is the audit footer: a tamper-evident line
    // the signer can't edit, on every page.
    const stampLine =
      `Electronically signed by ${name} · ${new Date(signedAt).toISOString()}` +
      `${ip ? ` · IP ${ip}` : ""} · BillCrafter`;

    for (const page of pdf.getPages()) {
      page.drawText(stampLine, {
        x: 28, y: 18, size: 6.5, font, color: rgb(0.55, 0.57, 0.60),
      });
    }

    const outBytes = await pdf.save();
    const sha256 = await sha256Hex(outBytes);

    const id = crypto.randomUUID();
    const safeNo = String(invoiceNo || "document").replace(/[^\w.-]/g, "_").slice(0, 60);
    const r2Key = `signed/${user.id}/${id}-${safeNo}.pdf`;

    await env.FILE_STORAGE.put(r2Key, outBytes, {
      httpMetadata: { contentType: "application/pdf" },
      customMetadata: { userId: String(user.id), sha256, signedAt: String(signedAt) },
    });
    // Keep the raw drawing too. It's embedded in the PDF, but holding the original
    // separately means the mark itself can still be produced as evidence if the
    // document is ever disputed.
    await env.FILE_STORAGE.put(`${r2Key.replace(/\.pdf$/, "")}-signature.png`, sigBytes, {
      httpMetadata: { contentType: "image/png" },
      customMetadata: { userId: String(user.id), signedAt: String(signedAt) },
    }).catch(() => { /* evidence copy is best-effort; never fail the signing */ });

    await env.DB.prepare(
      `INSERT INTO signatures
        (id, user_id, user_email, invoice_id, invoice_no, doc_type, signer_name, signer_role,
         consent_text, consent_at, ip, country, ua, r2_key, sha256, bytes, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      id, user.id, user.email || null, invoiceId || null, invoiceNo || null,
      docType || "invoice", name, "sender",
      CONSENT_TEXT, signedAt, ip, country, ua, r2Key, sha256, outBytes.length, signedAt
    ).run();

    // Optionally send the signed copy to the recipient. The signature is already
    // stored at this point, so a mail failure is reported but never loses the
    // signed document — the caller can still download it.
    let emailed = null;
    if (sendTo) {
      if (!isEmail(sendTo)) {
        emailed = { ok: false, error: "invalid_recipient" };
      } else {
        const label = docType || "invoice";
        const r = await sendPdfEmail(env, {
          user,
          to: String(sendTo).trim(),
          subject: emailSubject || `Signed ${label}${invoiceNo ? ` ${invoiceNo}` : ""} from ${name}`,
          message: emailMessage ||
            `Hi,\n\nPlease find the signed ${String(label).toLowerCase()}${invoiceNo ? ` ${invoiceNo}` : ""} attached.\n\nThank you,\n${name}`,
          filename: `${safeNo}-signed.pdf`,
          pdfBase64: bytesToB64(outBytes),
          footerNote: `Electronically signed by ${name} on ${new Date(signedAt).toISOString()}. Verification reference: ${sha256.slice(0, 16)}…`,
        });
        emailed = r.ok ? { ok: true, to: String(sendTo).trim() } : { ok: false, error: r.error };
      }
    }

    return Response.json({
      ok: true, id, sha256, signedAt, r2Key,
      downloadUrl: `/api/sign/${id}`,
      emailed,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: "sign_failed", detail: String(err?.message || err).slice(0, 300) },
      { status: 500 }
    );
  }
}

// The signer's own signing history.
export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { results } = await env.DB.prepare(
    `SELECT id, invoice_no, doc_type, signer_name, consent_at, ip, sha256, bytes, created_at
       FROM signatures WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`
  ).bind(user.id).all().catch(() => ({ results: [] }));

  return Response.json({ ok: true, signatures: results || [] });
}
