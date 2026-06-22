> Purpose: Define the keyword universe that the programmatic city pages and core pages must target.

Status: draft

# Keyword Research

> ASSUMPTION: search volumes are not measured here. Before/at Phase P3, validate clusters and pull real volume/difficulty with a keyword tool (Ahrefs/Semrush/Google Keyword Planner). The cluster *structure* below is the plan; numbers come later.

## Intent tiers

| Tier | Intent | Example | Page that serves it |
|---|---|---|---|
| **Transactional / local** (highest value) | Ready to hire, location-specific | "draper pickleball court builder" | City page |
| **Cost / research** | Comparing, mid-funnel | "pickleball court cost utah" | City page (cost section) + estimator |
| **Service / generic** | Top-funnel | "backyard pickleball court ideas" | Home / service sections |
| **Brand** | Knows GRIT | "grit courts utah" | Home |

## Per-city keyword clusters (the pSEO core)

Each `cities` row carries a `target_keywords text[]` cluster. The template-level pattern per city `{City}`:

1. `{city} pickleball court builder`
2. `backyard pickleball court {city}`
3. `basketball court installer {city} utah`
4. `sport court {city}`
5. `pickleball court cost {city} utah`
6. `epoxy garage floor {city}`

> These six are the locked default cluster. A city row may add city-specific long-tails (e.g. for Park City: "park city outdoor court installer," "snow-rated sport court park city").

### Example populated clusters

**Provo** (`slug: provo`):
- provo pickleball court builder
- backyard pickleball court provo
- basketball court installer provo utah
- sport court provo
- pickleball court cost provo utah
- epoxy garage floor provo

**Draper** (`slug: draper`):
- draper pickleball court builder
- backyard pickleball court draper
- basketball court installer draper utah
- sport court draper
- pickleball court cost draper utah
- epoxy garage floor draper

**Park City** (`slug: park-city`):
- park city pickleball court builder
- backyard pickleball court park city
- basketball court installer park city utah
- sport court park city
- pickleball court cost park city utah
- epoxy garage floor park city

(Repeat the six-keyword pattern for every seed city in [data-model.md](../03-architecture/data-model.md)'s seed list.)

## Non-local clusters (core pages / blog later)

| Cluster | Keywords | Page |
|---|---|---|
| Court types | "outdoor pickleball court," "backyard basketball court," "multi-sport game court," "epoxy garage floor coating" | Home + service sections |
| Cost | "how much does a pickleball court cost," "backyard court cost utah" | Estimator + city cost sections |
| Comparison | "concrete vs acrylic court," "sport court tile vs acrylic" | Blog (future) |
| Inspiration | "backyard court ideas," "small backyard pickleball court" | Gallery / blog (future) |

## Keyword → URL mapping

| Keyword pattern | URL |
|---|---|
| `{city} pickleball court builder` | `/utah/{city}-pickleball-court-construction` |
| `pickleball court cost {city} utah` | same city page, cost section anchor |
| generic court-type terms | `/` and service sections |
| brand | `/` |

## Thin-content guardrail tie-in

Because clusters share a six-keyword skeleton across cities, **uniqueness must come from content, not keywords.** See the uniqueness checklist in [seo-strategy.md](../02-strategy/seo-strategy.md). Do not generate a page whose only difference from another is the city token.

## Action items before P3

- [ ] Pull real volume + difficulty for the six-keyword pattern across all seed cities.
- [ ] Identify any city where a service other than pickleball is the dominant search (adjust the H1/primary term per city if so).
- [ ] Note seasonal terms (Park City / Heber: snow, indoor).
