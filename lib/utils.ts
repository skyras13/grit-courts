/** Small shared helpers — no runtime deps. */

/** Minimal className combiner (avoids pulling in clsx/tailwind-merge). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** SHA-256 hex — used to hash PII before sending to the Meta Conversions API. */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Normalize a US phone to E.164-ish digits for hashing/automation. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Parse UTM + click-id params from a URLSearchParams into a flat record. */
export function extractUtm(params: URLSearchParams): Record<string, string> {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}
