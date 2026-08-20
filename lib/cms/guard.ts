import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '../admin-auth';

/** Returns a 401 response when the caller isn't a signed-in owner, else null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const jar = await cookies();
  if (verifySessionToken(jar.get(ADMIN_COOKIE)?.value)) return null;
  return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
}
