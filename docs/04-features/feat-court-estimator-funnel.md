> Purpose: Spec the multi-step court estimator — steps, pricing logic, validation, states, and acceptance criteria.

Status: draft

# Feature: Court Estimator Funnel

Pillar 2 (conversion). A multi-step funnel that gives a credible price **range**, then captures a lead. Available at `/estimate` and embedded on home + city pages.

## User story
> As a homeowner who wants a ballpark before talking to anyone, I answer a few quick questions and get a realistic price range — then I'm comfortable sharing my contact info for a real quote.

## Steps (state machine)
See diagram in [conversion-strategy.md](../02-strategy/conversion-strategy.md).
1. **Court type** — `pickleball | basketball | multi_sport | epoxy_floor`.
2. **Size** — options depend on type, e.g. pickleball: `regulation (30x60) | compact`; basketball: `key/half | half | full`; multi-sport: `small | medium | large`; epoxy: `1-car | 2-car | 3-car`.
3. **Land condition** — `flat_ready | needs_grading | unsure`.
4. **Contact** — `full_name`, `phone` and/or `email`, optional `property_address`, **TCPA consent** checkbox.
5. **Result** — show `{min, max}` range + next steps + (optional) link into the previewer.

One decision per step; progress indicator; back navigation preserves answers.

## Pricing logic (transparent, tunable)

> ASSUMPTION: numbers below are placeholders consistent with the stated $18k–$45k job range. The owner must confirm/tune. Keep the model in one config so it's editable without touching UI.

```
base[courtType][size]  →  adjusted by landFactor[landCondition]  →  ± spread → {min,max}
```

| courtType | size | base est. |
|---|---|---|
| pickleball | regulation | $24,000 |
| pickleball | compact | $18,000 |
| basketball | half | $22,000 |
| basketball | full | $40,000 |
| multi_sport | medium | $30,000 |
| epoxy_floor | 2-car | $4,500* |

\* epoxy is lower-ticket; it may present its own range and CTA. (ASSUMPTION.)

| landCondition | factor |
|---|---|
| flat_ready | ×1.00 |
| needs_grading | ×1.20 |
| unsure | ×1.10 (and copy: "we'll confirm on site") |

`min = round(base × landFactor × 0.90)`, `max = round(base × landFactor × 1.15)`. Always a range; framed as "estimate, final quote after a free site visit" (Pitfall P4).

## Validation
- Zod schema shared client (React Hook Form) + server (`/api/leads`). See [api-contracts.md](../03-architecture/api-contracts.md).
- Contact step: at least phone or email; consent required if it will trigger SMS.
- Inline, accessible error messages.

## Submission
- On result/contact submit → `POST /api/leads` with `source: "estimator"`, `courtType`, `courtSize`, `landCondition`, `citySlug` (if embedded on a city page), `utm/fbc/fbp`, consent.
- Response returns the authoritative `{estimate}` computed server-side (don't trust client math).
- Fires GA4 `estimator_complete` and Meta `Lead` (see [feat-analytics-attribution.md](./feat-analytics-attribution.md)).

## States (every async state covered — DoD)
- **Idle/in-progress:** step UI + progress.
- **Validating:** inline field errors.
- **Submitting:** disabled button + spinner.
- **Success:** estimate range + next steps + previewer CTA → can route to `/thank-you`.
- **Error (4xx/5xx):** friendly message, retry, no data loss.
- **Empty/edge:** unknown size for type guarded by enum.

## Acceptance criteria
- [ ] Funnel works as a standalone `/estimate` page and embedded on home + city pages.
- [ ] Each step is one decision; progress + back navigation preserve answers.
- [ ] Server computes and returns the estimate range; UI shows a range, never a single number.
- [ ] Contact step enforces phone-or-email and TCPA consent (with `sms_consent_at`).
- [ ] Submit creates a `leads` row with `source="estimator"` and any `citySlug`/utm/fbc/fbp.
- [ ] GA4 funnel events fire for start, each step, and complete.
- [ ] Loading/empty/error states all present; no data loss on error.
- [ ] Pricing config is centralized and editable without UI changes.
- [ ] Zod validates client + server; TS strict, no `any`.
- [ ] WCAG 2.1 AA; keyboard-navigable; works 320px→desktop.
- [ ] Playwright "complete-a-lead" covers the full happy path.

→ Contracts [api-contracts.md](../03-architecture/api-contracts.md); pipeline [feat-lead-pipeline.md](./feat-lead-pipeline.md). Phase P4.
