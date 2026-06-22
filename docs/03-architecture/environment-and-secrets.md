> Purpose: The authoritative environment variable table — names, scope, purpose, and handling rules.

Status: draft

# Environment & Secrets

## Rules

- **`NEXT_PUBLIC_*`** are exposed to the browser. Everything else is **server-only** and must never appear in client bundles (Pitfall P11).
- Secrets live in Vercel Project Environment Variables (Production / Preview / Development) and a local `.env.local` (gitignored). Never commit secrets.
- Rotate on any suspected exposure (see [runbook.md](../07-ops/runbook.md)).

## Variable table

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client+server | yes | Canonical base URL; used in sitemap, robots, schema, absolute links |
| `SUPABASE_URL` | server (+ used to build anon client) | yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | client+server | yes | Anon key; RLS-limited public reads only |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | yes | Admin key; bypasses RLS; all `leads`/`renders` writes. NEVER client-side |
| `REPLICATE_API_TOKEN` | server only | yes (if provider=replicate) | Replicate render API |
| `FAL_KEY` | server only | only if provider=fal | Fal render API (swap target) |
| `RENDER_PROVIDER` | server only | optional | `replicate` (default) or `fal`; selects `renderCourt()` impl |
| `RESEND_API_KEY` | server only | yes | Resend transactional email |
| `OWNER_EMAIL` | server only | yes | Destination for lead alert emails |
| `LEAD_WEBHOOK_URL` | server only | yes | Make/Zapier/GHL endpoint for SMS/AI-voice/CRM |
| `LEAD_WEBHOOK_SECRET` | server only | recommended | Shared secret to sign outbound webhook (ASSUMPTION: add if target supports) |
| `RENDER_WEBHOOK_SECRET` | server only | recommended | Verify inbound provider webhook signature |
| `TWILIO_ACCOUNT_SID` | server only | optional | Direct SMS (optional) |
| `TWILIO_AUTH_TOKEN` | server only | optional | Direct SMS (optional) |
| `TWILIO_FROM_NUMBER` | server only | optional | Direct SMS sender |
| `META_PIXEL_ID` | client+server | yes | Meta Pixel + CAPI pixel id |
| `META_CAPI_TOKEN` | server only | yes | Meta Conversions API access token |
| `NEXT_PUBLIC_GA_ID` | client+server | yes | GA4 measurement id |
| `ADMIN_PASSWORD` | server only | yes (v1) | Gate for `/admin` (ADR-002) |
| `CLERK_PUBLISHABLE_KEY` | client+server | only if dashboard later | Deferred (ADR-002) |
| `CLERK_SECRET_KEY` | server only | only if dashboard later | Deferred (ADR-002) |

## `.env.example` (commit this; no real values)

```dotenv
# Site
NEXT_PUBLIC_SITE_URL=https://builtwithgrit.com

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server only — never expose

# Render provider
RENDER_PROVIDER=replicate
REPLICATE_API_TOKEN=
# FAL_KEY=                    # only if RENDER_PROVIDER=fal
RENDER_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
OWNER_EMAIL=

# Lead automation
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_FROM_NUMBER=

# Attribution
META_PIXEL_ID=
META_CAPI_TOKEN=             # server only
NEXT_PUBLIC_GA_ID=

# Admin (v1)
ADMIN_PASSWORD=

# Clerk (deferred — only if dashboard later)
# CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
```

## Client-bundle safety check (CI)

Add a build-time guard (grep/lint) that fails if any server-only secret name (especially `SUPABASE_SERVICE_ROLE_KEY`, `META_CAPI_TOKEN`, `REPLICATE_API_TOKEN`, `ADMIN_PASSWORD`) appears in the client bundle. See [ci-cd.md](../07-ops/ci-cd.md).

## Per-environment notes

| Env | Notes |
|---|---|
| Development | `.env.local`; can point at a separate Supabase project or a `dev`-prefixed bucket |
| Preview (Vercel) | Per-branch; use test Meta pixel + a sink webhook to avoid real owner alerts |
| Production | Real keys; `NEXT_PUBLIC_SITE_URL=https://builtwithgrit.com` |

→ Used by [integrations.md](./integrations.md), [api-contracts.md](./api-contracts.md), [deployment.md](../07-ops/deployment.md).
