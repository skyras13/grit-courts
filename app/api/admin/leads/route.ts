import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import { updateLead } from '@/lib/repo';
import { LEAD_STATUSES } from '@/lib/types';

export const runtime = 'nodejs';

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

/** PATCH /api/admin/leads — update a lead's status. Cookie-gated. */
export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed' }, { status: 400 });
  }
  const updated = await updateLead(parsed.data.id, { status: parsed.data.status });
  return NextResponse.json({ ok: Boolean(updated), lead: updated });
}
