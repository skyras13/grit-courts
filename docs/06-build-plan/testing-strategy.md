> Purpose: Define the testing pyramid, what each layer covers, and the two mandatory E2E journeys.

Status: draft

# Testing Strategy

Tools: **Vitest** (unit/integration), **Playwright** (E2E), **@axe-core/playwright** (a11y), **Lighthouse CI** (perf). Two E2E journeys are mandatory (DoD): complete-a-lead and complete-a-render incl. failure.

## Pyramid

```
        E2E (Playwright)        <- few, critical journeys
     Integration (Vitest+msw)   <- API route handlers, render service
   Unit (Vitest)                <- pricing math, Zod schemas, utils
 Static (tsc strict, eslint)    <- types, lint, no `any`
```

## Unit (Vitest)
- **Pricing math:** `estimate(courtType,size,land)` returns expected `{min,max}` for the matrix; range always min<max; land factors applied. ([feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md))
- **Zod schemas:** accept valid, reject invalid (no contact method, bad enum, oversize, missing consent timestamp). ([api-contracts.md](../03-architecture/api-contracts.md))
- **renderCourt() builder:** prompt assembled correctly per `courtType`; provider/model fields set; prompt_strength in range. ([integrations.md](../03-architecture/integrations.md))
- **EXIF/downscale util:** strips metadata; clamps to ~1536px.
- **CAPI hashing:** email/phone normalized + SHA-256 correctly; no raw PII.

## Integration (Vitest + mocked Supabase/providers)
- `POST /api/leads`: validates, inserts (mock), computes estimate, fans out (mock Resend/webhook/CAPI), returns shape; failures in fan-out don't fail the request; idempotency replay.
- `POST /api/renders`: mime/size validation (`413`), insert queued, calls renderCourt (mock), returns renderId; rate limit (`429`).
- `GET /api/renders/:id`: returns status; 404 unknown.
- `POST /api/renders/webhook`: signature check (`401` bad), done/failed update, idempotent on predictionId.
- `POST /api/meta-capi`: hashed payload, dedupe eventId.

## E2E (Playwright) — mandatory journeys

### J1 — Complete a lead (estimator)
1. Visit `/estimate` (or home embed).
2. Select court type → size → land condition.
3. Fill contact, check TCPA consent, submit.
4. Assert: estimate range shown; `/thank-you` reachable; (mocked) `/api/leads` called with correct payload; `lead_submit` event fired.
- Also assert error path: server 500 → friendly retry, no data loss.

### J2 — Complete a render (previewer), incl. failure
1. Visit `/previewer`, pick court type, upload a fixture image.
2. Assert client validation (reject oversize/wrong type with a fixture).
3. Assert async: request returns quickly with `queued` (never blocks); polling drives UI.
4. **Success path** (mock webhook → done): before/after slider appears; submitting links `render_id`.
5. **Failure path** (mock webhook → failed/timeout): graceful fallback shows; lead still captured.

## Accessibility tests
- axe run on home, a city page, `/estimate`, `/previewer`, `/thank-you`, `/admin`; fail CI on violations.
- Manual keyboard pass of J1/J2 and the before/after slider.

## Performance tests
- Lighthouse CI (mobile) on home, city page, `/estimate`, `/previewer`; assert Performance ≥ 95, a11y high, CWV good. ([definition-of-done.md](./definition-of-done.md))

## Test data & environments
- Seed a test `cities` set + fixtures for images.
- Use Preview env with a test Meta pixel and a sink `LEAD_WEBHOOK_URL` to avoid real owner alerts.
- Mock external providers (Replicate/Resend/Meta) in unit/integration; use sandbox/test modes in E2E where feasible.

## CI gates
- PR must pass: tsc strict, eslint, vitest, playwright (J1+J2), axe, Lighthouse CI thresholds. See [ci-cd.md](../07-ops/ci-cd.md).

→ Gated by [definition-of-done.md](./definition-of-done.md); tasks K1–K4 in [task-board.md](./task-board.md).
