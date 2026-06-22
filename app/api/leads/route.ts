import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { leadSchema } from '@/lib/schemas';
import { createLead, getRender, updateRender } from '@/lib/repo';
import { estimatePrice } from '@/lib/pricing';
import { notifyNewLead } from '@/lib/notify';
import { sendMetaLeadEvent } from '@/lib/meta-capi';
import { getCitySeed } from '@/lib/cities-data';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import type { Lead } from '@/lib/types';

export const runtime = 'nodejs';

/**
 * POST /api/leads — the single lead-capture endpoint for the estimator and the
 * previewer. Validates with Zod, computes the estimate server-side (never trust
 * the client's numbers), persists, then fans out speed-to-lead notifications and
 * the server-side Meta CAPI event. Returns { ok, leadId, estimate }.
 */
export async function POST(request: Request) {
  const hdrs = await headers();
  const ip = clientIp(hdrs);
  const limit = rateLimit(`leads:${ip}`, 8, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Recompute the estimate server-side from the court fields (authoritative).
  const estimate =
    input.courtType && input.courtSize && input.landCondition
      ? estimatePrice({
          courtType: input.courtType,
          courtSize: input.courtSize,
          landCondition: input.landCondition,
        })
      : null;

  // Read Meta click cookies for attribution if the client didn't pass them.
  const cookieStore = await cookies();
  const fbc = input.fbc || cookieStore.get('_fbc')?.value || null;
  const fbp = input.fbp || cookieStore.get('_fbp')?.value || null;

  let lead: Lead;
  try {
    lead = await createLead({
      court_type: input.courtType ?? null,
      court_size: input.courtSize ?? null,
      land_condition: input.landCondition ?? null,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email || null,
      property_address: input.propertyAddress || null,
      estimated_min: estimate?.min ?? input.estimatedMin ?? null,
      estimated_max: estimate?.max ?? input.estimatedMax ?? null,
      city_slug: input.citySlug ?? null,
      render_id: input.renderId ?? null,
      sms_consent: input.smsConsent,
      sms_consent_at: input.smsConsent ? new Date().toISOString() : null,
      utm: input.utm ?? {},
      fbc,
      fbp,
      source: input.source,
    });
  } catch (err) {
    console.error('[api/leads] persist failed', err);
    return NextResponse.json({ ok: false, error: 'Could not save your request.' }, { status: 500 });
  }

  // If a render was attached, back-link it to this lead.
  let renderUrl: string | null = null;
  if (input.renderId) {
    const render = await getRender(input.renderId).catch(() => null);
    if (render) {
      renderUrl = render.rendered_image_url;
      if (!render.lead_id) await updateRender(render.id, { lead_id: lead.id }).catch(() => null);
    }
  }

  const cityName = input.citySlug ? (getCitySeed(input.citySlug)?.name ?? null) : null;

  // Fire-and-await notifications + attribution. These never throw.
  const [, capi] = await Promise.all([
    notifyNewLead({ lead, renderUrl, cityName }),
    sendMetaLeadEvent({
      email: lead.email,
      phone: lead.phone,
      fullName: lead.full_name,
      fbc,
      fbp,
      clientIp: ip,
      userAgent: hdrs.get('user-agent'),
      eventId: lead.id, // dedup with browser Pixel
      value: estimate?.min,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    estimate: estimate ? { min: estimate.min, max: estimate.max } : null,
    capiSent: capi.sent,
  });
}
