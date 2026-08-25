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

/**
 * Design-system and navigation invariants found during the UX audit.
 */
describe('design system', () => {
  it('ships one blue, not three competing palettes', async () => {
    const fs = await import('node:fs/promises');
    const cfg = await fs.readFile('tailwind.config.ts', 'utf8');
    // `court` (cyan) and `kelly` (neon green) sat alongside `brand` (navy) and had
    // leaked into shared UI, so two unrelated blues could appear on one screen.
    expect(cfg).not.toMatch(/^\s*court:\s*\{/m);
    expect(cfg).not.toMatch(/^\s*kelly:\s*\{/m);
    expect(cfg).toMatch(/brand:\s*\{/);
  });

  it('keeps the primary CTA visible on laptop widths', async () => {
    const fs = await import('node:fs/promises');
    const header = await fs.readFile('components/site/header.tsx', 'utf8');
    // At xl (1280px) the nav and the CTA both collapsed into a hamburger, hiding
    // the quote button from every 1152px laptop. lg (1024px) keeps it on screen.
    expect(header).not.toContain('xl:flex');
    expect(header).toContain('lg:flex');
  });

  it('does not expose the hero A/B switcher to visitors', async () => {
    const fs = await import('node:fs/promises');
    const hero = await fs.readFile('components/home/home-hero.tsx', 'utf8');
    expect(hero).not.toContain('HeroToggle');
  });
});

/**
 * There must be exactly one court renderer. The homepage previously shipped a
 * separate pseudo-3D component built from CSS-transformed DOM planes, with its
 * own invented colour list ("Coastal Teal", "Night Violet") that GRIT does not
 * sell — so the court on the homepage was not the court on /design.
 */
describe('single court renderer', () => {
  it('the CSS-3D duplicate and its fictional catalogue are gone', async () => {
    const fs = await import('node:fs/promises');
    for (const dead of ['components/court/court-3d.tsx', 'lib/configurator.ts']) {
      await expect(fs.access(dead)).rejects.toThrow();
    }
  });

  it('the homepage renders through the same engine as the designer', async () => {
    const fs = await import('node:fs/promises');
    const promo = await fs.readFile('components/home/designer-promo.tsx', 'utf8');
    expect(promo).toContain('court-thumbnail');
    // Swatches must come from the real acrylic chart, never a local list.
    expect(promo).toContain('SURFACE_COLORS');
  });
});

/**
 * Shared chrome is the easiest place for an unverified claim to survive a sweep:
 * the footer kept an "HBA member" line and a prices disclaimer long after both
 * were gated everywhere else.
 */
describe('header and footer carry no ungated claims', () => {
  it('footer memberships and price disclaimer sit behind VERIFIED', async () => {
    const fs = await import('node:fs/promises');
    const footer = await fs.readFile('components/site/footer.tsx', 'utf8');
    for (const claim of ['Home Builders Association member', 'Prices shown are estimates']) {
      const idx = footer.indexOf(claim);
      expect(idx, `"${claim}" must exist only inside a VERIFIED guard`).toBeGreaterThan(-1);
      // The guard must appear within the same JSX block, just above the claim.
      expect(footer.slice(Math.max(0, idx - 220), idx)).toContain('VERIFIED.');
    }
  });

  it('does not hardcode a copyright year', async () => {
    const fs = await import('node:fs/promises');
    const footer = await fs.readFile('components/site/footer.tsx', 'utf8');
    expect(footer).toContain('getFullYear()');
  });
});
