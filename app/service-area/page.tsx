import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import { publishedCities } from '@/lib/cities-data';
import { COMPANY } from '@/lib/site';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Service Area — Sport Court Builder Across the Wasatch Front',
  description:
    'GRIT Courts builds custom pickleball, basketball, and multi-sport courts across Utah, Salt Lake, Wasatch, and Summit counties. Find your city.',
  alternates: { canonical: '/service-area' },
};

export default function ServiceAreaPage() {
  const cities = publishedCities();
  const byCounty = cities.reduce<Record<string, typeof cities>>((acc, c) => {
    (acc[c.county] ??= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Service Area', path: '/service-area' },
        ])}
      />
      <Section className="bg-white">
        <Container>
          <SectionHeading
          as="h1"
            eyebrow="Where we build"
            title="Serving the entire Wasatch Front"
            intro={`Based in ${COMPANY.city}, we design and install custom courts across ${COMPANY.areaServed.length} counties. Find your city below.`}
          />
          <div className="mt-12 space-y-10">
            {Object.entries(byCounty).map(([county, list]) => (
              <div key={county}>
                <h2 className="mb-4 text-xl text-brand-700">{county}</h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/utah/${c.slug}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3 font-semibold text-ink shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                      >
                        {c.name}
                        <span className="text-brand-600" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-fg-muted">Don’t see your city? We probably build there too.</p>
            <ButtonLink href="/estimate" size="lg">
              Ask about your area
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
