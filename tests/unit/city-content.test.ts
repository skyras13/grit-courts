import { describe, it, expect } from 'vitest';
import { CITIES } from '@/lib/cities-data';
import { cityIntro, cityFaqs, nearbyCities } from '@/lib/city-content';

describe('city data integrity', () => {
  it('has unique slugs', () => {
    const slugs = CITIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every city a landmark, blurb, lots, and neighborhoods (thin-content guard)', () => {
    for (const c of CITIES) {
      expect(c.landmark && c.landmark.length).toBeGreaterThan(3);
      expect(c.blurb && c.blurb.length).toBeGreaterThan(20);
      expect(c.lots.length).toBeGreaterThan(20);
      expect(c.neighborhoods.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('produces a unique intro per city', () => {
    const intros = CITIES.map(cityIntro);
    expect(new Set(intros).size).toBe(intros.length);
  });
});

describe('cityFaqs', () => {
  it('returns localized FAQs mentioning the city name', () => {
    const city = CITIES[0]!;
    const faqs = cityFaqs(city);
    expect(faqs.length).toBeGreaterThanOrEqual(3);
    expect(faqs.some((f) => f.q.includes(city.name))).toBe(true);
  });
});

describe('nearbyCities', () => {
  it('excludes the current city and prioritizes same-county', () => {
    const city = CITIES.find((c) => c.county === 'Utah County')!;
    const nearby = nearbyCities(city, 4);
    expect(nearby.find((c) => c.slug === city.slug)).toBeUndefined();
    expect(nearby[0]!.county).toBe('Utah County');
  });
});
