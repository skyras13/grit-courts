> Purpose: The single source of truth for architecture decisions (ADRs) and every open decision, each with context, options, recommendation, and status.

Status: draft

# Decision Log (ADRs)

Each decision below follows: **Context · Options · Recommendation · Status**. A `DECISION:` in any other doc must trace to an entry here. Status values: `open`, `chosen`, `decided`, `superseded`.

To add a new ADR: append the next number, never renumber, set status, and link from the doc that depends on it.

---

## ADR-001 — Deployment target

- **Context:** We need a host for a Next.js 15 App Router app with serverless API routes (lead intake, render orchestration, webhooks), edge-friendly static city pages, image handling, and good DX. Demo and production should be the same platform to avoid surprises.
- **Options:**
  - **A. Vercel** — first-party Next.js support, zero-config App Router, ISR/SSG, image optimization, generous hobby tier, instant preview deploys for the pitch.
  - **B. Netlify** — solid Next runtime via adapter, but historically lags on bleeding-edge Next features; image optimization and ISR semantics differ.
- **Recommendation:** Vercel. The site leans on App Router + ISR for city pages and serverless routes for the render pipeline; first-party support removes risk during a time-boxed demo.
- **Status:** **chosen — Vercel.** See [deployment.md](../07-ops/deployment.md).

## ADR-002 — Owner dashboard for v1

- **Context:** The owner needs to see and work leads, and view renders, without spreadsheet exports. But this is a pitch demo on a tight budget; a full auth provider is overkill for one user.
- **Options:**
  - **A. Lightweight password-gated admin** — single shared `ADMIN_PASSWORD` env var, server-checked, gating `/admin`. Cheap, fast, good enough for one owner.
  - **B. Clerk (or Supabase Auth)** — proper multi-user auth, roles, magic links. More setup, more env vars, more cost.
- **Recommendation:** A for v1. Defer Clerk until there are multiple users/roles or a real security requirement.
- **Status:** **decided — password-gated admin for v1; Clerk deferred.** See [feat-owner-dashboard.md](../04-features/feat-owner-dashboard.md).

## ADR-003 — Service×city matrix vs city-only pages

- **Context:** Maximum SEO surface would be one page per (service × city) pair — e.g. "basketball court installer Draper," "epoxy garage floor Draper," etc. But multiplying our four services across ~25 cities yields ~100 pages that are hard to make genuinely distinct, risking thin/doorway content and a Google penalty.
- **Options:**
  - **A. City-only** — one rich page per city covering all services, route `/utah/[city]-pickleball-court-construction`, with internal sections per service.
  - **B. Service×city matrix** — ~100 narrower pages.
- **Recommendation:** A for v1. Each city page can be made unique (landmark, median home value, county, local blurb, keyword cluster). Expand to a matrix later only if each cell can carry unique content.
- **Status:** **decided — city-only for v1.** See [seo-strategy.md](../02-strategy/seo-strategy.md), ADR-003 referenced in [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md).

## ADR-004 — Render provider

- **Context:** The Backyard Previewer needs image-to-image generation that preserves the existing yard while inserting a court. Cost target ~$0.01–0.03 and latency ~5–20s per render.
- **Options:**
  - **A. Replicate** (FLUX dev / FLUX fill) — mature API, webhooks, broad model catalog, predictable pricing.
  - **B. Fal** — fast, often cheaper, good FLUX hosting; slightly different API shape.
- **Recommendation:** Replicate as primary, **but** both are hidden behind a single `renderCourt()` service so we can swap providers by changing one module and one env var. Provider name is persisted on each `renders` row.
- **Status:** **chosen — Replicate primary, abstracted behind `renderCourt()`; Fal swappable.** See [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md) and [integrations.md](../03-architecture/integrations.md).

## ADR-005 — Plain img2img vs masked inpainting

- **Context:** Inserting a court could be done by (a) plain image-to-image with a strength that preserves the scene, or (b) inpainting where the user/model masks a ground region and only that region is regenerated.
- **Options:**
  - **A. img2img** — single image + prompt + `prompt_strength`. Simplest UX, no mask step, good enough with strength ~0.55–0.70.
  - **B. Masked inpainting** — more control, preserves untouched regions perfectly, but requires a masking UI or auto-segmentation (more build, more failure modes).
- **Recommendation:** A for v1. Tune `prompt_strength` to keep house/fence/trees/lighting/perspective. Revisit inpainting if preservation quality is insufficient.
- **Status:** **decided — img2img for v1.** See [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md).

## ADR-006 — CMS: hardcode vs Sanity

- **Context:** City data, copy, and testimonials need to live somewhere. A headless CMS (Sanity) gives the owner self-serve editing; hardcoding/seeding is faster to ship.
- **Options:**
  - **A. Hardcode/seed** — city rows seeded into the `cities` table; static copy in the repo; testimonials seeded into `testimonials`. Editing via SQL/admin.
  - **B. Sanity** — full editorial control, but another integration, schema, and cost.
- **Recommendation:** A for v1. The content set is small and stable; we control quality during the pitch. Add Sanity later if the owner wants to self-edit.
- **Status:** **decided — hardcode/seed for v1; Sanity later.** See [content-strategy.md](../02-strategy/content-strategy.md).

---

## ADR template (for future decisions)

```
## ADR-00X — <title>
- **Context:** <why this decision exists, constraints>
- **Options:** A / B / C with trade-offs
- **Recommendation:** <chosen option + reasoning>
- **Status:** open | chosen | decided | superseded (by ADR-00Y)
```
