> Purpose: Enumerate the known traps for this specific project so we design around them up front instead of discovering them in production.

Status: draft

# Pitfalls & How We Avoid Them

## SEO pitfalls

### P1 — Thin / doorway city pages (highest risk)
Programmatic city pages that differ only by find-and-replace city name are doorway pages. Google's spam policies target exactly this, and a manual action would torch the entire SEO thesis.

**Avoid by:** every city page carries genuinely unique data from the `cities` row — `landmark`, `county`, `median_home_value`, a hand-written `blurb`, and a per-city `target_keywords` cluster — plus unique testimonials filtered to that city where available, and local context (nearby cities, county-level notes). Guardrails and a minimum-uniqueness checklist live in [seo-strategy.md](../02-strategy/seo-strategy.md).

### P2 — Publishing all pages at once with no content
Shipping 25–30 empty-shell pages signals low quality. **Avoid by:** the `cities.published` flag gates which pages render and appear in the sitemap. Only publish a city once its row is fully populated and the blurb is written.

### P3 — Duplicate title/meta/H1 across pages
**Avoid by:** template-level templating that always interpolates city + county + keyword, with a lint check that no two published cities produce identical `<title>`.

## Conversion / UX pitfalls

### P4 — Estimator that feels like a quote it can't honor
A too-precise number the owner can't honor erodes trust. **Avoid by:** always return a **range** (`min`–`max`) framed as an estimate, with copy like "final quote after a free site visit." See [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md).

### P5 — Render blocks the form / long spinner with no escape
A 5–20s synchronous render would feel broken and could time out the request. **Avoid by:** render is **always async** — insert `queued` immediately, return a `renderId`, poll/webhook for completion, never block the HTTP response. Graceful failure path captures the lead regardless. See [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md).

### P6 — Render mangles the user's house
If the model rebuilds the house/fence/trees, the magic dies. **Avoid by:** locked architectural prompt that explicitly preserves house/fence/trees/landscaping/lighting/shadows/perspective, plus `prompt_strength` tuned to 0.55–0.70.

### P7 — Lead lost when render fails
**Avoid by:** the lead is captured independently of the render. Render failure shows "our designer will hand-render yours and text it over" and the lead still flows to the pipeline.

## Privacy / compliance pitfalls

### P8 — Sending SMS without consent (TCPA)
Texting a lead without explicit, timestamped consent is a legal liability. **Avoid by:** a required consent checkbox on any SMS-triggering form, storing `sms_consent` + `sms_consent_at`. See [security-and-privacy.md](../03-architecture/security-and-privacy.md).

### P9 — Leaking visitor GPS via photo EXIF
Yard photos often carry GPS EXIF. Storing/exposing it is a privacy violation. **Avoid by:** strip EXIF/GPS client-side before upload and re-verify server-side; store uploads in a **private** bucket.

### P10 — Collecting addresses without disclosure
**Avoid by:** privacy policy explicitly covering photo + address collection and how renders are used.

## Security pitfalls

### P11 — Service-role key on the client
Catastrophic — bypasses all RLS. **Avoid by:** `SUPABASE_SERVICE_ROLE_KEY` is server-only; all privileged writes go through API routes; a build/lint check that the key never appears in client bundles. See [security-and-privacy.md](../03-architecture/security-and-privacy.md).

### P12 — Unbounded/abusable render endpoint (cost + spam)
Each render costs money and compute. **Avoid by:** rate limiting, file-type/size validation (≤10MB), and downscaling before upload. Returns `413` on oversize, `429` on rate limit.

## Delivery pitfalls

### P13 — Scope creep on the demo
This is a pitch. **Avoid by:** the phased roadmap (P1–P10) and v1 non-goals in [vision.md](../00-overview/vision.md); deferred items (Sanity, Clerk, service×city) are explicitly logged in [decision-log.md](../00-overview/decision-log.md).

### P14 — `any` and unvalidated input creeping in
**Avoid by:** TS strict, no `any`; every API input Zod-validated. Enforced in [definition-of-done.md](../06-build-plan/definition-of-done.md).
