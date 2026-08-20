import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import { getContent } from '@/lib/cms/store';
import { secretStatuses } from '@/lib/cms/secrets';
import { isDemoMode } from '@/lib/env';
import { Container } from '@/components/ui/layout';
import { CmsEditor } from '@/components/admin/cms-editor';

export const metadata: Metadata = {
  title: 'Manage your site',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ManageSitePage() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(ADMIN_COOKIE)?.value)) redirect('/admin');

  const [content, secrets] = await Promise.all([getContent(), secretStatuses()]);

  return (
    <Container className="py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-muted-faint">Owner dashboard</p>
          <h1 className="font-display text-[clamp(24px,3vw,34px)] font-extrabold leading-tight">Manage your site</h1>
          <p className="mt-1.5 max-w-[560px] text-[14px] text-muted">
            Everything here goes live the moment you publish. No developer, no waiting.
          </p>
        </div>
        <Link href="/admin" className="rounded-md border-[1.5px] border-muted-input px-4 py-2.5 text-[13.5px] font-bold hover:border-brand-300">
          ← Back to leads
        </Link>
      </div>
      <CmsEditor initialContent={content} initialSecrets={secrets} demoMode={isDemoMode} />
    </Container>
  );
}
