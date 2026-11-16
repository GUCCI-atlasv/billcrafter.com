// Receipt & Invoice OCR API route (Google Cloud Vertex AI / Gemini 2.5 Flash).
//
// Privacy guarantee: uploaded images and PDFs are processed strictly in Worker
// memory to extract structured JSON and are immediately discarded — nothing is
// persisted to R2 or D1.

import { getEnv, getSessionUser } from "@/lib/server/auth";
import { resolveGeminiTarget } from "@/lib/server/gcpAuth";
import { readOcrAllowance, tooManyOcrAttempts, chargeOcrScan } from "@/lib/server/ocrQuota";
import { OCR_RESPONSE_SCHEMA, OCR_SYSTEM_PROMPT, normalizeOcrResult } from "@/lib/ocrSchema";

export const dynamic = "force-dynamic";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_DECODED_BYTES = Math.floor(4.5 * 1024 * 1024); // 4.5 MB safety cap

const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: { "cache-control": "private, no-store" },
  });

const nextUtcReset = () => {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
};

export async function GET(request) {
  const env = await getEnv();
  const user = env?.SESSIONS ? await getSessionUser(request, env).catch(() => null) : null;
  const quota = await readOcrAllowance(env, request, user);
  return json({
    ok: true,
    plan: quota.plan,
    day: quota.day,
    resetAt: nextUtcReset(),
    used: quota.used,
    limit: quota.limit,
    remaining: quota.remaining,
  });
}

export async function POST(request) {
  const startedAt = Date.now();
  const env = await getEnv();
  const user = env?.SESSIONS ? await getSessionUser(request, env).catch(() => null) : null;

  // 1. Parse & validate incoming payload before spending any quota
  let body = {};
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json", counted: false }, 400);
  }

  const rawMime = String(body.mimeType || "").trim().toLowerCase();
  const mimeType = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
  const fileName = String(body.fileName || "document").slice(0, 140);
  const rawBase64 = String(body.dataBase64 || "")
    .replace(/^data:[^;]+;base64,/, "")
    .replace(/\s+/g, "");

  if (!ALLOWED_MIMES.has(mimeType)) {
    return json(
      {
        ok: false,
        error: "unsupported_mime",
        message: "Unsupported file format. Please upload a JPG, PNG, WebP image, or a PDF file.",
        counted: false,
      },
      400
    );
  }

  if (!rawBase64 || rawBase64.length < 32) {
    return json({ ok: false, error: "empty_file", message: "The uploaded file appears empty.", counted: false }, 400);
  }

  const approxBytes = Math.floor((rawBase64.length * 3) / 4);
  if (approxBytes > MAX_DECODED_BYTES) {
    return json(
      {
        ok: false,
        error: "file_too_large",
        message: "This file exceeds 4.5 MB. Take a screenshot (⌘V / Ctrl+V) or upload a smaller PDF.",
        counted: false,
      },
      413
    );
  }

  // 2. Check daily allowance & burst protection
  const quota = await readOcrAllowance(env, request, user);
  if (!quota.allowed) {
    const status = quota.reason === "global_cap" ? 503 : 402;
    const message =
      quota.reason === "global_cap"
        ? "Our free OCR scanner is experiencing peak demand right now. Please try again shortly."
        : quota.plan === "member"
        ? `Daily fair-use limit reached (${quota.limit}/${quota.limit} scans today). Quota resets at 00:00 UTC.`
        : `You've used your ${quota.limit} free guest scans today. Sign in for free to unlock 20 scans/day!`;
    return json(
      {
        ok: false,
        error: quota.reason || "quota",
        plan: quota.plan,
        used: quota.used,
        limit: quota.limit,
        remaining: 0,
        resetAt: nextUtcReset(),
        message,
        counted: false,
      },
      status
    );
  }

  if (await tooManyOcrAttempts(env, request, user)) {
    return json(
      {
        ok: false,
        error: "rate_limited",
        message: "Scanning a bit too fast — please wait a minute and retry.",
        counted: false,
      },
      429
    );
  }

  // 3. Resolve Google Cloud Vertex AI (Service Account) or API Key endpoint
  let target = null;
  try {
    target = await resolveGeminiTarget(env);
  } catch (authErr) {
    return json(
      {
        ok: false,
        error: "gcp_auth_error",
        message: "Cloud OCR authentication could not be initialized.",
        detail: String(authErr?.message || authErr).slice(0, 160),
        counted: false,
      },
      503
    );
  }

  if (!target) {
    return json(
      {
        ok: false,
        error: "ocr_unconfigured",
        message:
          "Cloud OCR credentials are not configured on this environment yet. Try one of the 3 sample bills right below!",
        counted: false,
      },
      503
    );
  }

  // 4. Call Gemini 2.5 Flash with strict JSON responseSchema and thinkingBudget: 0
  const geminiPayload = {
    systemInstruction: {
      role: "system",
      parts: [{ text: OCR_SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: rawBase64,
            },
          },
          {
            text: "Extract all billing header fields, itemized rows, tax/tip, and totals into the exact JSON schema.",
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: OCR_RESPONSE_SCHEMA,
      // Disable extended thinking tokens on Gemini 2.5 Flash so receipt extraction
      // finishes in ~1.6s instead of 4-5s and uses minimal output tokens.
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 24_000);

  try {
    const res = await fetch(target.url, {
      method: "POST",
      headers: target.headers,
      body: JSON.stringify(geminiPayload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      // Retry fallback without thinkingConfig if an older model slug rejects that field
      if (res.status === 400 && errBody.includes("thinkingConfig")) {
        delete geminiPayload.generationConfig.thinkingConfig;
        const retryRes = await fetch(target.url, {
          method: "POST",
          headers: target.headers,
          body: JSON.stringify(geminiPayload),
        });
        if (!retryRes.ok) {
          const retryTxt = await retryRes.text().catch(() => "");
          throw new Error(`gemini_${retryRes.status}:${retryTxt.slice(0, 160)}`);
        }
        const retryData = await retryRes.json();
        return await finalizeExtraction(retryData, { env, quota, fileName, startedAt });
      }
      throw new Error(`gemini_${res.status}:${errBody.slice(0, 160)}`);
    }

    const data = await res.json();
    return await finalizeExtraction(data, { env, quota, fileName, startedAt });
  } catch (err) {
    const isAbort = err?.name === "AbortError";
    return json(
      {
        ok: false,
        error: isAbort ? "timeout" : "upstream_failed",
        message: isAbort
          ? "Temporary OCR engine timeout (your free scan was NOT counted). Please click Retry."
          : "Temporary OCR error (your free scan was NOT counted). Please retry in a moment.",
        detail: String(err?.message || err).slice(0, 160),
        counted: false,
      },
      502
    );
  } finally {
    clearTimeout(timer);
  }
}

async function finalizeExtraction(apiResponse, { env, quota, fileName, startedAt }) {
  const rawText =
    apiResponse?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text || "")
      .join("")
      .trim() || "";

  if (!rawText) {
    return json(
      {
        ok: false,
        error: "empty_extraction",
        message: "Could not read readable text from this file (your free scan was NOT counted). Try a clearer photo.",
        counted: false,
      },
      422
    );
  }

  let parsed = null;
  try {
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return json(
      {
        ok: false,
        error: "parse_error",
        message: "OCR output could not be structured (your free scan was NOT counted). Please retry.",
        counted: false,
      },
      502
    );
  }

  const normalized = normalizeOcrResult(parsed, fileName);

  // Do not charge user's daily scan allowance if the image isn't a bill/receipt at all
  // (burst attempt counter already incremented to prevent abuse).
  if (!normalized.isBillingDocument) {
    return json(
      {
        ok: false,
        error: "not_billing_document",
        message:
          "This doesn't look like an invoice, receipt, or quote. Please upload a clear photo or PDF of a billing document.",
        counted: false,
        quota: {
          plan: quota.plan,
          used: quota.used,
          limit: quota.limit,
          remaining: quota.remaining,
        },
      },
      422
    );
  }

  // Valid extraction delivered -> charge 1 scan
  const charged = await chargeOcrScan(env, quota.subject);
  const usedNow = charged.used || quota.used + 1;
  const remainingNow = Math.max(0, quota.limit - usedNow);

  return json({
    ok: true,
    counted: true,
    latencyMs: Date.now() - startedAt,
    document: normalized,
    quota: {
      plan: quota.plan,
      day: quota.day,
      used: usedNow,
      limit: quota.limit,
      remaining: remainingNow,
    },
  });
}
