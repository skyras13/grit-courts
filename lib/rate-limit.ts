/**
 * Tiny in-memory sliding-window rate limiter for API routes.
 *
 * Good enough for a single-instance demo and as a first line of defense. For
 * production scale, swap the Map for Upstash Redis behind the same interface
 * (documented in docs/03-architecture/security-and-privacy.md).
 */
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0]!;
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { ok: true, remaining: limit - timestamps.length, retryAfterSec: 0 };
}

/** Best-effort client IP from forwarded headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
