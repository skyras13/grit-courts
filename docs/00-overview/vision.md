> Purpose: Define the product vision, the problem, the north-star outcome, and what success looks like for GRIT Courts.

Status: draft

# Vision

## The business

**GRIT Courts** builds high-end custom sport courts across the Wasatch Front out of Provo, Utah: backyard pickleball courts, basketball courts (half and full), multi-sport game courts, and epoxy garage/flooring. Jobs are high-ticket — **$18,000–$45,000** — with a long-ish consideration cycle. Most leads today come from **Facebook/Meta ads** and **HomeAdvisor/Angi** (rated ~4.8★). GRIT is a member of the local Home Builders Association.

> ASSUMPTION: lead volume is roughly 200 inbound leads/month across all channels; the cost model uses this figure. Confirm with the owner.

## The problem

The current site (Square Online) actively loses money on every dimension that matters for a high-ticket home-improvement buyer:

- **Not crawlable.** Client-rendered, no per-city pages, no schema. The business is invisible for "[city] pickleball court builder" searches — exactly the high-intent, low-cost-per-lead queries it should own.
- **Dead-end conversion.** A single generic contact form. No estimator, no interactivity, nothing that helps a buyer self-qualify or get excited.
- **No attribution.** Meta ad spend flies blind — no server-side conversion signal, so the pixel can't optimize and the owner can't tell which ads produce $30k jobs.
- **No speed-to-lead.** Leads sit in an inbox. In home services, the contractor who responds first usually wins; minutes matter.
- **Slow on mobile.** The buyers are on phones in their backyards. The site is heavy and slow.

## The north-star

> **A homeowner in Draper searches "backyard pickleball court Draper," lands on a fast, locally-relevant page, uploads a photo of their own backyard, sees a photorealistic finished court rendered into it within ~15 seconds, gets an instant price range, submits — and the owner's phone buzzes within 60 seconds with the rendered image and the address attached.**

That single sentence is the product. Everything in this tree serves it.

## Three pillars

1. **Programmatic local SEO.** A unique, fast, schema-marked page for each Wasatch Front city we serve (25–30 to start). Real local detail, not doorway spam. See [seo-strategy.md](../02-strategy/seo-strategy.md) and [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md).
2. **Conversion.** Replace the dead-end form with (a) a **multi-step court estimator** that returns a credible price range and (b) the flagship **AI Backyard Previewer**. See [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md) and [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md).
3. **Speed-to-lead + attribution.** Instant SMS / AI-voice / owner-alert on every lead, plus server-side **Meta Conversions API** events and GA4. See [feat-lead-pipeline.md](../04-features/feat-lead-pipeline.md) and [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md).

## What success looks like (12 weeks post-launch)

- 25–60 city pages indexed by Google.
- Organic impressions and clicks on a clear upward 90-day trend.
- Measurable estimator completion rate and previewer engagement.
- A meaningful share of leads arrive with a render attached and an address.
- Meta cost-per-lead drops as CAPI feeds the optimizer better signal.
- Owner gets every lead on his phone in under 60 seconds.
- Lighthouse mobile ≥ 95; Core Web Vitals "good."

Full metric definitions: [goals-and-kpis.md](../02-strategy/goals-and-kpis.md).

## Non-goals for v1

- No e-commerce / online payment (jobs are quoted and signed offline).
- No customer login / account system.
- No full CMS — content is hardcoded/seeded for v1 (Sanity later). See [decision-log.md](./decision-log.md).
- No service×city matrix pages — city-only to avoid thin content. See [decision-log.md](./decision-log.md).
- No native mobile app.
