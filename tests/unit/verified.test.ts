import { describe, it, expect } from 'vitest';
import { VERIFIED } from '@/lib/verified';
import { localBusinessJsonLd } from '@/lib/seo';
import { COMPANY } from '@/lib/site';

/**
 * This site represents a real business. Star ratings, review counts, trade
 * memberships and prices are all claims the owner can be held to — by the FTC,
 * by Google's spam policies, and by a customer standing in their driveway.
 *
 * These tests exist so a demo placeholder can never quietly ship as a public
 * claim. Flipping a flag to true is a deliberate act that says "the owner gave
 * me the real number".
 */
describe('unverified claims never publish', () => {
  it('every claim flag defaults to off', () => {
    expect(VERIFIED.rating).toBe(false);
    expect(VERIFIED.memberships).toBe(false);
    expect(VERIFIED.prices).toBe(false);
    expect(VERIFIED.testimonials).toBe(false);
  });

  it('LocalBusiness schema omits AggregateRating while the rating is unverified', () => {
    const ld = localBusinessJsonLd() as Record<string, unknown>;
    expect(ld.aggregateRating).toBeUndefined();
  });

  it('still emits the parts of the schema that are true', () => {
    const ld = localBusinessJsonLd() as Record<string, unknown>;
    expect(ld['@type']).toBeTruthy();
    expect(ld.name).toBe(COMPANY.name);
    expect(ld.areaServed).toBeTruthy();
  });

  it('publishes no phone number until a real one is supplied', () => {
    // A placeholder number breaks local-search NAP consistency and strands callers.
    expect(COMPANY.phone).not.toMatch(/555-?01|555-?5555/);
  });
});
