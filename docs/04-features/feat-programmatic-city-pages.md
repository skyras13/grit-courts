> Purpose: Spec the programmatic city-page engine — data, template, rendering, schema, and acceptance criteria.

Status: draft

# Feature: Programmatic City Pages

Pillar 1 (local SEO). One unique, fast, schema-marked page per published Wasatch Front city. DECISION (ADR-003): city-only, not service×city.

## User story
> As a homeowner searching "[my city] pickleball court builder," I land on a fast page that's clearly about my city, shows local proof and pricing, and lets me estimate or preview a court — so I trust GRIT serves my area and I take action.

## Route & rendering
- Route: `/utah/[city]-pickleball-court-construction` (public slug). Implemented as `app/utah/[city]/page.tsx` with a rewrite to add the suffix, or full-slug param — finalize in P3 (see [information-architecture.md](../02-strategy/information-architecture.md)).
- `generateStaticParams()` over `cities` where `published = true`. SSG + ISR `revalidate`.
- `generateMetadata()` per city for unique title/description/canonical/OG.

## Data
From the `cities` row ([data-model.md](../03-architecture/data-model.md)): `name`, `slug`, `county`, `landmark`, `blurb`, `lat`, `lng`, `median_home_value`, `target_keywords`, `published`. Plus `testimonials` filtered to `city = name`.

## Page sections (template)
1. **Hero** — H1 `Custom Sport Courts in {name}, Utah`, subhead with value prop, primary CTAs (Estimate / Preview), hero image.
2. **Local intro** — the hand-written `blurb` referencing `landmark`; a line tuned by `median_home_value` (premium framing in higher-value areas); `county` mention.
3. **Court types** — pickleball / basketball / multi-sport / epoxy blocks (shared copy), each with a "preview in your {name} yard" CTA.
4. **Cost** — price-range guidance + estimator embed (FAQ schema for cost Qs).
5. **Local proof** — testimonials for `{name}` (fallback to nearby/region), 4.8★, HBA badge.
6. **Service area / nearby** — 3–5 internal links to nearby published cities ("Also serving …").
7. **Final CTA** — "Get a free estimate for your {name} backyard."

## Schema (JSON-LD)
- `LocalBusiness`/`Service` with `areaServed = {name, county}`, `geo` (lat/lng), `priceRange: "$$$"`.
- `BreadcrumbList` (Home › Utah › {name}).
- `Review`/`aggregateRating` from testimonials.
- `FAQPage` for cost questions if present.
See [seo-strategy.md](../02-strategy/seo-strategy.md).

## Uniqueness contract (anti-thin, Pitfall P1)
- Unique `<title>`, meta, H1, and `blurb` per city. `blurb` ≥ 60 words, hand-written, names the landmark.
- Build-time lint fails on duplicate published `<title>` or `blurb`.
- Page renders only if `published = true` and the row is fully populated.

## States
- **Published city:** full page.
- **Unpublished/unknown slug:** `notFound()` → 404 (not in `generateStaticParams`, not in sitemap).
- **No local testimonials:** fall back to nearby/region testimonials; never show an empty section.

## Acceptance criteria
- [ ] Each published city has a page reachable at `/utah/{slug}-pickleball-court-construction`.
- [ ] All city pages are statically generated and return full HTML (crawlable) without JS.
- [ ] `<title>`, meta description, H1, and intro `blurb` are unique per city (lint-enforced).
- [ ] Valid JSON-LD: `LocalBusiness`/`Service` + `BreadcrumbList` (+ `Review`/`FAQPage` where data exists); passes Google Rich Results Test.
- [ ] Each page links to 3–5 nearby published cities.
- [ ] Unpublished/unknown city slugs 404 and are absent from `sitemap.xml`.
- [ ] `cities.published=false` excludes a city from params and sitemap.
- [ ] Lighthouse mobile ≥ 95 on a representative city page; CWV good.
- [ ] WCAG 2.1 AA (headings, contrast, alt text, focus order).
- [ ] `sitemap.xml` lists exactly the published cities + static routes.
- [ ] Adding a fully-populated published row makes its page appear after revalidate, with no code change (see [runbook.md](../07-ops/runbook.md) "add a city").

→ Depends on [data-model.md](../03-architecture/data-model.md), [seo-strategy.md](../02-strategy/seo-strategy.md), [page-templates.md](../05-design/page-templates.md). Phase P3 ([phases.md](../06-build-plan/phases.md)).
