> Purpose: Define what we log, what we monitor, and the alerts that protect leads, renders, and spend.

Status: draft

# Monitoring & Logging

The two things that must never silently fail: **a lead not reaching the owner** and **render spend running away**. Everything here protects those, plus standard app health.

## Logging

| Event | Where | Fields |
|---|---|---|
| Lead created | server log + `leads` row | leadId, source, citySlug, hasRender |
| Fan-out result | structured log | leadId, channel (resend/webhook/capi), ok/fail, latency |
| Render created | `renders` row | renderId, provider, model |
| Render completed | `renders` row + log | renderId, status, latency_ms, cost_usd |
| Render failed | `renders.error` + log | renderId, error |
| API error | structured log | route, code (400/413/429/500), message (sanitized) |
| Rate limit hit | log | route, ip-ish key |
| Webhook auth fail | log | route, reason |

- No PII in logs beyond what's necessary; never log raw secrets or full card-like data. Hash/redact contact info in logs.
- Use structured (JSON) logs so they're queryable (Vercel logs / a log drain).

## Monitoring & dashboards

- **Vercel Analytics / Speed Insights** — CWV field data (K11), traffic.
- **GA4** — funnel + engagement (K4/K5/K6/K8).
- **Meta Events Manager** — Pixel+CAPI match quality, CPL (K7).
- **Supabase** — DB health, storage usage, row counts.
- **Provider dashboards** — Replicate usage/cost; Resend deliverability.

## Alerts (recommended)

| Condition | Severity | Action |
|---|---|---|
| Owner notification (webhook) failed for a lead | **high** | Alert builder/owner immediately; retry; manual relay (runbook) |
| Lead insert error rate spike | high | Page builder; check Supabase/route |
| Render failure rate > threshold (e.g. >20% over 1h) | medium | Check provider status; consider Fal swap |
| Render cost/day > budget threshold | medium | Investigate abuse; tighten rate limit |
| API 5xx spike | high | Investigate route/provider |
| Lighthouse/CWV regression (field) | low | Triage perf |
| Webhook signature failures spike | medium | Possible attack; review |

> ASSUMPTION: alert delivery is via the owner's automation (email/SMS) or a simple Slack/email hook the builder sets up. Wire at P9.

## Speed-to-lead measurement (K9)
- Record timestamp at `leads` insert and at first successful webhook/email delivery; the delta is speed-to-lead. Surface in `/admin` overview or logs; alert if > 60s consistently.

## Health checks
- A lightweight `/api/health` (optional) returning DB connectivity + provider reachability for uptime monitoring.

## Retention
- App logs: platform default. Align upload retention with the privacy policy ([security-and-privacy.md](../03-architecture/security-and-privacy.md)).

→ Runbook responses [runbook.md](./runbook.md); cost thresholds [cost-model.md](./cost-model.md).
