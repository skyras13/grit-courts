> Purpose: Document the concrete failings of the current Square Online site so the rebuild's scope is grounded in evidence.

Status: draft

# Current Site Audit — builtwithgrit.com (Square Online)

> ASSUMPTION: specific findings below are reconstructed from the brief's description of the current site plus typical Square Online behavior. Re-verify each against the live site before quoting numbers to the owner.

## Summary verdict

The current site is a brochure, not a lead engine. It is technically un-findable, conversion-dead, and unmeasured. Every one of the three improvement pillars exists because of a concrete gap below.

## Findings by category

### 1. Crawlability & SEO

| Finding | Impact | Evidence |
|---|---|---|
| Client-rendered content | Googlebot may see little/no content; slow indexing | Square Online renders much content via JS |
| No per-city pages | Zero presence for "[city] pickleball court builder" queries | Single location page only |
| No structured data (schema) | No rich results; weaker entity understanding | No JSON-LD present |
| No XML sitemap / weak robots | Discovery left to chance | Platform default only |
| Generic title/meta | Low CTR, no local relevance | Homepage title is brand-only |

→ Addressed by [seo-strategy.md](../02-strategy/seo-strategy.md) and [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md).

### 2. Conversion

| Finding | Impact |
|---|---|
| Single generic contact form | No self-qualification, no engagement, high drop-off |
| No price guidance | High-ticket buyers bounce to get a "ballpark" elsewhere |
| No interactive/visual tool | Nothing memorable; no reason to choose GRIT over a competitor |
| Form is a dead end | No instant acknowledgment, no next step |

→ Addressed by [conversion-strategy.md](../02-strategy/conversion-strategy.md), [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md), [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md).

### 3. Attribution & analytics

| Finding | Impact |
|---|---|
| No Meta CAPI | Pixel-only signal degrades (iOS/ITP); optimizer underperforms; CPL too high |
| No UTM capture on lead | Can't tell which ad/campaign produced a $30k job |
| No GA4 / event model | No funnel visibility, no completion-rate data |

→ Addressed by [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md).

### 4. Speed-to-lead

| Finding | Impact |
|---|---|
| Email-only delivery to an inbox | Hours-to-days response; lost deals to faster competitors |
| No SMS / instant alert | The single highest-leverage home-services lever is missing |

→ Addressed by [feat-lead-pipeline.md](../04-features/feat-lead-pipeline.md).

### 5. Performance & mobile

| Finding | Impact |
|---|---|
| Heavy, slow mobile load | Buyers are on phones; every second costs conversions and rank |
| Unoptimized images | Large LCP, poor CWV |
| Platform bloat | Limited control over performance budget |

→ Target: Lighthouse mobile ≥ 95, CWV "good." See [definition-of-done.md](../06-build-plan/definition-of-done.md).

## What's worth keeping

- **Brand color #2b598a (navy)** — carried forward and extended into a token palette. See [design-system.md](../05-design/design-system.md).
- **~4.8★ HomeAdvisor/Angi reputation** — surface as social proof. See [feat-social-proof.md](../04-features/feat-social-proof.md).
- **Home Builders Association membership** — a trust signal to display.
- **Existing project photos** — reuse in galleries and as render before/after examples.

## Re-verification checklist (do before the pitch)

- [ ] Run Lighthouse mobile on the live homepage; record actual scores.
- [ ] `curl` the homepage and confirm how much content renders without JS.
- [ ] Check `/robots.txt` and `/sitemap.xml` existence.
- [ ] View source for any JSON-LD.
- [ ] Search Google for `site:builtwithgrit.com` to see indexed page count.
- [ ] Search `Draper pickleball court builder` etc. and note GRIT's absence/position.
