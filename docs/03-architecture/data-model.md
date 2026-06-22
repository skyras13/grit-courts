> Purpose: The complete data model — table DDL, RLS policies, storage buckets, and the seed city list.

Status: draft

# Data Model (Supabase / Postgres)

Tables: `cities`, `leads`, `renders`, `testimonials`. Storage buckets: `yard-uploads` (private), `renders` (public-read). RLS on for all tables.

## ENUM types

```sql
create type court_type as enum ('pickleball', 'basketball', 'multi_sport', 'epoxy_floor');
create type lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
create type render_status as enum ('queued', 'processing', 'done', 'failed');
```

## Table: `cities`

```sql
create table public.cities (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,            -- e.g. 'draper'
  name              text not null,                   -- 'Draper'
  county            text not null,                   -- 'Salt Lake County'
  landmark          text not null,                   -- recognizable local landmark
  blurb             text not null,                   -- hand-written, >=60 words (uniqueness contract)
  lat               double precision,
  lng               double precision,
  median_home_value integer,                         -- USD, for premium-finish framing
  target_keywords   text[] not null default '{}',    -- six-keyword cluster
  published         boolean not null default false,  -- gates rendering + sitemap
  created_at        timestamptz not null default now()
);
create index cities_published_idx on public.cities (published);
```

## Table: `leads`

```sql
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  court_type       court_type,
  court_size       text,                  -- e.g. 'pickleball_regulation', 'half_court'
  land_condition   text,                  -- e.g. 'flat_ready', 'needs_grading', 'unsure'
  full_name        text not null,
  phone            text,
  email            text,
  property_address text,
  estimated_min    integer,               -- USD
  estimated_max    integer,               -- USD
  city_slug        text references public.cities(slug),
  render_id        uuid references public.renders(id),
  status           lead_status not null default 'new',
  sms_consent      boolean not null default false,
  sms_consent_at   timestamptz,           -- set when consent given (TCPA)
  utm              jsonb not null default '{}'::jsonb, -- {source,medium,campaign,term,content}
  fbc              text,                  -- _fbc cookie
  fbp              text,                  -- _fbp cookie
  source           text                   -- 'estimator' | 'previewer' | 'contact'
);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_city_slug_idx on public.leads (city_slug);
-- At least one contact method required:
alter table public.leads add constraint leads_contact_chk
  check (phone is not null or email is not null);
-- Consent timestamp must accompany consent:
alter table public.leads add constraint leads_consent_chk
  check (sms_consent = false or sms_consent_at is not null);
```

> Note: `leads.render_id → renders.id` and `renders.lead_id → leads.id` are mutually referencing. Create `leads` and `renders` first without the cross-FKs, then add them via `alter table` (see ordering note below), or make one nullable and added later.

## Table: `renders`

```sql
create table public.renders (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  lead_id             uuid references public.leads(id),  -- linked after lead submit
  court_type          court_type not null,
  original_image_path text not null,        -- path in yard-uploads (private)
  rendered_image_url  text,                 -- public URL in renders bucket (when done)
  provider            text not null,        -- 'replicate' | 'fal'
  model               text not null,        -- e.g. 'black-forest-labs/flux-dev'
  prompt              text not null,         -- exact prompt sent
  status              render_status not null default 'queued',
  error               text,                 -- failure reason
  latency_ms          integer,
  cost_usd            numeric(10,4)
);
create index renders_status_idx on public.renders (status);
create index renders_lead_id_idx on public.renders (lead_id);
```

### FK ordering note
Because `leads.render_id` and `renders.lead_id` reference each other, create both tables without these two columns' FKs, then:
```sql
alter table public.leads   add constraint leads_render_fk   foreign key (render_id) references public.renders(id);
alter table public.renders add constraint renders_lead_fk   foreign key (lead_id)   references public.leads(id);
```

## Table: `testimonials`

```sql
create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  city        text,                  -- matches a cities.name where possible
  court_type  court_type,
  rating      smallint not null check (rating between 1 and 5),
  quote       text not null,
  photo_url   text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index testimonials_published_idx on public.testimonials (published);
create index testimonials_city_idx on public.testimonials (city);
```

## RLS policies

Enable RLS and lock writes to the service role. Public can read only published rows of public content; `leads`/`renders` are not client-readable/writable at all.

```sql
alter table public.cities       enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads        enable row level security;
alter table public.renders      enable row level security;

-- Public read of published content (anon key)
create policy cities_public_read on public.cities
  for select using (published = true);
create policy testimonials_public_read on public.testimonials
  for select using (published = true);

-- No anon policies on leads/renders => anon cannot select/insert/update.
-- The service role bypasses RLS, so server routes can do all writes.
-- (Optionally, explicit deny is implicit: absence of policy = no access for anon.)
```

> The server (Vercel functions) uses `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. All `leads`/`renders` mutations and any unpublished reads happen server-side only. (Pitfall P11.)

## Storage buckets

| Bucket | Visibility | Contents | Policy |
|---|---|---|---|
| `yard-uploads` | **private** | EXIF-stripped uploaded yard photos | Server (service role) read/write only; no public access |
| `renders` | **public-read** | Finished render images | Public read; write only via service role |

```sql
-- conceptual; created via Supabase Storage API/dashboard
-- yard-uploads: public = false
-- renders:      public = true (read), writes restricted to service role
```

EXIF/GPS stripping happens client-side before upload and is re-verified server-side (Pitfall P9, [security-and-privacy.md](./security-and-privacy.md)).

## Seed cities (25–30; six-keyword cluster each)

> Populate `landmark`, `blurb` (hand-written), `lat/lng`, `median_home_value`, `target_keywords`, then set `published=true`. Counties below; ASSUMPTION on county where unverified — confirm.

| Name | slug | County |
|---|---|---|
| Provo | provo | Utah County |
| Orem | orem | Utah County |
| Lehi | lehi | Utah County |
| American Fork | american-fork | Utah County |
| Pleasant Grove | pleasant-grove | Utah County |
| Lindon | lindon | Utah County |
| Highland | highland | Utah County |
| Alpine | alpine | Utah County |
| Cedar Hills | cedar-hills | Utah County |
| Saratoga Springs | saratoga-springs | Utah County |
| Eagle Mountain | eagle-mountain | Utah County |
| Vineyard | vineyard | Utah County |
| Spanish Fork | spanish-fork | Utah County |
| Springville | springville | Utah County |
| Mapleton | mapleton | Utah County |
| Draper | draper | Salt Lake County |
| Sandy | sandy | Salt Lake County |
| Riverton | riverton | Salt Lake County |
| Herriman | herriman | Salt Lake County |
| South Jordan | south-jordan | Salt Lake County |
| Holladay | holladay | Salt Lake County |
| Park City | park-city | Summit County |
| Heber City | heber-city | Wasatch County |

> Service area spans Salt Lake, Utah, and Wasatch counties (+ Summit/Park City). Add or remove cities to keep the published set between 25 and 60 quality pages.

### Per-city `target_keywords` template
```
['{city} pickleball court builder',
 'backyard pickleball court {city}',
 'basketball court installer {city} utah',
 'sport court {city}',
 'pickleball court cost {city} utah',
 'epoxy garage floor {city}']
```

→ Consumed by [feat-programmatic-city-pages.md](../04-features/feat-programmatic-city-pages.md); contracts in [api-contracts.md](./api-contracts.md).
