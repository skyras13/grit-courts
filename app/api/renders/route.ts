import { NextResponse, after } from 'next/server';
import { headers } from 'next/headers';
import { COURT_TYPES, type CourtType } from '@/lib/types';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/schemas';
import { uploadYardImage } from '@/lib/storage';
import { createRender, updateRender } from '@/lib/repo';
import { renderCourt, RenderError, SAMPLE_RENDERS } from '@/lib/render';
import { buildPrompt } from '@/lib/render/prompt';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const maxDuration = 60; // allow the post-response render to finish (Vercel)

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

/**
 * POST /api/renders — accepts a yard photo (multipart) + courtType, stores it,
 * creates a queued render row, then runs the model AFTER responding (Next.js
 * `after`) so the request returns immediately. The client polls GET /api/renders/:id.
 */
export async function POST(request: Request) {
  const hdrs = await headers();
  const ip = clientIp(hdrs);
  const limit = rateLimit(`renders:${ip}`, 6, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'You’ve created a lot of previews — please wait a minute.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected multipart form data.' }, { status: 400 });
  }

  const file = form.get('image');
  const courtTypeRaw = String(form.get('courtType') ?? 'pickleball');
  const leadId = form.get('leadId') ? String(form.get('leadId')) : undefined;
  const courtType: CourtType = (COURT_TYPES as readonly string[]).includes(courtTypeRaw)
    ? (courtTypeRaw as CourtType)
    : 'pickleball';

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No image was uploaded.' }, { status: 400 });
  }
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: 'Please upload a JPG, PNG, WebP, or HEIC image.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'That image is over 10MB. Please choose a smaller photo.' },
      { status: 413 },
    );
  }

  // Store the (already client-downscaled, EXIF-stripped) image.
  const bytes = await file.arrayBuffer();
  const ext = EXT_BY_TYPE[file.type] ?? 'jpg';
  let stored;
  try {
    stored = await uploadYardImage(bytes, file.type, ext);
  } catch (err) {
    console.error('[api/renders] upload failed', err);
    return NextResponse.json({ ok: false, error: 'Upload failed. Please try again.' }, { status: 500 });
  }

  const render = await createRender({
    lead_id: leadId ?? null,
    court_type: courtType,
    original_image_path: stored.path,
    rendered_image_url: null,
    provider: env.RENDER_PROVIDER,
    model: null,
    prompt: buildPrompt(courtType),
    status: 'queued',
    error: null,
    latency_ms: null,
    cost_usd: null,
  });

  // Run the model AFTER the response is sent. Keeps the request snappy and the
  // polling UI honest. The mock provider works without a signed URL.
  after(async () => {
    try {
      await updateRender(render.id, { status: 'processing' });
      const needsRealImage = env.RENDER_PROVIDER !== 'mock';
      if (needsRealImage && !stored.signedUrl) {
        throw new RenderError('No accessible image URL for the model.', env.RENDER_PROVIDER);
      }
      const result = await renderCourt({
        imageUrl: stored.signedUrl ?? SAMPLE_RENDERS[courtType],
        courtType,
      });
      await updateRender(render.id, {
        status: 'done',
        rendered_image_url: result.url,
        provider: result.provider,
        model: result.model,
        latency_ms: result.latencyMs,
        cost_usd: result.costUsd,
      });
    } catch (err) {
      console.error('[api/renders] render failed', err);
      await updateRender(render.id, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Render failed',
      });
    }
  });

  return NextResponse.json({ ok: true, renderId: render.id, status: 'queued' });
}
