import { NextResponse } from 'next/server';
import { getRender } from '@/lib/repo';

export const runtime = 'nodejs';

/** GET /api/renders/:id — polled by the previewer until status is done|failed. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const render = await getRender(id).catch(() => null);
  if (!render) {
    return NextResponse.json({ ok: false, error: 'Render not found.' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    status: render.status,
    renderedImageUrl: render.rendered_image_url,
    courtType: render.court_type,
    error: render.error,
  });
}
