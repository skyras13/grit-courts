import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import { listLeads, listRenders } from '@/lib/repo';
import { Container } from '@/components/ui/layout';
import { AdminTable } from '@/components/admin/admin-table';
import { isDemoMode } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Admin — Leads',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic'; // never cache the dashboard

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const { error } = await searchParams;

  if (!authed) {
    return (
      <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-16">
        <h1 className="text-2xl">Owner dashboard</h1>
        <p className="mt-2 text-sm text-fg-muted">Enter the password to view incoming leads.</p>
        <form method="POST" action="/api/admin/login" className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="h-11 w-full rounded-lg border border-border px-3.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
          <button type="submit" className="h-11 w-full rounded-lg bg-brand-600 font-semibold text-white hover:bg-brand-700">
            Sign in
          </button>
          {error && <p role="alert" className="text-sm text-red-600">Incorrect password. Try again.</p>}
        </form>
        <p className="mt-6 text-xs text-fg-muted">
          v1 uses a shared password (set <code>ADMIN_PASSWORD</code>). Clerk-based accounts are
          planned — see docs/04-features/feat-owner-dashboard.md.
        </p>
      </Container>
    );
  }

  const [leads, renders] = await Promise.all([listLeads(), listRenders()]);
  const rendersById = Object.fromEntries(renders.map((r) => [r.id, r]));

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Incoming leads</h1>
          <p className="text-sm text-fg-muted">
            {leads.length} total{isDemoMode ? ' · demo mode (in-memory; resets on restart)' : ''}
          </p>
        </div>
        <a href="/api/admin/login?logout=1" className="text-sm font-semibold text-fg-muted hover:text-ink">
          Sign out
        </a>
      </div>
      <div className="mt-6">
        <AdminTable leads={leads} rendersById={rendersById} />
      </div>
    </Container>
  );
}
