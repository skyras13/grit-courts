> Purpose: Define the programmatic SEO plan, schema plan, thin-content guardrails, and sitemap/robots strategy.

Status: draft

# SEO Strategy

## Thesis

Own high-intent local queries ("[city] pickleball court builder") with a fast, unique, schema-marked page per Wasatch Front city — without tripping thin/doorway content penalties.

## Programmatic plan

- **Source of truth:** the `cities` table (see [data-model.md](../03-architecture/data-model.md)).
- **Template:** one shared city-page template (`app/utah/[city]/page.tsx`) rendered with `generateStaticParams()` over published cities, ISR `revalidate` for freshness.
- **Gating:** only `cities.published = true` rows render and enter the sitemap. Publish a city only after its row is fully populated. (Pitfall P2.)
- **Scale:** 25–30 seed cities (see seed list in [data-model.md](../03-architecture/data-model.md)); target 25–60 indexed (K1).

### Per-city page must include (uniqueness contract)

Every published city page MUST contain, interpolated from its own row:

1. **Unique `<title>`** — `Pickleball, Basketball & Sport Court Builder in {name}, UT | GRIT Courts`
2. **Unique meta description** — references `{name}`, `{county}`, and a value prop.
3. **Unique H1** — `Custom Sport Courts in {name}, Utah`
4. **Local intro `blurb`** — hand-written per city (stored in `cities.blurb`), references the `landmark` and local character. Not templated boilerplate.
5. **Local-context block** — `county`, nearby cities (internal links), and a `median_home_value`-aware line (e.g. premium-finish framing in higher-value areas).
6. **Service sections** — pickleball, basketball, multi-sport, epoxy (shared copy is fine here; the *page-level* uniqueness comes from 1–5 + 7).
7. **Local testimonials** — `testimonials` filtered to `city = {name}` where available; fall back to nearby/region.
8. **Embedded estimator + previewer CTAs.**
9. **City-scoped CTAs** — "Get a free estimate for your {name} backyard."

### Thin-content guardrails (Pitfall P1, P3)

- **Hard rule:** no two published cities may render identical `<title>` or identical `blurb`. Add a build-time lint that hashes `title` and `blurb` across published cities and fails on collision.
- **Minimum unique tokens:** each `blurb` ≥ 60 words, hand-written, mentioning the `landmark`.
- **No auto-spun paragraphs.** Service copy may be shared; the locally-variable content must be genuinely local.
- **Don't publish empty shells.** `published` stays false until 1–8 above are real.
- **Internal links, not link farms** — 3–5 contextual nearby-city links per page (IA cross-linking).

## Schema plan (JSON-LD)

| Page | Schema types |
|---|---|
| Global (all pages) | `Organization` (GRIT Courts: name, url, logo, sameAs to Angi/HomeAdvisor/FB, aggregateRating 4.8), `WebSite` |
| Home | `LocalBusiness` / `HomeAndConstructionBusiness` with NAP, `areaServed`, `aggregateRating` |
| City page | `LocalBusiness` / `Service` with `areaServed = {city, county}`, `geo` (lat/lng from row), `priceRange` ($$$), plus `BreadcrumbList`, plus `FAQPage` if a per-city FAQ exists |
| Reviews | `Review` / `aggregateRating` from `testimonials` |
| City page testimonials | `Review` nested under the business/service |
| Estimator/cost sections | `FAQPage` for cost questions |

- Emit JSON-LD server-side in each page. Validate with Google Rich Results Test in P3/P9.
- `aggregateRating` must reflect real review data (~4.8); do not fabricate counts.

## Technical SEO

- **SSG/ISR** for all content pages → fully crawlable HTML (fixes the Square client-render problem).
- **Canonical tags** self-referential on every page.
- **`/sitemap.xml`** generated from published `cities` + static routes (`app/sitemap.ts`). Excludes `/admin`, `/api`, `/thank-you`.
- **`/robots.txt`** (`app/robots.ts`): allow all content; `Disallow: /admin`, `Disallow: /api`; reference sitemap URL via `NEXT_PUBLIC_SITE_URL`.
- **`/thank-you` and `/admin`** are `noindex`.
- **Performance is SEO:** Lighthouse ≥ 95, CWV good (K10/K11) — directly affects ranking.
- **Mobile-first** indexing — design accordingly.
- **Clean metadata** via Next `generateMetadata()` per route.

## Off-page / local signals (recommendations to owner)

- Consistent NAP across Google Business Profile, Angi, HomeAdvisor, Facebook.
- Encourage reviews (feeds `aggregateRating` and trust).
- HBA membership + local press as backlinks.

## Measurement

- Verify domain in Google Search Console at launch; submit `sitemap.xml`.
- Track K1–K3 weekly/monthly (see [goals-and-kpis.md](./goals-and-kpis.md)).

→ Implemented by [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md); data in [data-model.md](../03-architecture/data-model.md).
