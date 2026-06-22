> Purpose: Document the locked technology choices, their rationale, and the alternatives we rejected.

Status: draft

# Tech Stack

> All choices below are **locked defaults**. Override only via a logged ADR in [decision-log.md](../00-overview/decision-log.md).

## At a glance

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSG/ISR for crawlable city pages, route handlers for the lead/render pipeline, first-party Vercel support |
| UI | **React 19** | Server Components, the modern Next baseline |
| Language | **TypeScript (strict, no `any`)** | Correctness; enforced in DoD |
| Styling | **Tailwind CSS + token layer** | Fast, consistent, easy ≥95 Lighthouse; tokens carry the navy brand |
| Forms | **React Hook Form + Zod** | Performant forms + one schema reused client & server |
| Validation | **Zod** | Single source of truth for every API contract |
| DB / Storage / Auth-ish | **Supabase (Postgres + Storage + RLS)** | Managed Postgres, private/public buckets, RLS for safety, generous tier |
| Image render | **Replicate (primary), abstracted via `renderCourt()`** | Mature img2img (FLUX), webhooks; swappable to Fal |
| Email | **Resend** | Simple transactional email to owner; free tier |
| Outbound automation | **Webhook → Make/Zapier/GHL** (+ optional Twilio) | Owner SMS / AI-voice without building it all |
| Attribution | **Meta CAPI + GA4** | Server-side conversions + funnel analytics |
| Testing | **Vitest + Playwright** | Unit/integration + E2E (lead & render flows) |
| Hosting | **Vercel** | ADR-001 |

## Rationale + rejected alternatives

### Framework — Next.js 15 App Router (chosen)
- **Why:** the project is half "SEO content site" (needs SSG/ISR, fast HTML) and half "app" (lead intake, async render orchestration, webhooks). Next does both in one codebase. App Router gives Server Components, streaming, route handlers, and `generateStaticParams` for city pages.
- **Rejected — Astro:** superb for the content/SEO half, but the interactive render/estimator app surface and serverless API ergonomics are better in Next.
- **Rejected — plain Vite SPA:** would reintroduce the current site's crawlability problem.

### Styling — Tailwind + tokens (chosen)
- **Why:** rapid, consistent, tree-shaken CSS → easy performance budget; a token layer (CSS variables) carries `#2b598a` and its scale (see [design-system.md](../05-design/design-system.md)).
- **Rejected — CSS-in-JS (styled-components/emotion):** runtime cost hurts CWV; worse with RSC.
- **Considered — shadcn/ui** on top of Tailwind for primitives; acceptable, optional.

### Data — Supabase (chosen)
- **Why:** Postgres + Storage + RLS in one product. RLS lets public reads of published `cities`/`testimonials` while privileged writes (`leads`, `renders`) go only through the server service role. Private bucket for yard uploads, public bucket for renders.
- **Rejected — Firebase:** NoSQL fits our relational model worse; SQL + RLS is cleaner here.
- **Rejected — raw Postgres on a VPS:** more ops; no built-in Storage/RLS tooling.

### Render — Replicate, abstracted (chosen, ADR-004)
- **Why:** mature API, webhooks, FLUX img2img/fill models, predictable per-render cost (~$0.01–0.03), 5–20s latency. The `renderCourt()` abstraction means swapping to **Fal** is a one-module change.
- **Rejected as primary — Fal:** strong contender (often faster/cheaper), kept as the swap target behind the same interface.
- **Rejected — self-hosted diffusion:** GPU ops overkill for demo volume.

### Email — Resend (chosen)
- **Why:** minimal API, good deliverability, free tier covers owner alerts. **Rejected — SendGrid/SES:** heavier setup for this scale.

### Outbound SMS/automation — webhook first (chosen)
- **Why:** firing a single `LEAD_WEBHOOK_URL` lets the owner wire Make/Zapier/GHL (SMS, AI-voice, CRM) without us building telephony. Optional direct **Twilio** if the owner wants it native.
- **Rejected — building full telephony in-app:** unnecessary for v1.

### Testing — Vitest + Playwright (chosen)
- **Vitest** for units (estimator math, Zod schemas, render service). **Playwright** for the two critical E2E journeys: complete-a-lead and complete-a-render (including failure). See [testing-strategy.md](../06-build-plan/testing-strategy.md).

## Version pins (record actuals at scaffold, Phase P1)

> OPEN DECISION (minor): pin exact versions at scaffold time.

| Package | Target | Pinned (fill in P1) |
|---|---|---|
| next | 15.x | |
| react / react-dom | 19.x | |
| typescript | 5.x (strict) | |
| tailwindcss | 3.x/4.x | |
| zod | 3.x | |
| react-hook-form | 7.x | |
| @supabase/supabase-js | 2.x | |
| replicate | latest | |
| resend | latest | |
| vitest / @playwright/test | latest | |

→ Architecture using this stack: [system-architecture.md](./system-architecture.md).
