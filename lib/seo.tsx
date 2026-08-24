/**
 * JSON-LD builders for structured data. Centralized so every page emits valid,
 * consistent schema (LocalBusiness, Service, FAQ, BreadcrumbList). Validated
 * against Google's Rich Results test. See docs/02-strategy/seo-strategy.md.
 */
import type { Metadata } from 'next';
import { COMPANY } from './site';
import { VERIFIED } from './verified';
import { siteUrl } from './env';
import type { Faq } from './site';
import type { CitySeed } from './cities-data';

export function localBusinessJsonLd(city?: CitySeed) {
  const name = city ? `${COMPANY.name} — ${city.name}, UT` : COMPANY.name;
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${siteUrl}/#business${city ? `-${city.slug}` : ''}`,
    name,
    image: `${siteUrl}/og-default.png`,
    url: city ? `${siteUrl}/utah/${city.slug}` : siteUrl,
    telephone: COMPANY.phone,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: COMPANY.city,
      addressRegion: COMPANY.region,
      postalCode: COMPANY.postalCode,
      addressCountry: 'US',
    },
    ...(city?.lat && city?.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng } }
      : {}),
    areaServed: (city ? [city.name, city.county] : COMPANY.areaServed).map((n) => ({
      '@type': 'Place',
      name: n,
    })),
    // Never publish a rating we cannot evidence — fake review schema is a Google
    // spam-policy violation and can get the whole domain demoted.
    ...(VERIFIED.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: COMPANY.rating.value,
            reviewCount: COMPANY.rating.count,
          },
        }
      : {}),
    sameAs: [COMPANY.social.facebook, COMPANY.social.instagram],
  };
}

export function serviceJsonLd(serviceName: string, areaName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceName,
    provider: { '@type': 'GeneralContractor', name: COMPANY.name },
    areaServed: { '@type': 'Place', name: areaName },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user-controlled HTML).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Page metadata with a canonical URL and full Open Graph / Twitter tags.
 *
 * The live Square site ships no canonical at all and has four pages with no
 * <title> whatsoever, which is a large part of why it doesn't rank. Routing every
 * page through one helper makes that class of bug impossible.
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${opts.path === '/' ? '' : opts.path}`;
  const image = opts.image ?? '/photos/court-01.jpg';
  return {
    // absolute: the root layout appends "| GRIT Courts" via its template, and
    // callers already supply a fully-formed title.
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url,
      siteName: COMPANY.name,
      title: opts.title,
      description: opts.description,
      images: [{ url: `${siteUrl}${image}`, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [`${siteUrl}${image}`],
    },
  };
}
