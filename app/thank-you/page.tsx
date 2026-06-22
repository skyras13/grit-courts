import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import { COMPANY } from '@/lib/site';
import { formatUsd } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Thanks — we’ll be in touch fast',
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const min = Number(params.min);
  const max = Number(params.max);
  const hasEstimate = Number.isFinite(min) && Number.isFinite(max) && min > 0;
  const name = typeof params.name === 'string' ? params.name : null;

  return (
    <Section className="bg-bg-muted">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-kelly-500 text-white">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl">
          {name ? `Thanks, ${name.split(' ')[0]}!` : 'You’re all set!'}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-fg-muted">
          We got your request. A member of the GRIT team will reach out shortly to confirm the
          details and schedule your free, no-obligation on-site design consult.
        </p>

        {hasEstimate && (
          <div className="mx-auto mt-8 max-w-sm rounded-xl border border-border bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-wide text-court-600">
              Your estimated range
            </p>
            <p className="mt-1 text-3xl font-extrabold text-brand-700">
              {formatUsd(min)}–{formatUsd(max)}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Final quote confirmed after your free on-site visit.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/preview" variant="court" size="lg">
            See your court in your yard
          </ButtonLink>
          <a
            href={COMPANY.phoneHref}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-brand-200 px-6 font-semibold text-brand-700 hover:bg-brand-50"
          >
            Or call {COMPANY.phone}
          </a>
        </div>
      </Container>
    </Section>
  );
}
