/**
 * JSON-LD builders for structured data. Centralized so every page emits valid,
 * consistent schema (LocalBusiness, Service, FAQ, BreadcrumbList). Validated
 * against Google's Rich Results test. See docs/02-strategy/seo-strategy.md.
 */
import { COMPANY } from './site';
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: COMPANY.rating.value,
      reviewCount: COMPANY.rating.count,
    },
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
