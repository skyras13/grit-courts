> Purpose: Estimate monthly running cost at ~200 leads/mo and define cost guards.

Status: draft

# Cost Model

Baseline assumption: **~200 leads/month** (ASSUMPTION — confirm with owner). The site is intentionally cheap to run; the main variable cost is image renders, which is tiny at this volume.

## Monthly estimate (~200 leads/mo)

| Item | Tier / basis | Est. monthly |
|---|---|---|
| Vercel | Hobby $0 → Pro $20 | **$0–$20** |
| Supabase | Free $0 → Pro $25 | **$0–$25** |
| Image renders (Replicate) | ~$0.01–0.03 × renders | **a few $** |
| Resend (email) | Free tier covers owner alerts | **$0** |
| Twilio (optional SMS) | per-message, per-use | **per-use (small)** |
| Domain | ~$12/yr | **~$1/mo** |
| Meta CAPI / GA4 | free (ad spend is separate) | **$0** |
| **Total infra** | | **~$0–$70/mo** |

> Renders: even if every lead does 1–2 renders (say 400 renders/mo) at $0.03, that's ~$12/mo. Renders are not the cost risk at this volume; abuse is (guard below).

## What scales cost
- **Renders** scale with previewer usage × retries. Guard with rate limits + size caps + idempotency (Pitfall P12).
- **Vercel/Supabase** jump to paid tiers with traffic/storage. Predictable steps ($20/$25).
- **Twilio** only if direct SMS is enabled; otherwise the owner's Make/Zapier/GHL plan carries SMS cost outside this app.

## Cost guards
- Rate-limit `POST /api/renders` (per IP / per session) → bounds render spend & abuse.
- Enforce ≤10MB + downscale before upload → cheaper, faster renders.
- Idempotency keys → no duplicate charges on retry.
- Alert if render cost/day exceeds a threshold ([monitoring-and-logging.md](./monitoring-and-logging.md)).
- Persist `cost_usd` per render → real spend is observable in `/admin/renders` and provider dashboard.

## ROI framing (for the pitch)
At $18k–$45k jobs, a single additional closed lead dwarfs annual infra cost. Infra at ~$0–$70/mo is a rounding error against one extra court sold; the CAPI-driven CPL reduction and the previewer's conversion lift are where the money is. See [client-pitch.md](../08-handoff/client-pitch.md).

## Watch list as volume grows
- Supabase storage from `yard-uploads` — purge originals per retention policy.
- Vercel function invocations/bandwidth.
- Replicate spend vs Fal (swap is a one-module change if Fal is cheaper at scale — ADR-004).

→ Guards implemented per [security-and-privacy.md](../03-architecture/security-and-privacy.md); alerts in [monitoring-and-logging.md](./monitoring-and-logging.md).
