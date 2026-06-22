> Purpose: Spec social proof — testimonials, ratings, trust badges, gallery — and acceptance criteria.

Status: draft

# Feature: Social Proof

Trust is the gate on a $18k–$45k decision. Surface real proof everywhere the buyer hesitates.

## Sources of proof
- **~4.8★ HomeAdvisor/Angi rating** — display as `aggregateRating` (schema) and a visible badge. Use real counts; never fabricate (Pitfall: false schema).
- **Home Builders Association membership** — trust badge.
- **Testimonials** — `testimonials` table (`name`, `city`, `court_type`, `rating`, `quote`, `photo_url`, `published`). Real reviews only.
- **Project gallery** — real project photos; doubles as before/after examples and sets render expectations.

## Where it appears
| Surface | Proof shown |
|---|---|
| Home | Rating badge, HBA badge, top testimonials, gallery strip |
| City page | Testimonials filtered to that city (fallback nearby/region), rating, HBA |
| `/reviews` | Full testimonial list from `testimonials` where `published` |
| Estimator/Previewer | Rating + "free, no-obligation" near the contact ask (reduces friction) |
| Footer | Rating + HBA badges, NAP |

## Schema
- `Organization`/`LocalBusiness` `aggregateRating` (ratingValue ~4.8, real reviewCount).
- `Review` items from `testimonials` (author=name, reviewRating=rating, reviewBody=quote).
- City pages nest city-relevant `Review`s.
See [seo-strategy.md](../02-strategy/seo-strategy.md).

## Data & management
- Testimonials seeded into `testimonials` (DECISION ADR-006: hardcode/seed v1). `published` gates display; public read via RLS.
- City matching by `testimonials.city = cities.name`; fallback logic when a city has none.

## States (DoD)
- **Has testimonials:** carousel/grid.
- **No city testimonials:** fall back to nearby/region; never empty.
- **No photo:** graceful text-only card.

## Acceptance criteria
- [ ] Rating (~4.8★) and HBA badge appear on home, city pages, and footer.
- [ ] `/reviews` lists all `published` testimonials.
- [ ] City pages show city-matched testimonials with a sensible fallback when none exist.
- [ ] `aggregateRating` and `Review` JSON-LD reflect real data and validate in Rich Results Test.
- [ ] Gallery displays optimized real project images with alt text.
- [ ] Testimonial cards handle missing photos gracefully.
- [ ] WCAG 2.1 AA; images optimized (no Lighthouse regression below 95).

→ Data [data-model.md](../03-architecture/data-model.md); content [content-strategy.md](../02-strategy/content-strategy.md). Phase P2 (badges/gallery) + P3 (city testimonials).
