import { NextResponse } from 'next/server';
import { renderWebhookSchema } from '@/lib/schemas';
import { getRender, updateRender } from '@/lib/repo';

export const runtime = 'nodejs';

/**
 * POST /api/renders/webhook — optional provider callback. Lets a render provider
 * (or an external queue) push the final result instead of relying on `after()`.
 * Idempotent: ignores updates to renders already in a terminal state.
 *
 * NOTE: in production, verify the provider's signature header here before trusting
 * the payload (documented in docs/03-architecture/security-and-privacy.md).
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = renderWebhookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed' }, { status: 400 });
  }
  const { renderId, status, renderedImageUrl, error, latencyMs, costUsd } = parsed.data;

  const existing = await getRender(renderId).catch(() => null);
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Render not found.' }, { status: 404 });
  }
  if (existing.status === 'done' || existing.status === 'failed') {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  await updateRender(renderId, {
    status,
    rendered_image_url: renderedImageUrl ?? existing.rendered_image_url,
    error: error ?? null,
    latency_ms: latencyMs ?? existing.latency_ms,
    cost_usd: costUsd ?? existing.cost_usd,
  });

  return NextResponse.json({ ok: true });
}
