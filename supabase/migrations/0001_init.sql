-- GRIT Courts — initial schema, RLS, and storage buckets.
-- Run in the Supabase SQL editor or via `supabase db push`.
-- Mirrors lib/types.ts and docs/03-architecture/data-model.md.

-- ── cities: powers programmatic SEO pages ────────────────────────────────────
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  county text not null,
  landmark text,
  blurb text,
  lat double precision,
  lng double precision,
  median_home_value int,
  target_keywords text[] default '{}',
  published boolean default true,
  created_at timestamptz default now()
);

-- ── leads: estimator + previewer submissions ─────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  court_type text,
  court_size text,
  land_condition text,
  full_name text not null,
  phone text not null,
  email text,
  property_address text,
  estimated_min int,
  estimated_max int,
  city_slug text references cities(slug),
  render_id uuid,
  status text default 'new',
  sms_consent boolean default false,
  sms_consent_at timestamptz,
  utm jsonb default '{}',
  fbc text,
  fbp text,
  source text default 'site'
);

-- ── renders: AI backyard previewer jobs ──────────────────────────────────────
create table if not exists renders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  lead_id uuid references leads(id),
  court_type text default 'pickleball',
  original_image_path text not null,
  rendered_image_url text,
  provider text,
  model text,
  prompt text,
  status text default 'queued',
  error text,
  latency_ms int,
  cost_usd numeric(6,4)
);

-- leads.render_id references renders(id) — added after both tables exist.
alter table leads
  drop constraint if exists leads_render_id_fkey,
  add constraint leads_render_id_fkey foreign key (render_id) references renders(id);

-- ── testimonials: social proof engine ────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  court_type text,
  rating int check (rating between 1 and 5),
  quote text not null,
  photo_url text,
  published boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_renders_lead_id on renders (lead_id);
create index if not exists idx_cities_published on cities (published);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- leads/renders: NO anon access. All writes/reads go through the service-role
-- key on the server. cities/testimonials: public read where published.
alter table leads enable row level security;
alter table renders enable row level security;
alter table cities enable row level security;
alter table testimonials enable row level security;

drop policy if exists "public read published cities" on cities;
create policy "public read published cities" on cities
  for select using (published = true);

drop policy if exists "public read published testimonials" on testimonials;
create policy "public read published testimonials" on testimonials
  for select using (published = true);

-- No policies on leads/renders => only the service role (which bypasses RLS) can
-- touch them. This is intentional.

-- ── Storage buckets ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('yard-uploads', 'yard-uploads', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('renders', 'renders', true)
on conflict (id) do nothing;
