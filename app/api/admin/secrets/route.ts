import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/cms/guard';
import { clearSecret, secretStatuses, setSecret } from '@/lib/cms/secrets';
import { SECRET_KEYS, type SecretKey } from '@/lib/cms/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isSecretKey(v: unknown): v is SecretKey {
  return typeof v === 'string' && (SECRET_KEYS as readonly string[]).includes(v);
}

/** Status only — values are never sent to the browser. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ ok: true, secrets: await secretStatuses() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { key, value } = (await request.json().catch(() => ({}))) as { key?: unknown; value?: unknown };
  if (!isSecretKey(key)) return NextResponse.json({ ok: false, error: 'Unknown key.' }, { status: 400 });
  if (typeof value !== 'string' || value.trim().length < 8) {
    return NextResponse.json({ ok: false, error: 'That key looks too short.' }, { status: 400 });
  }
  await setSecret(key, value.trim());
  return NextResponse.json({ ok: true, secrets: await secretStatuses() });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { key } = (await request.json().catch(() => ({}))) as { key?: unknown };
  if (!isSecretKey(key)) return NextResponse.json({ ok: false, error: 'Unknown key.' }, { status: 400 });
  await clearSecret(key);
  return NextResponse.json({ ok: true, secrets: await secretStatuses() });
}
