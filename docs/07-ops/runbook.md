> Purpose: Step-by-step operational procedures for the most common and most urgent tasks.

Status: draft

# Runbook

Concrete procedures. Each is safe to follow without prior context. Cross-references: [environment-and-secrets.md](../03-architecture/environment-and-secrets.md), [data-model.md](../03-architecture/data-model.md), [monitoring-and-logging.md](./monitoring-and-logging.md).

---

## RB-1 — Rotate a key/secret

**When:** suspected exposure, provider rotation, offboarding.

1. Generate a new key in the provider dashboard (Supabase / Replicate / Resend / Meta / Twilio).
2. Update the value in **Vercel → Project → Settings → Environment Variables** for each env (Production, Preview, Development) that uses it.
3. Update local `.env.local`.
4. Trigger a redeploy (Vercel) so functions pick up the new value.
5. Revoke the old key in the provider.
6. Smoke test the affected flow (e.g. rotate `REPLICATE_API_TOKEN` → run a test render; rotate `RESEND_API_KEY` → submit a test lead and confirm owner email).
7. If `SUPABASE_SERVICE_ROLE_KEY` rotated: verify lead/render writes still work and RLS still blocks anon.

> Never commit the new key. If a secret leaked to git history, rotate AND scrub history.

---

## RB-2 — Reprocess a failed render

**When:** a `renders` row is `status='failed'` (provider error/timeout), or quality is poor.

1. Find the render in `/admin/renders` (filter status=failed) or query `renders` by id.
2. Confirm the original upload still exists in `yard-uploads` (`original_image_path`).
3. Re-trigger: call `renderCourt()` again for that render (an admin "reprocess" action, or re-`POST` with the stored original + `courtType`). Set status back to `queued`.
   - If provider is down, consider swapping `RENDER_PROVIDER=fal` + `FAL_KEY` (RB-5) and reprocessing.
4. Webhook updates the row to `done` with a new `rendered_image_url` (+ latency/cost).
5. If the render is linked to a lead, the new image is now visible in the lead detail; optionally re-notify the owner.
6. If it fails again, the lead already has the graceful-fallback path; have the designer hand-render and the owner texts it over (per the product promise).

---

## RB-3 — Add a city

**When:** expanding the service area or replacing a thin/unpublished city.

1. Gather facts: `name`, unique `slug`, `county`, a recognizable `landmark`, approx `median_home_value`, `lat`/`lng`.
2. Hand-write a unique `blurb` (≥60 words, mentions the landmark) — do NOT find-and-replace another city (Pitfall P1).
3. Set the six-keyword `target_keywords` cluster (see [keyword-research.md](../01-discovery/keyword-research.md)).
4. Insert the row with `published=false` first; review the rendered page on a preview.
5. Attach any real `testimonials` for that city if available.
6. Set `published=true`.
7. Trigger ISR revalidation (or redeploy). Confirm: page renders, unique title/meta (uniqueness lint passes), valid schema, appears in `sitemap.xml`, and 3–5 nearby-city links resolve.
8. (Optional) Request indexing in Google Search Console.

---

## RB-4 — Add/update a testimonial
1. Insert/update a `testimonials` row (`name`, `city`, `court_type`, `rating` 1–5, `quote`, optional `photo_url`).
2. Set `published=true`. Use only real reviews (schema integrity).
3. Confirm it appears on `/reviews` and the matching city page after revalidate.

---

## RB-5 — Swap the render provider (Replicate ↔ Fal)
1. Implement/confirm the Fal `renderCourt()` impl satisfies the same `RenderCourtResult` contract ([integrations.md](../03-architecture/integrations.md)).
2. Set `RENDER_PROVIDER=fal` and `FAL_KEY` in Vercel env (per environment).
3. Update the provider webhook config to point at `/api/renders/webhook` and set `RENDER_WEBHOOK_SECRET`.
4. Redeploy; run a test render; confirm `provider='fal'` and `done` on the row.
5. No caller changes required.

---

## RB-6 — Owner not receiving lead notifications
**When:** alert "owner notification failed" or owner reports silence.
1. Check logs for the lead's fan-out results ([monitoring-and-logging.md](./monitoring-and-logging.md)): which channel failed (Resend / webhook)?
2. **Resend fail:** verify `RESEND_API_KEY`, `OWNER_EMAIL`, Resend dashboard deliverability; resend manually.
3. **Webhook fail:** verify `LEAD_WEBHOOK_URL` reachable + the owner's Make/Zapier/GHL flow is on; re-POST the stored lead payload.
4. The `leads` row is intact regardless — manually relay the lead to the owner while fixing.
5. Add/repair the retry so future leads self-heal.

---

## RB-7 — Suspected render abuse / cost spike
1. Check Replicate spend + `renders` row volume by IP/session window.
2. Tighten the rate limit on `POST /api/renders`; confirm size cap (≤10MB) enforced.
3. Block offending source if needed (Vercel firewall / WAF).
4. Confirm idempotency is preventing duplicate charges.

---

## RB-8 — Restore / migration safety
1. Take a Supabase backup before any destructive migration.
2. Apply migrations to Preview first; verify RLS + buckets.
3. Apply to Production; verify anon reads published cities only and lead/render writes work.

→ Alerts that trigger these: [monitoring-and-logging.md](./monitoring-and-logging.md). Maintenance variants: [maintenance.md](../08-handoff/maintenance.md).
