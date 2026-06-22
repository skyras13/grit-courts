> Purpose: Define how the app is deployed (Vercel), environments, domains, and release flow.

Status: draft

# Deployment

DECISION (ADR-001): **Vercel.** First-party Next.js 15 support, SSG/ISR, image optimization, serverless route handlers, instant preview deploys for the pitch.

## Environments

| Env | Vercel target | URL | Data | Secrets |
|---|---|---|---|---|
| Development | local | `localhost:3000` | local `.env.local` → dev Supabase | dev/test keys |
| Preview | every branch/PR | `*.vercel.app` | preview Supabase or shared dev | test Meta pixel, sink webhook ([environment-and-secrets.md](../03-architecture/environment-and-secrets.md)) |
| Production | `main` | builtwithgrit.com | prod Supabase | real keys |

> Preview deploys must NOT fire real owner alerts — point `LEAD_WEBHOOK_URL` at a sink and use a test Meta pixel.

## Domain
- ASSUMPTION (pre-pitch): demo lives on a Vercel preview/subdomain so the owner can open it on his phone (the pitch links to it).
- Post-sale: point `builtwithgrit.com` DNS to Vercel; set `NEXT_PUBLIC_SITE_URL=https://builtwithgrit.com`; enable HTTPS (automatic).

## Rendering strategy on Vercel
- City pages: `generateStaticParams` (SSG) + ISR `revalidate` → fast, crawlable, cheap.
- Marketing pages: SSG.
- API routes: serverless route handlers (region near users / Supabase).
- Image optimization via `next/image` (Vercel-native).

## Release flow
1. Branch → PR → CI ([ci-cd.md](./ci-cd.md)) → Vercel preview deploy.
2. Review preview (functionality + Lighthouse).
3. Merge to `main` → automatic production deploy.
4. Post-deploy: confirm sitemap, robots, schema, a smoke test of lead + render.

## Supabase migrations
- Migrations live in repo (`/supabase/migrations`). Apply to the target project before/with deploy (CI step or Supabase CLI). Never run destructive migrations against prod without backup.
- RLS policies and buckets are part of migration/setup; verify post-deploy (anon can read published cities only).

## Env var management
- Set per-environment in Vercel Project Settings → Environment Variables. Keep `.env.example` current.
- Server-only secrets are not `NEXT_PUBLIC_`. CI checks no secret in client bundle.

## Rollback
- Vercel: promote a previous deployment instantly. DB: forward-fix preferred; for schema, keep migrations reversible where feasible.

## Launch checklist (P10)
- [ ] Production env vars set (real keys).
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain.
- [ ] DNS → Vercel; HTTPS active.
- [ ] Migrations applied; RLS verified.
- [ ] `sitemap.xml` / `robots.txt` correct; submit sitemap in Google Search Console.
- [ ] Meta Pixel/CAPI + GA4 live (production ids).
- [ ] Smoke test: complete a lead + a render in prod (then mark/delete test lead).
- [ ] Owner alert (email + webhook) verified end-to-end.

→ CI [ci-cd.md](./ci-cd.md); monitoring [monitoring-and-logging.md](./monitoring-and-logging.md); secrets [environment-and-secrets.md](../03-architecture/environment-and-secrets.md).
