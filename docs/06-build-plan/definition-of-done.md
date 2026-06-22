> Purpose: The global Definition of Done that gates every phase and every shippable surface.

Status: draft

# Definition of Done (Global)

A surface is "done" only when ALL of the following hold. These gate every phase in [phases.md](./phases.md).

## Code quality
- [ ] **TypeScript strict, no `any`.** No `@ts-ignore` without a justified comment.
- [ ] **All API inputs Zod-validated** (client + server share schemas where possible). See [api-contracts.md](../03-architecture/api-contracts.md).
- [ ] No `console.error`/warnings in the browser console during normal flows.
- [ ] Lint + format pass in CI.

## Performance
- [ ] **Lighthouse mobile ≥ 95** (Performance) on home, a representative city page, and the funnel pages.
- [ ] **Core Web Vitals "good"** (LCP, INP, CLS) — verified in CI/lab and tracked in field (GSC/Vercel).
- [ ] Images optimized (`next/image`), fonts via `next/font`, no render-blocking bloat.

## Accessibility
- [ ] **WCAG 2.1 AA** — passes the checklist in [accessibility.md](../05-design/accessibility.md); axe finds no violations on key templates.
- [ ] Keyboard-operable; visible focus; AA contrast; labels + alt text; reduced-motion honored.

## States & resilience
- [ ] **Every async flow has loading, empty, and error states** (estimator, previewer, admin, forms).
- [ ] Errors are user-friendly and recoverable (retry, no data loss).
- [ ] Graceful degradation for render failure (lead still captured).

## Security & privacy
- [ ] **RLS on**; no service-role key (or any server-only secret) in the client bundle — CI-checked. See [security-and-privacy.md](../03-architecture/security-and-privacy.md).
- [ ] **TCPA consent** checkbox + `sms_consent_at` on any SMS-triggering form.
- [ ] **EXIF/GPS stripped** client-side and re-verified server-side; uploads in the private bucket.
- [ ] Rate limits + size limits on the render endpoint; idempotency on POST routes.
- [ ] Privacy policy covers photo + address + SMS.
- [ ] Security headers/CSP present.

## Testing
- [ ] Vitest covers core logic (pricing math, Zod schemas, render service).
- [ ] **Playwright covers the two critical journeys: complete-a-lead and complete-a-render (including the failure path).**
- [ ] CI green on every PR.

## Responsiveness
- [ ] Works and looks correct from **320px → desktop**; tap targets ≥ 44px.

## SEO (content pages)
- [ ] Crawlable HTML (SSG/ISR), unique title/meta/H1, valid JSON-LD (Rich Results Test), correct canonical, in sitemap (if published).
- [ ] No duplicate published titles/blurbs (uniqueness lint).

## Definition-of-Done sign-off (per phase)
A phase owner checks the relevant subset above plus the phase's own exit criteria ([phases.md](./phases.md)) before marking the phase complete.
