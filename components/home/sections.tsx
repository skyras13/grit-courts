import { Container, Section, SectionHeading, Eyebrow } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import { BeforeAfter } from '@/components/ui/before-after';
import { Stars } from '@/components/ui/stars';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { SERVICES, TESTIMONIALS, GLOBAL_FAQS, COMPANY } from '@/lib/site';
import { SAMPLE_PAIRS } from '@/lib/samples';

// ── Trust bar ────────────────────────────────────────────────────────────────
export function TrustBar() {
  const stats = [
    { label: 'Courts built', value: `${COMPANY.rating.count}+` },
    { label: 'Avg. rating', value: `${COMPANY.rating.value}★` },
    { label: 'Counties served', value: '4' },
    { label: 'Year founded', value: `${COMPANY.foundingYear}` },
  ];
  return (
    <div className="border-b border-border bg-bg-muted">
      <Container className="grid grid-cols-2 gap-6 py-7 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-extrabold text-brand-700">{s.value}</div>
            <div className="text-sm text-fg-muted">{s.label}</div>
          </div>
        ))}
      </Container>
    </div>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
export function Services() {
  return (
    <Section id="services" className="bg-white">
      <Container>
        <SectionHeading
          eyebrow="What we build"
          title="One crew. Every kind of court."
          intro="From a weekend pickleball court to a full multi-sport showpiece — designed, poured, and surfaced by one team, backed by one warranty."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <article
              key={s.slug}
              className="group flex flex-col rounded-xl border border-border bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <h3 className="text-xl">{s.name}</h3>
              <p className="mt-1 text-sm font-semibold text-court-600">{s.priceFrom}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{s.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check /> {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/estimate" size="lg">
            Price my court
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

// ── Previewer teaser ─────────────────────────────────────────────────────────
export function PreviewerTeaser() {
  return (
    <Section className="bg-bg-muted">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>The GRIT difference</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">Watch your yard become a court.</h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Stop imagining. Upload one photo and our AI Backyard Previewer renders a
            photorealistic finished court onto your exact space — same house, same trees,
            same light — in about ten seconds. Then we text you the design and a price.
          </p>
          <ol className="mt-6 space-y-3">
            {[
              'Snap or upload a photo of your yard, driveway, or old court',
              'Pick a court type — pickleball, basketball, or multi-sport',
              'See the finished court rendered onto your space, instantly',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-fg-muted">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <ButtonLink href="/preview" variant="court" size="lg" className="font-bold">
              Try the previewer free →
            </ButtonLink>
          </div>
        </div>
        <BeforeAfter
          beforeSrc={SAMPLE_PAIRS[1]!.before}
          afterSrc={SAMPLE_PAIRS[1]!.after}
          beforeAlt="Backyard before"
          afterAlt="Backyard with a multi-sport court"
        />
      </Container>
    </Section>
  );
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export function Gallery() {
  return (
    <Section id="gallery" className="bg-white">
      <Container>
        <SectionHeading
          eyebrow="Before & after"
          title="Real yards. Real transformations."
          intro="Drag any slider to see the GRIT difference. Every one of these started as someone's backyard."
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
  );
}

// ── Social proof ─────────────────────────────────────────────────────────────
export function Proof() {
  return (
    <Section id="proof" className="bg-bg-muted">
      <Container>
        <SectionHeading
          eyebrow="What homeowners say"
          title={`Rated ${COMPANY.rating.value}★ across the Wasatch Front`}
          intro="High-ticket projects, done right the first time."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.id} className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-card">
              <Stars value={t.rating} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">“{t.quote}”</p>
              <footer className="mt-4 text-sm">
                <span className="font-bold text-ink">{t.name}</span>
                <span className="text-fg-muted"> · {t.city}, UT</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function Faqs() {
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeading eyebrow="Good questions" title="Everything you’re wondering" />
        <div className="mt-10">
          <FaqAccordion faqs={GLOBAL_FAQS} />
        </div>
      </Container>
    </Section>
  );
}

// ── Final CTA ────────────────────────────────────────────────────────────────
export function FinalCta() {
  return (
    <Section className="court-gradient text-white">
      <Container className="text-center">
        <h2 className="text-3xl text-white sm:text-4xl">Ready to play in your own backyard?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
          Preview your court in seconds, get an honest price range, and book a free on-site
          design consult. No pressure, no obligation.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/preview" variant="court" size="lg" className="font-bold">
            Preview my backyard
          </ButtonLink>
          <ButtonLink href="/estimate" size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20">
            Get my estimate
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

function Check() {
  return (
    <svg className="mt-0.5 shrink-0 text-kelly-500" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
