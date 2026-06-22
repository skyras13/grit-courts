> Purpose: Document every external integration — what it does, how it's wired, failure handling, and the swap path.

Status: draft

# Integrations

| Integration | Purpose | Direction | Secret(s) |
|---|---|---|---|
| Supabase | DB + Storage + RLS | server (+anon read) | SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY |
| Replicate (primary) | img2img render | out + webhook in | REPLICATE_API_TOKEN |
| Fal (swap target) | img2img render | out + webhook in | FAL_KEY |
| Resend | owner email alerts | out | RESEND_API_KEY, OWNER_EMAIL |
| Webhook (Make/Zapier/GHL) | SMS / AI-voice / CRM | out | LEAD_WEBHOOK_URL |
| Twilio (optional) | direct SMS | out | TWILIO_* |
| Meta CAPI + Pixel | attribution | out (server) + client | META_PIXEL_ID, META_CAPI_TOKEN |
| GA4 | analytics | client | NEXT_PUBLIC_GA_ID |

## Render provider — `renderCourt()` abstraction (ADR-004)

The single seam over the image model. All callers (`/api/renders`) use it; swapping Replicate↔Fal is a one-module + one-env change. Provider/model/prompt persisted on each `renders` row.

```ts
// services/renderCourt.ts (target shape)
type RenderCourtInput = {
  imageUrl: string;            // signed URL to the private upload
  courtType: CourtType;
  webhookUrl: string;          // /api/renders/webhook
  idempotencyKey: string;
};
type RenderCourtResult = {
  provider: 'replicate' | 'fal';
  model: string;               // e.g. 'black-forest-labs/flux-dev'
  prompt: string;              // exact prompt sent
  predictionId: string;        // maps back to the renders row via webhook
};
async function renderCourt(input: RenderCourtInput): Promise<RenderCourtResult>;
```

### Replicate wiring (primary)
- Model: FLUX dev / FLUX fill img2img (DECISION ADR-005: img2img, not inpainting).
- Params: input image, `prompt`, `prompt_strength` ~0.55–0.70 (preserve yard), webhook = `/api/renders/webhook`.
- Async: create prediction, return `predictionId`; completion arrives via webhook.

### Locked architectural prompt (default), parameterized by `courtType`
```
A photorealistic, perfectly level, high-end residential outdoor {COURT_DESC},
installed cleanly into this exact backyard. Preserve the original house, fence,
trees, landscaping, lighting conditions, shadows, and camera perspective exactly.
Natural daylight, sharp focus, architectural visualization quality.
```
`{COURT_DESC}` by court type:
- `pickleball` → "pickleball court with vibrant blue and green acrylic surfacing, crisp white regulation lines, and a professional net system"
- `basketball` → "basketball court with acrylic surfacing, regulation lines, and a professional hoop system"
- `multi_sport` → "multi-sport game court with acrylic surfacing and regulation lines for pickleball and basketball"
- `epoxy_floor` → "epoxy-coated floor with a high-gloss professional finish" (applied to garage/patio context)

### Cost & latency
~$0.01–0.03 and ~5–20s per render. Persist `cost_usd` and `latency_ms` from webhook metrics.

### Swap to Fal
Implement the same `RenderCourtResult` contract against Fal, switch a `RENDER_PROVIDER` flag (or module import) and set `FAL_KEY`. No caller changes. See [maintenance.md](../08-handoff/maintenance.md).

## Resend (owner email)
- On every lead, send to `OWNER_EMAIL`: name, contact, court type/size, address, estimate range, city, and a link to the render (if any).
- Failure: logged, does not fail lead capture; retried by the queue/monitor.

## Lead webhook (Make/Zapier/GHL)
- POST the lead payload to `LEAD_WEBHOOK_URL`. The owner's automation handles SMS to owner and (consented) SMS to the lead, AI-voice, and CRM upsert.
- This is the primary speed-to-lead mechanism (K9). Payload includes consent flags so the automation only texts the lead when `sms_consent = true`.

## Twilio (optional, direct)
- If the owner prefers native SMS over the webhook, send via Twilio (`TWILIO_*`). Gated on TCPA consent. Optional for v1.

## Meta CAPI + Pixel
- **Pixel** (client) fires `Lead` with an `eventId`. **CAPI** (server, via `/api/meta-capi`) fires the same `Lead` with the same `eventId` and hashed PII + fbc/fbp → deduped by Meta, resilient to ITP/iOS.
- See [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md).

## GA4
- Client analytics for the funnel events (estimator_start/step/complete, render_start/done/failed, lead_submit). `NEXT_PUBLIC_GA_ID`.

## Failure-handling summary

| Integration | If it fails | User impact |
|---|---|---|
| Supabase insert (lead/render) | request 500 | lead path: error+retry; render path: graceful fallback |
| Replicate/Fal | render `failed` | "designer will hand-render" + lead still captured |
| Resend | logged, retried | none |
| Webhook | logged, retried/alerted | slower owner response (monitor) |
| Meta CAPI | logged | weaker attribution only |
| GA4 | silent | analytics gap only |

→ Secrets table: [environment-and-secrets.md](./environment-and-secrets.md). Monitoring: [monitoring-and-logging.md](../07-ops/monitoring-and-logging.md).
