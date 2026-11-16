// Google Cloud authentication & endpoint resolver for Cloudflare Workers.
//
// Zero Node.js SDK dependencies: uses the standard Web Crypto API (`crypto.subtle`)
// available natively in the Workers runtime to sign RS256 Service Account JWTs,
// and caches OAuth2 access tokens in both Worker isolate memory and Cloudflare KV
// (`env.SESSIONS`) for 55 minutes so 99%+ of OCR calls incur 0ms auth overhead.
//
// Supports two authentication modes seamlessly:
//   1. Primary (Enterprise GCP): `GCP_SERVICE_ACCOUNT_JSON` -> Vertex AI REST API
//      (covered by Google Cloud's enterprise data-governance guarantee: zero data
//      retention for model training).
//   2. Fallback / Quick Dev: `GOOGLE_CLOUD_API_KEY` (or `GEMINI_API_KEY`) ->
//      Vertex AI Express / Generative Language REST API.

const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const KV_TOKEN_TTL = 3300; // 55 minutes (Google access tokens live 3600s)

// L1 in-memory isolate cache — avoids spending KV reads on warm Worker invocations.
let memToken = { key: "", token: "", expiresAt: 0 };

function base64UrlEncode(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem) {
  const clean = String(pem || "")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "");
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function parseServiceAccount(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const jsonStr = trimmed.startsWith("{") ? trimmed : atob(trimmed);
  const sa = JSON.parse(jsonStr);
  if (!sa?.project_id || !sa?.client_email || !sa?.private_key) {
    throw new Error("invalid_gcp_service_account");
  }
  return sa;
}

export async function getVertexAccessToken(env, sa) {
  const now = Date.now();
  const cacheKey = `gcp:tok:${sa.client_email}`;

  // 1. Check Worker isolate memory cache
  if (memToken.key === cacheKey && memToken.expiresAt > now + 30_000) {
    return memToken.token;
  }

  // 2. Check Cloudflare KV cache
  if (env?.SESSIONS) {
    try {
      const raw = await env.SESSIONS.get(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && Number(parsed.expiresAt) > now + 30_000) {
          memToken = { key: cacheKey, token: parsed.token, expiresAt: Number(parsed.expiresAt) };
          return parsed.token;
        }
      }
    } catch {
      // Ignore KV cache read error and mint a fresh token
    }
  }

  // 3. Sign RS256 JWT via Web Crypto and exchange for a Google OAuth2 bearer token
  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: sa.client_email,
      sub: sa.client_email,
      aud: TOKEN_URI,
      scope: SCOPE,
      iat,
      exp,
    })
  );
  const unsigned = `${header}.${payload}`;

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsigned)
  );
  const assertion = `${unsigned}.${base64UrlEncode(new Uint8Array(sigBuf))}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${assertion}`,
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => "");
    throw new Error(`gcp_oauth_${res.status}:${errTxt.slice(0, 120)}`);
  }

  const data = await res.json();
  if (!data?.access_token) throw new Error("gcp_oauth_missing_token");

  const expiresAt = now + KV_TOKEN_TTL * 1000;
  memToken = { key: cacheKey, token: data.access_token, expiresAt };

  if (env?.SESSIONS) {
    try {
      await env.SESSIONS.put(cacheKey, JSON.stringify({ token: data.access_token, expiresAt }), {
        expirationTtl: KV_TOKEN_TTL,
      });
    } catch {
      // Non-fatal if KV write fails
    }
  }

  return data.access_token;
}

function readVar(env, name) {
  return (env && env[name]) || (typeof process !== "undefined" ? process.env?.[name] : undefined) || "";
}

/**
 * Resolves the Gemini REST endpoint and request headers using either a Google Cloud
 * Service Account (Vertex AI) or a Google Cloud / Gemini API Key.
 */
export async function resolveGeminiTarget(env) {
  const model = readVar(env, "GEMINI_MODEL") || "gemini-2.5-flash";
  const location = readVar(env, "GCP_LOCATION") || "us-central1";
  const rawSa = readVar(env, "GCP_SERVICE_ACCOUNT_JSON");
  const apiKey = readVar(env, "GOOGLE_CLOUD_API_KEY") || readVar(env, "GEMINI_API_KEY");
  const explicitProject = readVar(env, "GCP_PROJECT_ID");

  // Priority 1: Google Cloud Service Account -> regional/global Vertex AI endpoint
  if (rawSa) {
    const sa = parseServiceAccount(rawSa);
    const token = await getVertexAccessToken(env, sa);
    const projectId = explicitProject || sa.project_id;
    const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;
    return {
      mode: "vertex_sa",
      model,
      url: `https://${host}/v1/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(location)}/publishers/google/models/${encodeURIComponent(model)}:generateContent`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
  }

  // Priority 2: Google Cloud API Key -> Vertex AI Express Mode (when project is set) or Gemini Developer API
  if (apiKey) {
    if (explicitProject) {
      const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;
      return {
        mode: "vertex_key",
        model,
        url: `https://${host}/v1/projects/${encodeURIComponent(explicitProject)}/locations/${encodeURIComponent(location)}/publishers/google/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        headers: { "content-type": "application/json" },
      };
    }
    return {
      mode: "google_api_key",
      model,
      url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      headers: { "content-type": "application/json" },
    };
  }

  return null;
}
