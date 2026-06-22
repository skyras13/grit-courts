> Purpose: Show the system components, data flows, and the request lifecycles for leads and renders.

Status: draft

# System Architecture

## Component diagram

```mermaid
graph TB
  subgraph Client["Browser (React 19)"]
    UI["City pages / Home (SSG)"]
    EST["Estimator funnel"]
    PREV["Backyard Previewer"]
    GA["GA4 + Meta Pixel"]
  end

  subgraph Vercel["Vercel (Next.js 15)"]
    SSG["SSG/ISR pages\n/utah/[city]..."]
    RL["/api/leads"]
    RR["/api/renders"]
    RRID["/api/renders/[id]"]
    RWH["/api/renders/webhook"]
    RCAPI["/api/meta-capi"]
    SVC["renderCourt() service"]
  end

  subgraph Supabase["Supabase"]
    PG[("Postgres\ncities, leads,\nrenders, testimonials")]
    UP[("Storage: yard-uploads\n(private)")]
    REN[("Storage: renders\n(public-read)")]
  end

  subgraph External["External services"]
    REPL["Replicate (FLUX img2img)"]
    RESEND["Resend (email)"]
    WH["Webhook: Make/Zapier/GHL\n(+ optional Twilio)"]
    META["Meta Conversions API"]
  end

  UI --> SSG
  SSG --> PG
  EST --> RL
  PREV --> RR
  PREV --> RRID
  RR --> UP
  RR --> SVC --> REPL
  REPL --> RWH
  RWH --> PG
  RWH --> REN
  RL --> PG
  RL --> RESEND
  RL --> WH
  RL --> RCAPI --> META
  GA --> META
```

## Component responsibilities

| Component | Responsibility |
|---|---|
| SSG/ISR pages | Render crawlable HTML for home, `/utah`, city pages, etc. from `cities`/`testimonials` |
| `/api/leads` | Validate lead (Zod), insert `leads`, fan out to Resend + webhook + Meta CAPI, return estimate |
| `/api/renders` | Validate + accept multipart image, strip-EXIF check, upload to `yard-uploads`, insert `renders(queued)`, kick off `renderCourt()` async, return `renderId` |
| `/api/renders/[id]` | Poll status for the client |
| `/api/renders/webhook` | Receive provider callback → set `done`/`failed`, store rendered URL/latency/cost |
| `/api/meta-capi` | Send server `Lead` event with hashed PII + fbc/fbp |
| `renderCourt()` | Provider-agnostic render call; returns provider/model/prompt + prediction id |
| Postgres | All structured data; RLS-enforced |
| `yard-uploads` (private) | EXIF-stripped uploads, server-access only |
| `renders` (public-read) | Finished render images for the slider/reveal |

## Trust & key boundaries

- **Client** uses only `SUPABASE_ANON_KEY` (subject to RLS) + public IDs. It can read published `cities`/`testimonials`. It cannot read/write `leads`/`renders` directly.
- **Server (Vercel functions)** uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) for all `leads`/`renders` writes. Never shipped to client (Pitfall P11).
- All third-party secrets (Replicate, Resend, Meta CAPI token, webhook URL) are server-only env vars. See [environment-and-secrets.md](./environment-and-secrets.md).

## Lead request lifecycle

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant API as /api/leads (server)
  participant DB as Supabase Postgres
  participant R as Resend
  participant W as Webhook (Make/Zapier/GHL)
  participant M as Meta CAPI

  U->>API: POST lead (Zod payload + consent + utm/fbc/fbp)
  API->>API: Zod validate, compute estimate {min,max}
  API->>DB: insert leads (service role) [idempotency key]
  DB-->>API: leadId
  par fan-out (non-blocking on response)
    API->>R: email OWNER_EMAIL (lead + render link)
    API->>W: POST lead payload (owner SMS / AI-voice)
    API->>M: server Lead event (hashed PII, fbc/fbp)
  end
  API-->>U: 200 {ok, leadId, estimate:{min,max}}
  Note over U,M: Speed-to-lead target < 60s (K9)
```

If fan-out calls fail, the lead is still persisted and the user still gets success; failures are logged and retried/alerted (see [monitoring-and-logging.md](../07-ops/monitoring-and-logging.md)).

## Render job lifecycle

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant RR as /api/renders
  participant UP as Storage yard-uploads
  participant SVC as renderCourt()
  participant P as Replicate
  participant WH as /api/renders/webhook
  participant REN as Storage renders
  participant DB as Postgres
  participant ID as /api/renders/[id]

  U->>U: validate (type/size), downscale ~1536px, strip EXIF
  U->>RR: POST multipart (image, courtType)
  RR->>UP: upload (private)
  RR->>DB: insert renders(status=queued)
  RR->>SVC: renderCourt({imageUrl, courtType, prompt})
  SVC->>P: create prediction (img2img, strength 0.55-0.70, webhook=/api/renders/webhook)
  RR-->>U: 200 {ok, renderId, status:"queued"}
  loop poll (~2s)
    U->>ID: GET /api/renders/:id
    ID->>DB: read status
    ID-->>U: {status, renderedImageUrl?}
  end
  P-->>WH: callback (succeeded|failed, output url, metrics)
  WH->>REN: store rendered image (public-read)
  WH->>DB: update renders(done/failed, url, latency_ms, cost_usd)
  Note over U: on done -> before/after slider; on failed -> graceful copy, still capture lead
```

### Render state machine

```mermaid
stateDiagram-v2
  [*] --> queued: row inserted
  queued --> processing: provider accepted
  processing --> done: webhook success + url stored
  processing --> failed: webhook failure / timeout / error
  done --> [*]
  failed --> [*]
  failed --> queued: manual reprocess (runbook)
```

→ Data structures: [data-model.md](./data-model.md). Endpoint contracts: [api-contracts.md](./api-contracts.md). External wiring: [integrations.md](./integrations.md).
