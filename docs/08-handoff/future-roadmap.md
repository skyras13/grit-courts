> Purpose: Capture what's intentionally deferred past v1 and the order we'd tackle it.

Status: draft

# Future Roadmap (post-v1)

v1 ships the three pillars. These are deliberately deferred (see non-goals in [vision.md](../00-overview/vision.md) and the deferred ADRs in [decision-log.md](../00-overview/decision-log.md)). Roughly prioritized by leverage.

## Near-term (next quarter)

### R1 — Service×city matrix pages (revisit ADR-003)
Expand from city-only to (service × city) pages **only if** each cell can carry genuinely unique content. Start with the highest-volume service per city. Re-run the thin-content guardrails ([seo-strategy.md](../02-strategy/seo-strategy.md)) first.

### R2 — Blog / content engine
Target comparison + inspiration keywords ("concrete vs acrylic court," "small backyard pickleball court ideas," cost guides). Feeds internal links to city pages. Pairs well with R6 (Sanity).

### R3 — Per-city FAQ + richer schema
Hand-written FAQ per city → `FAQPage` schema → more SERP real estate and long-tail capture.

### R4 — Masked inpainting for the previewer (revisit ADR-005)
If img2img preservation quality is insufficient, add masked inpainting (auto-segment the ground region) for sharper house/yard preservation. More build; only if quality demands it.

## Mid-term

### R5 — Real owner dashboard auth (revisit ADR-002)
Move from `ADMIN_PASSWORD` to Clerk (or Supabase Auth) when there are multiple users/roles (sales staff) or a stronger security need. Add per-user activity, assignment, notes.

### R6 — Sanity CMS (revisit ADR-006)
Migrate city content, testimonials, and static copy into Sanity so the owner self-edits without code/SQL. Worth it once the content set grows or the owner wants control.

### R7 — Native SMS + two-way + AI voice
Bring SMS in-house via Twilio (two-way texting, templates) and/or an AI-voice callback agent that calls the lead within seconds — deepening the speed-to-lead edge.

### R8 — A/B testing the funnel
Test estimator step order, copy, previewer-first vs estimator-first, CTA variants — to lift K4/K5/K6.

## Longer-term / opportunistic

- **More render variety:** multiple court colors/styles per upload; "try another design."
- **Financing CTA / payment intent capture** (jobs are high-ticket; financing partners convert).
- **Seasonal/indoor content** for Park City/Heber (snow-rated, indoor courts).
- **Reviews automation:** post-job review requests to keep `aggregateRating` strong.
- **Multi-market expansion:** if GRIT expands beyond the Wasatch Front, the city engine scales by adding rows.
- **Render → quote attachment:** auto-generate a branded PDF with the render + estimate for the owner to send.

## Guiding principle
Each addition must keep the DoD bar ([definition-of-done.md](../06-build-plan/definition-of-done.md)) — fast, accessible, validated, attributable — and must not reintroduce thin content or block the lead/render flows.

→ Deferred decisions tracked in [decision-log.md](../00-overview/decision-log.md); changes via [maintenance.md](./maintenance.md).
