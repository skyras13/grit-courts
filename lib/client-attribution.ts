'use client';

/** Reads UTM params from the URL and Meta click cookies (_fbc/_fbp) for lead
 *  attribution. Browser-only; returns empty values during SSR. */
export interface ClientAttribution {
  utm: Record<string, string>;
  fbc: string | null;
  fbp: string | null;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

export function getClientAttribution(): ClientAttribution {
  if (typeof window === 'undefined') return { utm: {}, fbc: null, fbp: null };
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const v = params.get(k);
    if (v) utm[k] = v;
  }
  return { utm, fbc: readCookie('_fbc'), fbp: readCookie('_fbp') };
}
