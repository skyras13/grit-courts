/**
 * Meta (Facebook) Conversions API — server-side Lead event.
 *
 * Recovers iOS/browser-degraded signal by sending the conversion from our server
 * with hashed PII and the fbc/fbp browser cookies for matching. No-ops cleanly
 * when META_PIXEL_ID / META_CAPI_TOKEN aren't set. See
 * docs/04-features/feat-analytics-attribution.md.
 */
import 'server-only';
import { env, capabilities, siteUrl } from './env';
import { sha256Hex, normalizePhone } from './utils';

export interface CapiLeadInput {
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  eventId: string; // dedup key shared with the browser Pixel event
  value?: number;
}

export async function sendMetaLeadEvent(input: CapiLeadInput): Promise<{ sent: boolean }> {
  if (!capabilities.metaCapi) return { sent: false };

  const [hEmail, hPhone, hName] = await Promise.all([
    input.email ? sha256Hex(input.email) : undefined,
    input.phone ? sha256Hex(normalizePhone(input.phone)) : undefined,
    input.fullName ? sha256Hex(input.fullName) : undefined,
  ]);

  const userData: Record<string, unknown> = {};
  if (hEmail) userData.em = [hEmail];
  if (hPhone) userData.ph = [hPhone];
  if (hName) userData.fn = [hName];
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  const body = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId, // dedups against the browser Pixel Lead
        action_source: 'website',
        event_source_url: siteUrl,
        user_data: userData,
        custom_data: { currency: 'USD', value: input.value ?? 0 },
      },
    ],
    ...(env.META_TEST_EVENT_CODE ? { test_event_code: env.META_TEST_EVENT_CODE } : {}),
  };

  const url = `https://graph.facebook.com/v19.0/${env.META_PIXEL_ID}/events?access_token=${env.META_CAPI_TOKEN}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { sent: res.ok };
  } catch (err) {
    console.error('[meta-capi] send failed', err);
    return { sent: false };
  }
}
