> Purpose: How to maintain the site after launch — add cities/services, swap the render model, update copy, manage content.

Status: draft

# Maintenance

Routine changes the owner or builder will make after launch. Most content changes need no code (data-driven); a few need a small edit. Operational emergencies live in [runbook.md](../07-ops/runbook.md).

## Add a city (no code)
Follow [runbook.md](../07-ops/runbook.md) RB-3: gather facts → write a unique `blurb` → set `target_keywords` → insert `published=false` → review → `published=true` → revalidate → (optional) request indexing. The page generates automatically from the template.

## Add a service (small code change)
DECISION (ADR-003): v1 is city-only with services as sections. To add a court type:
1. Add the value to the `court_type` enum (migration) if it's a new type.
2. Add a `CourtTypeBlock` entry (copy, image, hook) in [content-strategy.md](../02-strategy/content-strategy.md)'s block set.
3. Add pricing rows to the estimator config ([feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md)).
4. Add a `{COURT_DESC}` prompt variant in `renderCourt()` ([integrations.md](../03-architecture/integrations.md)).
5. To make it a *matrix* page (service×city), revisit ADR-003 first — only if each cell can carry unique content (avoid thin pages).

## Update copy
- **City `blurb` / facts:** edit the `cities` row; revalidate.
- **Testimonials:** RB-4 in [runbook.md](../07-ops/runbook.md).
- **Static page copy** (home/about/legal): edit the repo constants/components and deploy.
- **Pricing:** edit the centralized estimator config and deploy; the UI is data-driven.
- DECISION (ADR-006): no CMS in v1. If self-serve editing becomes a need, migrate content to Sanity (future).

## Swap the render model / provider
- **Tune quality:** adjust `prompt_strength` (0.55–0.70) or the locked prompt text per `courtType` in `renderCourt()`.
- **Change model** (same provider): change the `model` string in `renderCourt()`; it's persisted per render for traceability.
- **Swap provider** (Replicate↔Fal): RB-5 in [runbook.md](../07-ops/runbook.md) — implement the Fal impl behind the same `renderCourt()` contract, set `RENDER_PROVIDER`/`FAL_KEY`, point the webhook, redeploy. No caller changes.

## Manage leads
- Day-to-day: the owner works leads in `/admin` ([feat-owner-dashboard.md](../04-features/feat-owner-dashboard.md)) — view, see renders, update status (new→contacted→quoted→won→lost).

## Rotate keys / handle incidents
- See [runbook.md](../07-ops/runbook.md): RB-1 (rotate), RB-6 (owner not getting leads), RB-7 (render abuse).

## Routine checks (monthly, recommended)
- [ ] Google Search Console: indexed city count + impressions/clicks trend (K1–K3).
- [ ] Meta Events Manager: Pixel/CAPI match quality + CPL (K7).
- [ ] GA4: estimator completion + previewer engagement (K4/K5).
- [ ] Supabase storage usage; purge old `yard-uploads` per retention policy.
- [ ] Render spend vs budget; failure rate.
- [ ] Lighthouse/CWV spot check after any content/feature change.
- [ ] Add 1–3 new fully-populated city pages to keep expanding SEO surface.

## Upgrades
- Next.js/React/deps: bump on a branch, run full CI ([ci-cd.md](../07-ops/ci-cd.md)), verify Lighthouse + E2E, then merge.

→ Procedures [runbook.md](../07-ops/runbook.md); roadmap for bigger changes [future-roadmap.md](./future-roadmap.md).
