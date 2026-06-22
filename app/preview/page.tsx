import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Eyebrow } from '@/components/ui/layout';
import { Previewer } from '@/components/previewer/previewer';
import { BeforeAfter } from '@/components/ui/before-after';
import { SAMPLE_PAIRS } from '@/lib/samples';
import { isDemoMode } from '@/lib/env';

export const metadata: Metadata = {
  title: 'AI Backyard Previewer — See Your Court Before We Pour',
  description:
    'Upload a photo of your yard and watch our AI render a finished pickleball, basketball, or multi-sport court onto your exact space in seconds.',
  alternates: { canonical: '/preview' },
};

export default function PreviewPage() {
  return (
    <>
      <Section className="court-gradient text-white">
        <Container className="text-center">
          <Eyebrow>
            <span className="text-court-200">AI Backyard Previewer</span>
          </Eyebrow>
          <h1 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold sm:text-5xl">
            See your court before we pour
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Upload one photo of your backyard, driveway, or old court. Our AI renders a
            photorealistic finished court onto your exact space — same house, same light — in
            seconds.
          </p>
        </Container>
      </Section>

      <Section className="bg-bg-muted">
        <Container>
          {isDemoMode && (
            <div className="mx-auto mb-8 max-w-3xl rounded-lg border border-court-200 bg-court-50 px-4 py-3 text-center text-sm text-court-800">
              <strong>Demo mode:</strong> previews return a sample court. Add a Replicate API key to
              render real uploads. (This banner is hidden once a provider is configured.)
            </div>
          )}
          <Previewer />
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Sample previews"
            title="What it looks like"
            intro="Real Utah yards, transformed. Drag any slider."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {SAMPLE_PAIRS.map((p) => (
              <figure key={p.id}>
                <BeforeAfter beforeSrc={p.before} afterSrc={p.after} beforeAlt={`${p.city} before`} afterAlt={`${p.city} after`} />
                <figcaption className="mt-3 text-sm text-fg-muted">
                  <span className="font-semibold text-ink">{p.city}, UT</span> — {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
