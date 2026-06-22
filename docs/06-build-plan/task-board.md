> Purpose: The epic→task backlog, each task tagged to its feature doc and phase.

Status: draft

# Task Board

Epics map to features/areas; tasks are tagged `[Pn]` (phase) and link to the governing doc. Status: `todo` (default). Update as built.

## Epic A — Foundations & infra
- [ ] A1 Scaffold Next 15 + React 19 + TS strict `[P1]` → [tech-stack.md](../03-architecture/tech-stack.md)
- [ ] A2 Tailwind + token layer from design tokens `[P1]` → [design-system.md](../05-design/design-system.md)
- [ ] A3 Supabase project: tables, enums, FKs, indexes `[P1]` → [data-model.md](../03-architecture/data-model.md)
- [ ] A4 RLS policies + verify anon access `[P1]` → [security-and-privacy.md](../03-architecture/security-and-privacy.md)
- [ ] A5 Storage buckets (yard-uploads private, renders public) `[P1]` → [data-model.md](../03-architecture/data-model.md)
- [ ] A6 `.env.example` + env wiring + client-bundle secret check `[P1]` → [environment-and-secrets.md](../03-architecture/environment-and-secrets.md)
- [ ] A7 CI: lint/typecheck/test/lighthouse `[P1]` → [ci-cd.md](../07-ops/ci-cd.md)
- [ ] A8 Vercel project link + preview deploys `[P1]` → [deployment.md](../07-ops/deployment.md)

## Epic B — Design system & components
- [ ] B1 Primitives: Button/Input/Select/Checkbox/Radio/Badge/Card `[P2]` → [components.md](../05-design/components.md)
- [ ] B2 Chrome: Header/Footer/StickyMobileCTA/Breadcrumbs `[P2]`
- [ ] B3 Spinner/Skeleton/Toast/Modal `[P2]`
- [ ] B4 JsonLd component `[P2/P3]` → [seo-strategy.md](../02-strategy/seo-strategy.md)
- [ ] B5 Reduced-motion + motion tokens `[P2]` → [motion.md](../05-design/motion.md)

## Epic C — Core marketing pages
- [ ] C1 Home `[P2]` → [page-templates.md](../05-design/page-templates.md)
- [ ] C2 About / Gallery / Reviews / Contact `[P2]`
- [ ] C3 Privacy (photo+address+SMS) / Terms `[P2]` → [security-and-privacy.md](../03-architecture/security-and-privacy.md)
- [ ] C4 Thank-you (noindex, conversion events) `[P2/P7]`
- [ ] C5 Social proof: rating + HBA badges, gallery `[P2]` → [feat-social-proof.md](../04-features/feat-social-proof.md)

## Epic D — Programmatic city engine
- [ ] D1 Seed cities (rows + blurbs + facts) `[P3]` → [data-model.md](../03-architecture/data-model.md)
- [ ] D2 City template + generateStaticParams + ISR `[P3]` → [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md)
- [ ] D3 generateMetadata (unique title/meta/canonical/OG) `[P3]`
- [ ] D4 JSON-LD: LocalBusiness/Service/Breadcrumb/Review/FAQ `[P3]`
- [ ] D5 Nearby-city internal links `[P3]`
- [ ] D6 `/utah` index + CityGrid `[P3]`
- [ ] D7 sitemap.ts + robots.ts `[P3]`
- [ ] D8 Uniqueness lint (dup title/blurb) `[P3]` → [seo-strategy.md](../02-strategy/seo-strategy.md)
- [ ] D9 City testimonials with fallback `[P3]` → [feat-social-proof.md](../04-features/feat-social-proof.md)

## Epic E — Estimator
- [ ] E1 EstimatorWizard + steps + progress `[P4]` → [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md)
- [ ] E2 Pricing config module `[P4]`
- [ ] E3 Shared Zod lead schema `[P4]` → [api-contracts.md](../03-architecture/api-contracts.md)
- [ ] E4 `POST /api/leads` insert + server estimate `[P4]`
- [ ] E5 Result range + states + TCPA consent `[P4]`

## Epic F — Backyard previewer
- [ ] F1 PhotoUploader (validate/downscale/EXIF strip) `[P5]` → [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md)
- [ ] F2 `POST /api/renders` (upload, insert queued, async) `[P5]` → [api-contracts.md](../03-architecture/api-contracts.md)
- [ ] F3 `renderCourt()` Replicate impl + locked prompt `[P5]` → [integrations.md](../03-architecture/integrations.md)
- [ ] F4 `GET /api/renders/:id` poll `[P5]`
- [ ] F5 `POST /api/renders/webhook` (done/failed, store url/cost/latency) `[P5]`
- [ ] F6 BeforeAfterSlider (a11y) `[P5]` → [accessibility.md](../05-design/accessibility.md)
- [ ] F7 Graceful failure + lead capture + link render_id `[P5]`
- [ ] F8 Rate limit + size guards `[P5]` → [security-and-privacy.md](../03-architecture/security-and-privacy.md)

## Epic G — Lead pipeline & automation
- [ ] G1 Resend owner email `[P6]` → [feat-lead-pipeline.md](../04-features/feat-lead-pipeline.md)
- [ ] G2 Lead webhook fan-out (+consent flag) `[P6]`
- [ ] G3 Idempotency keys `[P6]` → [api-contracts.md](../03-architecture/api-contracts.md)
- [ ] G4 Non-blocking failure handling + retry/log `[P6]` → [monitoring-and-logging.md](../07-ops/monitoring-and-logging.md)
- [ ] G5 Optional Twilio direct SMS `[P6]`

## Epic H — Attribution & analytics
- [ ] H1 GA4 events `[P7]` → [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md)
- [ ] H2 Meta Pixel + eventId `[P7]`
- [ ] H3 `POST /api/meta-capi` hashed PII + dedupe `[P7]` → [api-contracts.md](../03-architecture/api-contracts.md)
- [ ] H4 UTM/fbc/fbp capture + persist `[P7]`

## Epic I — Owner dashboard
- [ ] I1 ADMIN_PASSWORD gate + session `[P8]` → [feat-owner-dashboard.md](../04-features/feat-owner-dashboard.md)
- [ ] I2 /admin overview `[P8]`
- [ ] I3 /admin/leads table + filters + detail + status update `[P8]`
- [ ] I4 /admin/renders table + failed surfacing `[P8]`

## Epic J — Hardening, ops, deploy
- [ ] J1 a11y audit (axe) all templates `[P9]` → [accessibility.md](../05-design/accessibility.md)
- [ ] J2 Lighthouse ≥95 sweep `[P9]` → [definition-of-done.md](./definition-of-done.md)
- [ ] J3 Security headers + CSP `[P9]` → [security-and-privacy.md](../03-architecture/security-and-privacy.md)
- [ ] J4 Monitoring/logging/alerts `[P9]` → [monitoring-and-logging.md](../07-ops/monitoring-and-logging.md)
- [ ] J5 Runbook validation (rotate key, reprocess render, add city) `[P9]` → [runbook.md](../07-ops/runbook.md)
- [ ] J6 Production deploy + GSC + sitemap submit `[P10]` → [deployment.md](../07-ops/deployment.md)
- [ ] J7 Pitch demo dry-run `[P10]` → [client-pitch.md](../08-handoff/client-pitch.md)

## Epic K — Testing (cross-cutting)
- [ ] K1 Vitest: pricing math, Zod schemas, renderCourt `[P4–P5]` → [testing-strategy.md](./testing-strategy.md)
- [ ] K2 Playwright: complete-a-lead `[P4]`
- [ ] K3 Playwright: complete-a-render (success + failure) `[P5]`
- [ ] K4 axe-in-Playwright a11y checks `[P9]`
