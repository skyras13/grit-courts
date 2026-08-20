import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/cms/guard';
import { getContent, saveContent, resetContent } from '@/lib/cms/store';
import type { SiteContent } from '@/lib/cms/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ ok: true, content: await getContent() });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  let body: SiteContent;
  try {
    body = (await request.json()) as SiteContent;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || !body.business) {
    return NextResponse.json({ ok: false, error: 'Content payload looks malformed.' }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, content: await saveContent(body) });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Save failed.' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ ok: true, content: await resetContent() });
}
