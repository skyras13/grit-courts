/**
 * Generates genuinely unique, locally-specific content for each city page so the
 * programmatic pages are substantive, not thin/doorway pages. Each function
 * weaves in the city's landmark, lots, neighborhoods, county, and home values.
 * See docs/02-strategy/seo-strategy.md (thin-content guardrails).
 */
import type { CitySeed } from './cities-data';
import type { Faq } from './site';
import { formatUsd } from './pricing';
import { publishedCities } from './cities-data';

export function cityIntro(city: CitySeed): string {
  return (
    `${city.blurb} Based in Provo, GRIT Courts is ${city.fromProvo} of ${city.name}, ` +
    `and we know ${city.county} yards: ${city.lots} Whether you’re near ${city.landmark} ` +
    `or in ${listNeighborhoods(city)}, we’ll design a court that fits your lot and plays true.`
  );
}

export function cityFaqs(city: CitySeed): Faq[] {
  const typicalHome = city.median_home_value ? formatUsd(city.median_home_value) : null;
  return [
    {
      q: `How much does a backyard court cost in ${city.name}?`,
      a: `It depends on the slab. Resurfacing sound existing concrete is the cheapest route; a new engineered base with surfacing, fencing and lights is the most involved. ${city.name} sites vary — ${city.lots} We give you a firm number after walking the property, not a guess from a photo.`,
    },
    {
      q: `Do you build courts throughout ${city.county}?`,
      a: `Yes. We build across ${city.county} and the wider Wasatch Front. ${city.name} is ${city.fromProvo} of our Provo base, so scheduling a consult and managing the build is easy.`,
    },
    {
      q: `What neighborhoods in ${city.name} do you serve?`,
      a: `All of them — including ${listNeighborhoods(city)}. If you’re anywhere near ${city.landmark}, we can help.`,
    },
    {
      q: `Will a court add value to my ${city.name} home?`,
      a: typicalHome
        ? `In a market where homes run around ${typicalHome}, a professionally built, permanent sport court is a standout feature buyers notice — and one the whole family uses in the meantime.`
        : `A professionally built, permanent sport court is a standout feature that buyers notice and the whole family uses.`,
    },
  ];
}

export function listNeighborhoods(city: CitySeed): string {
  const n = city.neighborhoods;
  if (n.length <= 1) return n[0] ?? city.name;
  return `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
}

/** Nearby cities for the internal-link mesh (same/adjacent county first). */
export function nearbyCities(city: CitySeed, limit = 6): CitySeed[] {
  const all = publishedCities().filter((c) => c.slug !== city.slug);
  const sameCounty = all.filter((c) => c.county === city.county);
  const others = all.filter((c) => c.county !== city.county);
  return [...sameCounty, ...others].slice(0, limit);
}
