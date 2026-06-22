/**
 * Lightweight admin auth for v1 (OPEN DECISION: Clerk deferred to a later phase).
 *
 * A single shared password gates /admin. On success we set an HttpOnly cookie
 * holding an HMAC of a fixed payload + ADMIN_SESSION_SECRET, so the cookie can't
 * be forged without the secret. Good enough to demo a private owner dashboard;
 * documented as a known limitation in docs/04-features/feat-owner-dashboard.md.
 */
import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

export const ADMIN_COOKIE = 'grit_admin';
const PAYLOAD = 'admin-v1';

function sign(payload: string): string {
  return createHmac('sha256', env.ADMIN_SESSION_SECRET).update(payload).digest('hex');
}

export function makeSessionToken(): string {
  return `${PAYLOAD}.${sign(PAYLOAD)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (payload !== PAYLOAD || !sig) return false;
  const expected = sign(PAYLOAD);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(env.ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
