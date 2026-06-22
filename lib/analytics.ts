/**
 * Client-side analytics helpers (GA4 + Meta Pixel). Safe no-ops when no IDs are
 * configured. Server-side Meta Conversions API lives in lib/meta-capi.ts.
 */
'use client';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

/** Funnel + feature events. Keep names stable — dashboards key off them. */
export type AnalyticsEvent =
  | 'estimator_start'
  | 'estimator_step'
  | 'estimator_complete'
  | 'previewer_upload'
  | 'previewer_render_done'
  | 'previewer_render_failed'
  | 'lead_submit'
  | 'cta_click';

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  // Mirror lead conversions to the Pixel for browser-side matching.
  if (event === 'lead_submit') {
    window.fbq?.('track', 'Lead', params);
  }
}
