-- CMS storage: one content document plus owner-managed API keys.
-- Run after 0001_init.sql. Applying this is what turns the dashboard from a
-- session-lived demo into permanent storage.

-- ── site_content: a single JSON document, versioned by updated_at ────────────
create table if not exists site_content (
  id text primary key default 'singleton',
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table site_content enable row level security;
-- No policies: only the service-role key (server-side) may read or write.
-- The anon key must never touch this table.

create or replace function touch_site_content() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_content_touch on site_content;
create trigger site_content_touch
  before update on site_content
  for each row execute function touch_site_content();

-- ── site_secrets: owner-entered API keys ────────────────────────────────────
-- Values are only ever read server-side via lib/cms/secrets.ts, which returns
-- status and a four-character hint to the browser and never the value itself.
-- Environment variables always take precedence over anything stored here.
create table if not exists site_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table site_secrets enable row level security;
-- Deliberately no policies. Service-role only.

comment on table site_secrets is
  'Owner-managed API keys. Service-role access only; env vars override. Never expose via the anon client.';
