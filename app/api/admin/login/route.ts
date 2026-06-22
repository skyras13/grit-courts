import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, checkPassword, makeSessionToken } from '@/lib/admin-auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

/** POST /api/admin/login — sets an HttpOnly session cookie on correct password. */
export async function POST(request: Request) {
  const hdrs = await headers();
  const limit = rateLimit(`admin-login:${clientIp(hdrs)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'Too many attempts.' }, { status: 429 });
  }

  const form = await request.formData().catch(() => null);
  const password = form ? String(form.get('password') ?? '') : '';

  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL('/admin?error=1', request.url), { status: 303 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12, // 12h
  });
  return NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
}

/** DELETE-style logout via POST to /api/admin/login?logout=1 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('logout')) {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE);
  }
  return NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
}
