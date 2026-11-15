// Shared request guards for the API routes: a rate limiter and a size-capped
// JSON body reader.
//
// HONEST LIMITS OF THE RATE LIMITER
// It is an in-memory fixed window counter. That means:
//   * it is per server instance: several instances each keep their own counts;
//   * it resets on every restart and on every serverless cold start;
//   * clients with no usable address header all share one "unknown" bucket.
// It slows down casual abuse and form spam. Real protection needs a shared
// store (Redis, Upstash, or the database from plan.md phase 2) or a limit at
// the edge or proxy in front of the app.

type Bucket = { count: number; resetAt: number };

const MAX_KEYS = 5000;

const g = globalThis as unknown as { __terrantiaRate?: Map<string, Bucket> };
const buckets = (g.__terrantiaRate ??= new Map<string, Bucket>());

const clean = (v: string | null | undefined) => (v ?? "").trim().slice(0, 64);

/**
 * Best effort client address.
 * 1. x-real-ip: set by the platform or by the reverse proxy in front of the app.
 * 2. x-vercel-forwarded-for: set by Vercel, not forwardable by the client.
 * 3. The LAST entry of x-forwarded-for: that is what the nearest proxy saw.
 *    The first entry is whatever the client chose to send, so it is not used.
 * When the app is reachable directly, with no proxy, every one of these can be
 * forged. Run it behind a proxy that overwrites them.
 */
export function clientId(req: Request): string {
  const real = clean(req.headers.get("x-real-ip"));
  if (real) return real;
  const vercel = clean(req.headers.get("x-vercel-forwarded-for")?.split(",")[0]);
  if (vercel) return vercel;
  const last = clean(req.headers.get("x-forwarded-for")?.split(",").pop());
  if (last) return last;
  return "unknown";
}

export type RateLimitOptions = { key: string; max: number; windowMs: number };
export type RateLimitResult = { limited: boolean; retryAfterSec: number };

export function rateLimit(req: Request, { key, max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  // Prune expired windows on every call so the map cannot grow without bound.
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }

  const id = `${key}:${clientId(req)}`;
  let bucket = buckets.get(id);
  if (!bucket) {
    // Hard cap: drop the oldest entries (a Map iterates in insertion order).
    while (buckets.size >= MAX_KEYS) {
      const oldest = buckets.keys().next().value;
      if (oldest === undefined) break;
      buckets.delete(oldest);
    }
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(id, bucket);
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { limited: true, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { limited: false, retryAfterSec: 0 };
}

/** The 429 reply, with a Retry-After header. */
export function tooManyRequests(retryAfterSec: number): Response {
  return Response.json(
    { error: "Too many requests. Please try again soon." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

export const MAX_BODY_BYTES = 20 * 1024;

export type BodyResult = { ok: true; body: unknown } | { ok: false; response: Response };

/**
 * Reads a JSON body of at most 20 KB. Replies 413 when the declared or the
 * actual size is larger, and 400 when the text is not JSON. The declared size
 * is checked first so an oversized upload is refused before it is read.
 */
export async function readJsonBody(req: Request, invalidMessage = "Invalid request."): Promise<BodyResult> {
  const tooLarge = () =>
    ({ ok: false, response: Response.json({ error: "Request is too large." }, { status: 413 }) }) as const;

  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return tooLarge();

  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, response: Response.json({ error: invalidMessage }, { status: 400 }) };
  }
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) return tooLarge();

  try {
    return { ok: true, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: Response.json({ error: invalidMessage }, { status: 400 }) };
  }
}

/** True when the hidden honeypot field came back filled in. */
export function honeypotFilled(body: unknown): boolean {
  return Boolean(body && typeof body === "object" && (body as { website?: unknown }).website);
}
