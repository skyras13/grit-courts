> Purpose: Define the security and privacy posture — data handling, RLS, EXIF, TCPA consent, and compliance obligations.

Status: draft

# Security & Privacy

## Data we collect (and sensitivity)

| Data | Where | Sensitivity | Handling |
|---|---|---|---|
| Name | `leads.full_name` | PII | Stored; hashed before Meta CAPI |
| Phone | `leads.phone` | PII (TCPA) | Stored; hashed for CAPI; SMS only with consent |
| Email | `leads.email` | PII | Stored; hashed for CAPI |
| Property address | `leads.property_address` | sensitive PII (location) | Stored; disclosed in privacy policy; never public |
| Yard photo | `yard-uploads` (private) | sensitive (can reveal home/location) | EXIF/GPS stripped; private bucket; server access only |
| Render image | `renders` (public-read) | low (anonymized scene) | Public URL; no PII; tied to lead server-side |
| UTM / fbc / fbp | `leads` | tracking | Stored for attribution |

## Access control (RLS)

- RLS **on** for all tables. Public (anon key) can read only `published` rows of `cities`/`testimonials`. No anon access to `leads`/`renders`. (See [data-model.md](./data-model.md).)
- All privileged writes go through server route handlers using `SUPABASE_SERVICE_ROLE_KEY`.
- **Service-role key is server-only** (Pitfall P11). CI check that it never lands in a client bundle ([environment-and-secrets.md](./environment-and-secrets.md), [ci-cd.md](../07-ops/ci-cd.md)).

## Storage security

- `yard-uploads`: **private**. Reads via short-lived signed URLs for the render provider only; never public.
- `renders`: **public-read** but contains no PII; URLs are unguessable (UUID paths).

## EXIF / GPS stripping (Pitfall P9)

- **Client-side:** before upload, decode the image, downscale to ~1536px max edge, re-encode (which drops EXIF), explicitly strip any GPS/orientation metadata.
- **Server-side (defense in depth):** on `POST /api/renders`, re-process to strip metadata before storing in `yard-uploads`.
- Never store or expose raw GPS coordinates from a user photo.

## TCPA / SMS consent (Pitfall P8)

- Any form that can trigger an SMS shows a **required consent checkbox** with clear language, e.g.:
  > "I agree to receive text messages from GRIT Courts about my estimate. Message/data rates may apply. Reply STOP to opt out."
- On submit with consent: store `sms_consent = true` and `sms_consent_at = now()` (DB constraint enforces the timestamp accompanies consent).
- The lead webhook payload carries `sms_consent`; downstream automation must not text a lead unless `true`.
- Owner alerts (to `OWNER_EMAIL`/owner's own number) are not TCPA-restricted (owner is the business).

## Input validation & abuse

- Every API input Zod-validated (DoD). Reject early with `400`.
- Render endpoint: mime allowlist {jpeg,png,webp,heic}, ≤10MB (`413` over), rate limited (`429`) to bound cost/spam (Pitfall P12).
- Lead endpoint: rate limited per IP; honeypot field + (optional) lightweight bot check.
- Idempotency keys prevent duplicate leads/charges ([api-contracts.md](./api-contracts.md)).

## Webhook security

- Inbound provider webhook (`/api/renders/webhook`): verify signature/secret (`RENDER_WEBHOOK_SECRET`); reject unsigned (`401`).
- Outbound lead webhook: sign with `LEAD_WEBHOOK_SECRET` if the target supports verification.

## Admin security (ADR-002)

- `/admin` gated by server-checked `ADMIN_PASSWORD` (single shared secret, v1). Set an `httpOnly`, `secure` session cookie on success.
- `/admin` is `noindex` and disallowed in `robots.txt`.
- Defer to Clerk for real multi-user auth later (ADR-002).

## Transport & headers

- HTTPS only (Vercel default). HSTS.
- Security headers: `Content-Security-Policy` (allow self + GA/Meta/Supabase/Replicate domains), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

## Privacy policy obligations (Pitfall P10)

The `/privacy` page must explicitly cover:
- That we collect name, contact, **property address**, and **uploaded yard photos**.
- That photos are used to generate a preview render and may be reviewed by a human designer.
- That EXIF/GPS is stripped; photos are stored privately.
- How attribution cookies (Meta/GA) are used.
- How to request deletion of their data (a contact path).
- SMS consent terms and opt-out.

## Data retention (recommendation)

- ASSUMPTION: retain leads indefinitely (sales pipeline); purge `yard-uploads` originals after N days (e.g. 90) once a render exists; keep render outputs. Confirm a retention policy with the owner and document in the privacy policy.

→ Enforced via [definition-of-done.md](../06-build-plan/definition-of-done.md); operationalized in [runbook.md](../07-ops/runbook.md).
