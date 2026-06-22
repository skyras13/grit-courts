import type { Metadata } from 'next';
import { Container, Section, Eyebrow } from '@/components/ui/layout';
import { Estimator } from '@/components/estimator/estimator';
import { Stars } from '@/components/ui/stars';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Court Cost Estimator — Get an Instant Price Range',
  description:
    'Answer 3 quick questions and get an honest price range for your custom pickleball, basketball, or multi-sport court in Utah. Free, no obligation.',
  alternates: { canonical: '/estimate' },
};

export default function EstimatePage() {
  return (
    <Section className="bg-bg-muted">
      <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-24">
          <Eyebrow>60-second estimate</Eyebrow>
          <h1 className="text-3xl sm:text-4xl">What will my court cost?</h1>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Answer three quick questions and we’ll show you an honest price range right away —
            then confirm it with a free, no-pressure on-site design consult.
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-card">
            <Stars value={5} />
            <p className="text-sm text-fg-muted">
              <span className="font-bold text-ink">{COMPANY.rating.value}★</span> from{' '}
              {COMPANY.rating.count}+ Utah homeowners
            </p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-fg-muted">
            <li>✓ No obligation, ever</li>
            <li>✓ Real ranges from real Utah projects</li>
            <li>✓ One crew, one warranty, end to end</li>
          </ul>
        </div>

        <Estimator />
      </Container>
    </Section>
  );
}
