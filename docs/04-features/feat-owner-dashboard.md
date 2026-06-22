> Purpose: Spec the lightweight password-gated owner dashboard for v1 — views, actions, and acceptance criteria.

Status: draft

# Feature: Owner Dashboard (v1, password-gated)

DECISION (ADR-002): a lightweight, password-gated admin for v1; Clerk deferred. Lets the owner see and work leads and view renders without spreadsheet exports.

## User story
> As the owner, I log in with a password and see every lead with its render, contact info, estimate, and source — and I can update each lead's status as I work it.

## Access (ADR-002, [security-and-privacy.md](../03-architecture/security-and-privacy.md))
- Routes under `/admin` gated by `ADMIN_PASSWORD` (single shared secret). On correct password, set an `httpOnly`, `secure` session cookie; middleware/layout guards all `/admin/*`.
- `/admin` is `noindex` and `Disallow`ed in robots.

## Views
1. **`/admin` (overview):** counts by status (new/contacted/quoted/won/lost), today's leads, leads with renders, recent activity.
2. **`/admin/leads`:** table of `leads` — created_at, name, contact, court type/size, city, estimate range, source, status, render thumbnail. Filter by status/city/source; sort by date. Row → detail.
   - **Detail/drawer:** full lead, the render before/after, UTM/fbc/fbp, address; **status selector** (new→contacted→quoted→won→lost) writing back to `leads.status`.
3. **`/admin/renders`:** table of `renders` — created_at, court type, status, provider/model, latency, cost, thumbnail; link to the associated lead. Filter by status; surface `failed` for reprocessing ([runbook.md](../07-ops/runbook.md)).

## Data access
- Server components/route handlers using the service role read `leads`/`renders` (RLS-bypassing, server-only). No client-side privileged keys.
- Status updates go through a small server action / route that validates (Zod enum) and writes with the service role.

## States (DoD)
- **Unauthenticated:** password prompt.
- **Empty:** "No leads yet" / "No renders yet."
- **Loading:** skeletons.
- **Error:** friendly message + retry.
- **Status update:** optimistic or pending state, confirm/rollback on error.

## Out of scope for v1 (deferred)
- Multi-user auth/roles (Clerk) — ADR-002.
- Editing city/testimonial content (done via seed/SQL for v1; Sanity later — ADR-006).
- Analytics dashboards (GA4/Meta live elsewhere).

## Acceptance criteria
- [ ] `/admin/*` is inaccessible without the correct `ADMIN_PASSWORD`; correct password sets a secure session.
- [ ] `/admin` shows status counts and recent leads.
- [ ] `/admin/leads` lists all leads with contact, court details, estimate, source, city, status, and render thumbnail; filterable by status/city/source.
- [ ] Lead detail shows the before/after render and attribution (utm/fbc/fbp) and address.
- [ ] Owner can change a lead's status; the change persists (validated enum, service-role write).
- [ ] `/admin/renders` lists renders with status/provider/model/latency/cost and links to leads; failed renders are visible.
- [ ] No service-role key or `ADMIN_PASSWORD` reaches the client bundle.
- [ ] `/admin` is `noindex` + robots-disallowed.
- [ ] Empty/loading/error states present; WCAG 2.1 AA; works 320px→desktop.

→ Data [data-model.md](../03-architecture/data-model.md); security [security-and-privacy.md](../03-architecture/security-and-privacy.md). Phase P8.
