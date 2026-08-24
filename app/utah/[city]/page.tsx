import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container, Section, SectionHeading, Eyebrow } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import { BeforeAfter } from '@/components/ui/before-after';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { Stars } from '@/components/ui/stars';
import { getAllCitySlugs, getCity } from '@/lib/cities';
import { cityIntro, cityFaqs, nearbyCities } from '@/lib/city-content';
import { SERVICES, COMPANY, TESTIMONIALS } from '@/lib/site';
import { VERIFIED } from '@/lib/verified';
import { HERO_PAIR } from '@/lib/samples';
import Image from 'next/image';
import {
  JsonLd,
  localBusinessJsonLd,
  serviceJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo';
import { siteUrl } from '@/lib/env';

// Static generation + ISR: build every city page, revalidate daily.
export const dynamicParams = false;
export const revalidate = 86_400;

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = await getCity(slug);
  if (!city) return {};
  const title = `${city.name} Pickleball & Sport Court Builder | GRIT Courts`;
  const description = `Custom backyard pickleball, basketball, and multi-sport court construction in ${city.name}, ${city.county}. See your court in a photo of your own yard, then book a free on-site estimate.`;
  const canonical = `${siteUrl}/utah/${city.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = await getCity(slug);
  if (!city) notFound();

  const faqs = cityFaqs(city);
  const nearby = nearbyCities(city);
  const testimonials = VERIFIED.testimonials
    ? TESTIMONIALS.filter((t) => t.city === city.name).slice(0, 3)
    : [];

  return (
    <>
      <JsonLd data={localBusinessJsonLd(city)} />
      <JsonLd data={serviceJsonLd('Sport Court Construction', city.name)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Service Area', path: '/service-area' },
          { name: city.name, path: `/utah/${city.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="court-gradient text-white">
        <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2">
          <div>
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-100">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="px-1.5">/</span>
              <Link href="/service-area" className="hover:underline">Service Area</Link>
              <span className="px-1.5">/</span>
              <span className="text-white">{city.name}</span>
            </nav>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-semibold">
              {VERIFIED.rating && <><Stars value={5} className="text-brand-200" /> {COMPANY.rating.value}★ ·</>} {city.county}
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
              Custom Sport Courts in {city.name}, Utah
            </h1>
            <p className="mt-4 max-w-xl text-lg text-brand-100">
              Backyard pickleball, basketball, and multi-sport courts built for {city.name}{' '}
              homes — engineered, level, and made to last.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/preview" variant="court" size="lg" className="font-bold">
                Preview a court in {city.name}
              </ButtonLink>
              <ButtonLink href="/estimate" size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20">
                Get a free estimate
              </ButtonLink>
            </div>
          </div>
          {/* A before/after slider asserts both frames are the same property.
              Until the owner supplies genuine matched pairs we show one real
              photo instead of implying a transformation we can't evidence. */}
          {VERIFIED.beforeAfter ? (
            <BeforeAfter
              beforeSrc={HERO_PAIR.before}
              afterSrc={HERO_PAIR.after}
              beforeAlt={`A backyard in ${city.name} before a court`}
              afterAlt={`A finished court in ${city.name}`}
            />
          ) : (
            <figure className="relative overflow-hidden rounded-xl shadow-lift" style={{ aspectRatio: '4 / 3' }}>
              <Image
                src={HERO_PAIR.after}
                alt={`A finished GRIT court, the kind we build for ${city.name} homes`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          )}
        </Container>
      </section>

      {/* Local intro — unique per city */}
      <Section className="bg-white">
        <Container className="max-w-3xl">
          <Eyebrow>Local builders for {city.name}</Eyebrow>
          <h2 className="text-3xl">Courts built for {city.name} yards</h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">{cityIntro(city)}</p>
        </Container>
      </Section>

      {/* Services */}
      <Section className="bg-bg-muted">
        <Container>
          <SectionHeading
            eyebrow={`What we build in ${city.name}`}
            title={`Court options for ${city.name} homeowners`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <article key={s.slug} className="rounded-xl border border-border bg-white p-6 shadow-card">
                <h3 className="text-lg">{s.name}</h3>
                {VERIFIED.prices && <p className="mt-1 text-sm font-semibold text-brand-600">{s.priceFrom}</p>}
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{s.short}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials — rendered only when we have a real, attributable review */}
      {testimonials.length > 0 && (
      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Trusted nearby" title={`What ${city.county} homeowners say`} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="rounded-xl border border-border bg-white p-6 shadow-card">
                <Stars value={t.rating} />
                <p className="mt-3 text-sm leading-relaxed text-ink">“{t.quote}”</p>
                <footer className="mt-4 text-sm font-bold text-ink">
                  {t.name} <span className="font-normal text-fg-muted">· {t.city}, UT</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>
      )}

      {/* Local FAQ */}
      <Section className="bg-bg-muted">
        <Container>
          <SectionHeading eyebrow="FAQ" title={`Building a court in ${city.name}`} />
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </Section>

      {/* Nearby cities — internal link mesh */}
      <Section className="bg-white">
        <Container>
          <h2 className="text-2xl">We also build near {city.name}</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {nearby.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/utah/${c.slug}`}
                  className="inline-block rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  {c.name} courts
                </Link>
              </li>
            ))}
            <li>
              <Link href="/service-area" className="inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                All service areas →
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="court-gradient text-white">
        <Container className="text-center">
          <h2 className="text-3xl text-white">Ready for a court in {city.name}?</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            See it in your yard, then book a free on-site estimate.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/preview" variant="court" size="lg" className="font-bold">
              Preview my backyard
            </ButtonLink>
            <ButtonLink href="/estimate" size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20">
              Get my estimate
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
