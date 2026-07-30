# GRIT Courts — Lead-Gen Platform

A fast, locally-dominant lead-generation site for **GRIT Courts**, a Utah custom sport-court
builder. Replaces a flat Square Online brochure with three engines:

1. **Programmatic local SEO** — a unique, schema-marked page for every Wasatch Front city.
2. **Conversion** — a multi-step court **estimator** and the flagship **AI Backyard Previewer**
   (“see your court before we pour”).
3. **Speed-to-lead + attribution** — instant owner email / webhook / SMS on every lead, plus a
   server-side Meta Conversions API event.

Built with **Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind · Supabase ·
Zod**. Full planning lives in [`/docs`](./docs).

---

## Runs out of the box (demo mode)

The app is designed to run **with zero external services** so you can demo it immediately:

- No database → leads/renders persist in memory for the server session.
- No render provider → the previewer returns a polished sample court (`RENDER_PROVIDER=mock`).
- No email/webhook/CAPI → those steps no-op cleanly.

```bash
npm install
cp .env.example .env.local   # optional — defaults are fine for demo mode
npm run dev                  # http://localhost:3400
```

Key routes: `/` · `/preview` · `/estimate` · `/service-area` · `/utah/draper` (and every city) ·
`/admin` (password = `ADMIN_PASSWORD`, default `change-me-please`).

---

## Going live (wire the real services)

Fill these in `.env.local` (see [`.env.example`](./.env.example) and
[`docs/03-architecture/environment-and-secrets.md`](./docs/03-architecture/environment-and-secrets.md)):

| Capability | Env vars | Notes |
|---|---|---|
| Database + Storage | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Run `supabase/migrations/0001_init.sql`, then `npm run db:seed` |
| AI render | `RENDER_PROVIDER=replicate`, `REPLICATE_API_TOKEN` | Swappable via `lib/render` (Fal also supported) |
| Email | `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL` | Owner + homeowner notifications |
| Automation | `LEAD_WEBHOOK_URL` (+ optional `TWILIO_*`) | Make/Zapier/GHL + SMS |
| Attribution | `META_PIXEL_ID`, `META_CAPI_TOKEN`, `NEXT_PUBLIC_GA_ID` | Server-side Lead event + GA4 |
| Admin | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | v1 password gate |

Every feature checks a capability flag (`lib/env.ts`) and degrades gracefully if a key is absent.

---

## Deploy to Vercel

The app builds zero-config on Vercel and **runs in demo mode with no environment variables**, so you can ship the pitch link in ~2 minutes and add keys later.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/skyras13/grit-courts)

**Fastest path (GitHub import):**
1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. **Import** the `skyras13/grit-courts` repo.
3. Framework = **Next.js** (auto-detected). Leave build/output settings as-is.
4. Click **Deploy**. You get a live `*.vercel.app` URL to send to the owner.

**Or from the CLI (one-time login):**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Add env vars later** (Vercel → Project → Settings → Environment Variables) using the table above — start with `ADMIN_PASSWORD` + `NEXT_PUBLIC_SITE_URL`, then Supabase, Resend, and `REPLICATE_API_TOKEN` (set `RENDER_PROVIDER=replicate`) to turn on the real AI previewer. Redeploy after adding keys.

**Custom domain:** Vercel → Project → Settings → Domains → add `builtwithgrit.com` (or a subdomain like `new.builtwithgrit.com`) and point DNS as shown. Then set `NEXT_PUBLIC_SITE_URL` to the final URL so canonical tags + the sitemap are correct.

---

## Architecture at a glance

```
app/                 routes (home, preview, estimate, utah/[city], admin, api/*)
components/          UI primitives, brand, home sections, estimator, previewer, admin
lib/                 env, types, schemas, pricing, render abstraction, repo, integrations
supabase/migrations  SQL schema + RLS + buckets
scripts/seed.ts      seed cities + testimonials
tests/unit           Vitest (pricing, schemas, prompt, city content)
tests/e2e            Playwright (estimator lead, previewer render+fallback)
docs/                full planning tree (46 files)
```

- **`renderCourt()`** (`lib/render`) is the single swappable model interface.
- **`repo.ts`** unifies Supabase and the in-memory demo store behind one API.
- **Leads** are validated with Zod, priced server-side, then fan out to notifications + CAPI.

## Scripts

```bash
npm run dev         # dev server on :3400
npm run build       # production build
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint
npm test            # vitest unit tests
npm run test:e2e    # playwright (builds + starts on :3401)
npm run db:seed     # seed Supabase from static data
```

## Customizing

- **Add a city:** append to `CITIES` in `lib/cities-data.ts` (and re-seed if using a DB).
  The page, sitemap, and internal links update automatically.
- **Edit copy / services / testimonials:** `lib/site.ts`.
- **Swap the logo:** replace `components/brand/logo.tsx` (placeholder SVG in brand navy `#2b598a`).
- **Swap the render model:** set `RENDER_PROVIDER` / `REPLICATE_MODEL`, or add a provider in
  `lib/render/index.ts`.

See [`docs/08-handoff/maintenance.md`](./docs/08-handoff/maintenance.md).

---

> **Note:** The logo and some company details (phone, address, founding year, exact review count)
> are placeholders flagged in `lib/site.ts` — swap in the real values before pitching.
