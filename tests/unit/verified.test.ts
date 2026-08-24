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

/**
 * Every page needs exactly one h1. The old Square site had zero on every page,
 * which is a large part of why it doesn't rank — so shipping the same bug in the
 * rebuild would be embarrassing. SectionHeading defaults to h2, and a page that
 * uses it as its main title must opt into h1.
 */
describe('page headings', () => {
  it('pages that title themselves with SectionHeading pass as="h1"', async () => {
    const fs = await import('node:fs/promises');
    for (const file of ['app/about/page.tsx', 'app/service-area/page.tsx']) {
      const src = await fs.readFile(file, 'utf8');
      expect(src, `${file} must render an h1`).toContain('as="h1"');
    }
  });
});

/**
 * Headings must inherit their colour from the surface they sit on. An element
 * selector setting a fixed ink colour beats an inherited `text-white` from a
 * dark parent, which rendered the h1 on all 23 city pages at 2.1:1 contrast —
 * below the 3:1 WCAG AA floor for large text.
 */
describe('heading colour cascade', () => {
  it('global heading rule inherits rather than pinning a fixed colour', async () => {
    const fs = await import('node:fs/promises');
    const css = await fs.readFile('app/globals.css', 'utf8');
    const rule = css.match(/h1,\s*h2,\s*h3,\s*h4\s*\{[^}]*\}/)?.[0] ?? '';
    expect(rule).toContain('color: inherit');
    expect(rule).not.toMatch(/color:\s*var\(--ink\)/);
  });
});
