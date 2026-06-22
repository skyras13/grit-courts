> Purpose: Shared vocabulary so every doc and every engineer uses the same terms for the same things.

Status: draft

# Glossary

| Term | Definition |
|---|---|
| **GRIT Courts** | The client business. Provo, UT custom sport-court builder. Brand site: builtwithgrit.com. |
| **Wasatch Front** | The urbanized corridor along the western edge of the Wasatch Range (Salt Lake, Utah, and Wasatch counties). Our service area. |
| **City page** | A programmatically generated, schema-marked landing page for one city we serve. Route `/utah/[city]-pickleball-court-construction`. See [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md). |
| **Programmatic SEO (pSEO)** | Generating many pages from a structured data source (the `cities` table) using a shared template, each made genuinely unique. |
| **Thin content / doorway page** | Low-value, near-duplicate pages that exist only to rank. The thing we must *avoid* while doing pSEO. See [seo-strategy.md](../02-strategy/seo-strategy.md). |
| **Estimator** | The multi-step court price estimator funnel. Collects court type, size, land condition, then contact, and returns a `{min, max}` price range. |
| **Backyard Previewer** | The flagship feature: upload a yard photo, get a photorealistic finished court rendered into it. |
| **Render** | One AI image generation job. Stored as a `renders` row. Has a lifecycle: `queued → processing → done | failed`. |
| **renderCourt()** | The single service-layer abstraction over the image-generation provider. Swappable (Replicate ↔ Fal) without touching callers. |
| **img2img** | Image-to-image generation: the model transforms an input image guided by a prompt. Our v1 approach (vs masked inpainting). |
| **prompt_strength** | How much the model is allowed to deviate from the input image (0 = identical, 1 = ignore input). We use ~0.55–0.70 to preserve the yard. |
| **Lead** | A submitted prospect. Stored as a `leads` row. Has status `new | contacted | quoted | won | lost`. |
| **Speed-to-lead** | Elapsed time from lead submission to first owner/automation contact. Target < 60s. |
| **CAPI** | Meta **Conversions API** — server-side conversion events sent to Meta to complement the browser pixel. |
| **Pixel** | The Meta browser-side tracking script. Paired with CAPI for resilient attribution. |
| **fbc / fbp** | Facebook click ID cookie (`_fbc`) and browser ID cookie (`_fbp`). Passed to CAPI for event matching. |
| **UTM** | URL campaign parameters (`utm_source`, `utm_medium`, etc.) captured for attribution and stored on the lead. |
| **TCPA** | Telephone Consumer Protection Act. Requires explicit consent (with timestamp) before sending marketing SMS. |
| **RLS** | Postgres Row-Level Security. Enforced in Supabase so client keys can't read/write privileged rows. |
| **Service role key** | Supabase admin key that bypasses RLS. **Server-only**, never shipped to the client. |
| **CWV** | Core Web Vitals (LCP, INL/INP, CLS). Must be "good." |
| **DoD** | Definition of Done. See [definition-of-done.md](../06-build-plan/definition-of-done.md). |
| **ADR** | Architecture Decision Record. See [decision-log.md](./decision-log.md). |
| **GHL** | GoHighLevel — a common home-services CRM/automation platform; one possible `LEAD_WEBHOOK_URL` target. |
| **Court type** | One of: `pickleball`, `basketball`, `multi_sport`, `epoxy_floor`. Parameterizes the estimator and render prompt. |
