> Purpose: Master index, navigation, conventions, and live status for the GRIT Courts website rebuild planning tree.

Status: draft

# GRIT Courts — Website Rebuild Planning Docs

This `/docs` tree is the complete planning artifact for rebuilding **builtwithgrit.com**, the lead-generation website for **GRIT Courts**, a Provo, Utah custom sport-court builder (basketball, pickleball, multi-sport courts, epoxy flooring). An engineer should be able to implement the production site from these documents without guessing.

> **Project status:** This is a working demo built to pitch the GRIT Courts owner on a rebuild. The owner has not yet seen it. See [client-pitch.md](../08-handoff/client-pitch.md).

## The one-paragraph thesis

The current Square Online site is flat, client-rendered, not crawlable, has no city pages, no schema, a dead-end contact form, no attribution, and is slow on mobile. We replace it with a fast Next.js site built on three pillars: (1) **programmatic local SEO** — a unique, schema-marked page per Wasatch Front city; (2) **conversion** — a multi-step court estimator plus an "AI Backyard Previewer" that renders a finished court onto a photo of the visitor's own yard; (3) **speed-to-lead automation + attribution** — instant SMS/owner-alert on every lead and server-side Meta Conversions API events.

## Navigation

### 00 — Overview
- [README.md](./README.md) — this file
- [vision.md](./vision.md) — the product vision and north-star
- [glossary.md](./glossary.md) — shared vocabulary
- [decision-log.md](./decision-log.md) — ADRs and every open decision

### 01 — Discovery
- [current-site-audit.md](../01-discovery/current-site-audit.md)
- [pitfalls.md](../01-discovery/pitfalls.md)
- [competitive-landscape.md](../01-discovery/competitive-landscape.md)
- [target-audience.md](../01-discovery/target-audience.md)
- [keyword-research.md](../01-discovery/keyword-research.md)

### 02 — Strategy
- [goals-and-kpis.md](../02-strategy/goals-and-kpis.md)
- [information-architecture.md](../02-strategy/information-architecture.md)
- [seo-strategy.md](../02-strategy/seo-strategy.md)
- [content-strategy.md](../02-strategy/content-strategy.md)
- [conversion-strategy.md](../02-strategy/conversion-strategy.md)

### 03 — Architecture
- [tech-stack.md](../03-architecture/tech-stack.md)
- [system-architecture.md](../03-architecture/system-architecture.md)
- [data-model.md](../03-architecture/data-model.md)
- [api-contracts.md](../03-architecture/api-contracts.md)
- [integrations.md](../03-architecture/integrations.md)
- [environment-and-secrets.md](../03-architecture/environment-and-secrets.md)
- [security-and-privacy.md](../03-architecture/security-and-privacy.md)

### 04 — Features
- [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md)
- [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md)
- [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md)
- [feat-lead-pipeline.md](../04-features/feat-lead-pipeline.md)
- [feat-owner-dashboard.md](../04-features/feat-owner-dashboard.md)
- [feat-social-proof.md](../04-features/feat-social-proof.md)
- [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md)

### 05 — Design
- [design-system.md](../05-design/design-system.md)
- [components.md](../05-design/components.md)
- [page-templates.md](../05-design/page-templates.md)
- [accessibility.md](../05-design/accessibility.md)
- [motion.md](../05-design/motion.md)

### 06 — Build plan
- [phases.md](../06-build-plan/phases.md)
- [milestones.md](../06-build-plan/milestones.md)
- [task-board.md](../06-build-plan/task-board.md)
- [definition-of-done.md](../06-build-plan/definition-of-done.md)
- [testing-strategy.md](../06-build-plan/testing-strategy.md)

### 07 — Ops
- [deployment.md](../07-ops/deployment.md)
- [ci-cd.md](../07-ops/ci-cd.md)
- [monitoring-and-logging.md](../07-ops/monitoring-and-logging.md)
- [cost-model.md](../07-ops/cost-model.md)
- [runbook.md](../07-ops/runbook.md)

### 08 — Handoff
- [client-pitch.md](../08-handoff/client-pitch.md)
- [maintenance.md](../08-handoff/maintenance.md)
- [future-roadmap.md](../08-handoff/future-roadmap.md)

## Conventions

- **Every doc starts** with a one-line `> Purpose:` and a `Status: draft` line.
- **`ASSUMPTION:`** marks an invented detail that has not been confirmed with the owner or against data. Treat as provisional.
- **`OPEN DECISION:`** marks a real choice that still needs a sign-off; each is tracked in [decision-log.md](./decision-log.md) as an ADR.
- **`DECISION:`** marks a locked default chosen for v1. Override only via a logged ADR.
- **Identifiers are real:** table names, column names, route paths, and env var names in these docs are the names to use in code.
- **Diagrams** use Mermaid. Wireframes use ASCII or Mermaid.
- **Cross-links** are relative and should always resolve.

## Status summary

| Area | State | Notes |
|---|---|---|
| Discovery | drafted | Audit, audience, keywords captured |
| Strategy | drafted | IA, SEO, conversion plans set |
| Architecture | drafted | Stack locked, data model + API contracts defined |
| Features | drafted | 7 feature specs with acceptance criteria |
| Design | drafted | Tokens, components, templates, a11y |
| Build plan | drafted | 10 phases P1–P10 with entry/exit criteria |
| Ops | drafted | Deploy, CI, monitoring, cost, runbook |
| Handoff | drafted | Pitch + maintenance + roadmap |

## What's open (must resolve before/at relevant phase)

All tracked in [decision-log.md](./decision-log.md):

1. **Deployment target** — Vercel chosen vs Netlify. (Status: chosen, Vercel.)
2. **Owner dashboard** — lightweight password-gated admin for v1, Clerk deferred. (Status: decided.)
3. **Service×city matrix vs city-only** — city-only for v1 to avoid thin content. (Status: decided.)
4. **Render provider** — Replicate chosen vs Fal. (Status: chosen, Replicate, abstracted.)
5. **Plain img2img vs masked inpainting** — img2img for v1. (Status: decided.)
6. **CMS hardcode vs Sanity** — hardcode v1, Sanity later. (Status: decided.)
