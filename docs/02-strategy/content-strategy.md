> Purpose: Define what content exists, who writes it, the voice, and how it's managed for v1.

Status: draft

# Content Strategy

## Content management decision

DECISION (ADR-006): **hardcode/seed for v1, Sanity later.** City rows are seeded into `cities`; static page copy lives in the repo; testimonials are seeded into `testimonials`. Editing is via SQL/admin or a code change. This is fine because the content set is small and we control quality during the pitch.

## Content inventory

| Content | Where it lives | Who writes (v1) | Notes |
|---|---|---|---|
| Home copy | repo (component/MDX-free TSX or constants) | builder | Hero, value props, CTAs |
| Court-type copy (pickleball, basketball, multi-sport, epoxy) | repo constants | builder | Shared across pages |
| City `blurb` (per city) | `cities.blurb` | builder, hand-written | ≥60 words, mentions landmark; uniqueness contract (see [seo-strategy.md](./seo-strategy.md)) |
| City facts (`landmark`, `county`, `median_home_value`, `lat/lng`, `target_keywords`) | `cities` row | builder | Sourced from public data |
| Testimonials | `testimonials` table | seeded from real reviews | Real names/cities only; reflects ~4.8★ |
| Gallery images | repo / Supabase `renders` examples + project photos | owner-provided | Optimized |
| Legal (privacy, terms) | repo | builder (reviewed) | Privacy must cover photo + address collection |
| FAQ / cost content | repo + city cost sections | builder | Feeds `FAQPage` schema |

## Voice & tone

- **Confident, local, premium, no hype.** We build $18k–$45k courts; the copy should feel like a craftsman who's proud of the work, not a discount ad.
- **Concrete over vague:** "regulation-line acrylic surfacing, pro net system, perfectly level base" beats "high quality."
- **Local:** name the city, the county, the landmark. Speak to Wasatch Front homeowners.
- **Action-led:** every section ends pointing to the estimator or previewer.
- **Honest about price:** estimator returns a range, framed as an estimate pending a free site visit.

## Per-city content workflow (the uniqueness engine)

1. Pull city facts (county, a recognizable `landmark`, approximate `median_home_value`, `lat/lng`).
2. Hand-write a 60–100 word `blurb` referencing the landmark and local character.
3. Define the six-keyword `target_keywords` cluster (see [keyword-research.md](../01-discovery/keyword-research.md)).
4. Attach any real testimonials from that city.
5. Set `published = true` only when 1–4 are done.

> Guardrail: never bulk-generate blurbs by find-and-replace. That produces doorway pages (Pitfall P1).

## Court-type content blocks (reusable)

Each court type gets a reusable block with: short pitch, 3–4 spec/benefit bullets, a representative image, and a "preview it in your yard" CTA. Used on home and within each city page.

| Court type | Hook |
|---|---|
| `pickleball` | "Your own regulation backyard pickleball court." |
| `basketball` | "Half or full court, pro-grade, built to last." |
| `multi_sport` | "One court, every game — pickleball, basketball, and more." |
| `epoxy_floor` | "Showroom-grade epoxy garage and shop floors." |

## Future content (post-v1, see [future-roadmap.md](../08-handoff/future-roadmap.md))

- Blog for comparison/inspiration keywords ("concrete vs acrylic court," "small backyard court ideas").
- Per-city FAQ blocks.
- Project case studies with before/after renders.
- Sanity migration if the owner wants self-serve editing.
