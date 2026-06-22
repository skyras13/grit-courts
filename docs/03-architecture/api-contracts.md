> Purpose: The exact contract for every API route — Zod schema, success shape, error shapes, and idempotency.

Status: draft

# API Contracts

All routes are Next.js App Router route handlers under `app/api/`. All inputs are Zod-validated (DoD). Server-only secrets per [environment-and-secrets.md](./environment-and-secrets.md). Privileged DB writes use the service role.

## Conventions

- **Success:** `200` with `{ ok: true, ... }`.
- **Errors:** JSON `{ ok: false, error: { code, message, details? } }` with HTTP status:
  - `400` invalid input (Zod) — `code: "invalid_request"`
  - `413` payload too large (render image) — `code: "payload_too_large"`
  - `429` rate limited — `code: "rate_limited"` (+ `Retry-After`)
  - `500` server/provider error — `code: "internal_error"`
- **Idempotency:** clients send `Idempotency-Key` header (UUID) on POSTs; server stores it (e.g. on the row or a small `idempotency_keys` table) and returns the original result on replay.

---

## POST /api/leads

Validate → insert `leads` → fan out (Resend + webhook + Meta CAPI) → return estimate.

### Zod schema
```ts
const LeadInput = z.object({
  courtType: z.enum(['pickleball','basketball','multi_sport','epoxy_floor']).optional(),
  courtSize: z.string().max(64).optional(),
  landCondition: z.enum(['flat_ready','needs_grading','unsure']).optional(),
  fullName: z.string().min(1).max(120),
  phone: z.string().min(7).max(32).optional(),
  email: z.string().email().max(254).optional(),
  propertyAddress: z.string().max(256).optional(),
  citySlug: z.string().max(80).optional(),
  renderId: z.string().uuid().optional(),
  smsConsent: z.boolean().default(false),
  utm: z.object({
    source: z.string().optional(), medium: z.string().optional(),
    campaign: z.string().optional(), term: z.string().optional(),
    content: z.string().optional(),
  }).partial().default({}),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  source: z.enum(['estimator','previewer','contact']),
}).refine(d => d.phone || d.email, { message: 'phone or email required' })
  .refine(d => !d.smsConsent || !!d.phone, { message: 'phone required for SMS consent' });
```

### Behavior
1. Validate. Compute `{estimated_min, estimated_max}` from `courtType × courtSize × landCondition` (see [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md)).
2. Set `sms_consent_at = now()` if `smsConsent`.
3. Insert `leads` (service role). If `renderId` present, link it (and set `renders.lead_id`).
4. Fan out (do not block the response on third-party latency): Resend → `OWNER_EMAIL`; POST `LEAD_WEBHOOK_URL`; internal call to Meta CAPI (`/api/meta-capi`).

### Success
```json
{ "ok": true, "leadId": "uuid", "estimate": { "min": 22000, "max": 31000 } }
```

### Errors
- `400 invalid_request` — schema failure (e.g. no contact method).
- `429 rate_limited` — too many submissions from an IP.
- `500 internal_error` — DB insert failed (fan-out failures do NOT fail the request; they're logged).

### Idempotency
`Idempotency-Key` (UUID) prevents duplicate leads on retry/double-submit. Replay returns the original `{leadId, estimate}`.

---

## POST /api/renders

Accept multipart image + `courtType` → upload to `yard-uploads` → insert `renders(queued)` → kick off `renderCourt()` async → return `renderId`.

### Input (multipart/form-data)
| field | type | rules |
|---|---|---|
| `image` | file | mime ∈ {jpeg,png,webp,heic}; size ≤ 10MB (already downscaled ~1536px client-side) |
| `courtType` | string | enum court_type |

### Zod (post-parse)
```ts
const RenderInput = z.object({
  courtType: z.enum(['pickleball','basketball','multi_sport','epoxy_floor']),
});
// image validated separately: mime allowlist + size <= 10MB + server EXIF strip
```

### Behavior
1. Validate mime/size. Re-strip EXIF/GPS server-side as defense-in-depth.
2. Upload to `yard-uploads` (private) → `original_image_path`.
3. Insert `renders` with `status='queued'`, `provider`, `model`, `prompt` (locked architectural prompt, parameterized by `courtType`).
4. Call `renderCourt()` async with provider webhook → `/api/renders/webhook`. Never block on the model.

### Success
```json
{ "ok": true, "renderId": "uuid", "status": "queued" }
```

### Errors
- `400 invalid_request` — bad/missing courtType or wrong mime.
- `413 payload_too_large` — image > 10MB.
- `429 rate_limited` — abuse/cost guard.
- `500 internal_error` — upload or insert failed. (Client shows graceful fallback and still captures lead.)

### Idempotency
`Idempotency-Key` (UUID) prevents duplicate renders/charges on retry. Replay returns the original `renderId`.

---

## GET /api/renders/:id

Poll render status.

### Success
```json
{ "ok": true, "status": "queued|processing|done|failed", "renderedImageUrl": "https://.../renders/...jpg" }
```
- `renderedImageUrl` present only when `status==="done"`.
- On `failed`, include `"error"` (sanitized).

### Errors
- `400 invalid_request` — non-UUID id.
- `404` — unknown render (`code: "not_found"`).

### Notes
- Cache-Control `no-store`. Client polls ~every 2s with a max attempt cap and an overall timeout (after which it shows the graceful-fallback path even if the row is still processing).

---

## POST /api/renders/webhook

Provider callback (Replicate/Fal) → mark `done`/`failed`, store url/latency/cost.

### Security
- Verify provider signature/secret (e.g. Replicate webhook signing) or a shared secret in the webhook URL. Reject unsigned (`401 unauthorized`).

### Input (provider payload — normalized)
```ts
const RenderWebhook = z.object({
  predictionId: z.string(),         // maps to a renders row
  status: z.enum(['succeeded','failed','canceled']),
  outputUrl: z.string().url().optional(),
  metrics: z.object({ predict_time: z.number().optional() }).partial().optional(),
  error: z.string().optional(),
});
```

### Behavior
- On `succeeded`: download/copy output into `renders` bucket (public-read) → set `rendered_image_url`, `status='done'`, `latency_ms`, `cost_usd`.
- On `failed`/`canceled`: set `status='failed'`, `error`.
- Idempotent on `predictionId`: re-delivery must not double-process.

### Success
```json
{ "ok": true }
```

### Errors
- `401 unauthorized` — bad signature.
- `400 invalid_request` — unparseable payload.
- `404 not_found` — no matching render.

---

## POST /api/meta-capi

Send a server-side Meta `Lead` event with hashed PII + fbc/fbp. Usually called internally by `/api/leads`, but exposed for testing.

### Zod
```ts
const CapiInput = z.object({
  eventName: z.literal('Lead'),
  eventId: z.string(),               // dedupes with browser Pixel event
  leadId: z.string().uuid(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  value: z.number().optional(),       // e.g. estimate midpoint
  currency: z.literal('USD').default('USD'),
});
```

### Behavior
- SHA-256 hash email/phone (normalized) before sending. Send to Meta with `META_PIXEL_ID` + `META_CAPI_TOKEN`.
- Use `eventId` matching the browser Pixel event for deduplication.

### Success
```json
{ "ok": true, "fbtraceId": "..." }
```

### Errors
- `400 invalid_request` — schema failure.
- `502 upstream_error` — Meta rejected (logged; does not fail lead capture).

### Idempotency
`eventId` provides natural dedupe with the browser Pixel.

---

## Cross-references
- Data shapes: [data-model.md](./data-model.md)
- Flows: [system-architecture.md](./system-architecture.md)
- Secrets: [environment-and-secrets.md](./environment-and-secrets.md)
- External wiring: [integrations.md](./integrations.md)
