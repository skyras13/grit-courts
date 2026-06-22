> Purpose: Define measurable goals and the exact KPIs we'll report, with definitions, targets, and data sources.

Status: draft

# Goals & KPIs

## Business goal

Increase qualified, attributable, high-intent leads for GRIT Courts at a lower blended cost-per-lead than the current Square site + aggregator mix — by owning local organic search, converting visitors with interactive tools, and responding instantly.

## KPI table

| # | KPI | Definition | Target | Source |
|---|---|---|---|---|
| K1 | Indexed city pages | Published `cities` pages indexed by Google | 25–60 | Google Search Console (GSC) |
| K2 | Organic impressions (90d) | Search impressions, 90-day trend | Upward trend | GSC |
| K3 | Organic clicks (90d) | Search clicks, 90-day trend | Upward trend | GSC |
| K4 | Estimator completion rate | leads with estimate ÷ estimator starts | ≥ 35% (ASSUMPTION baseline) | GA4 funnel + `leads` |
| K5 | Previewer engagement | render starts ÷ unique visitors to a page with previewer | track + grow | GA4 + `renders` count |
| K6 | Render→lead conversion | leads with `render_id` ÷ renders done | ≥ 50% (ASSUMPTION) | `leads` ⨝ `renders` |
| K7 | Meta CPL before/after | Meta ad spend ÷ attributed leads | down vs baseline | Meta Ads Manager + CAPI |
| K8 | % leads with render | leads where `render_id` is set ÷ all leads | track + grow | `leads` |
| K9 | Speed-to-lead | submit → first owner/automation contact | < 60s | webhook/Resend/Twilio logs |
| K10 | Lighthouse mobile | Lighthouse Performance score, mobile, on key templates | ≥ 95 | CI Lighthouse |
| K11 | Core Web Vitals | LCP / INP / CLS field data | all "good" | GSC / CrUX / Vercel Analytics |

## Funnel definition (for K4–K6, K8)

```
City/Home page view
   → Estimator start          (GA4: estimator_start)
   → Estimator step complete  (estimator_step, step=1..n)
   → Estimate shown           (estimator_complete, value=range)
   → Previewer photo upload    (render_start)
   → Render done/failed        (render_done / render_failed)
   → Lead submitted            (lead_submit  → server Lead event to Meta CAPI)
```

See event spec in [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md).

## Baselines to capture before launch

We can only prove improvement against a baseline. Capture now:

- Current Square site Lighthouse mobile score (K10 baseline).
- Current `site:builtwithgrit.com` indexed count (K1 baseline ≈ small).
- Current Meta CPL from Ads Manager (K7 baseline).
- Current lead response time, by owner self-report (K9 baseline likely hours).

## Reporting cadence

- **Weekly during the first 90 days:** K1, K9, K4, K6 (the levers we can move fast).
- **Monthly:** full table, with the 90-day trend charts for K2/K3 and Meta CPL.

## Leading vs lagging

- **Leading** (move first): K4 estimator completion, K5 previewer engagement, K9 speed-to-lead, K10 Lighthouse.
- **Lagging** (follow over weeks/months): K1 indexed pages, K2/K3 organic, K7 CPL.

→ KPIs are wired to instrumentation in [feat-analytics-attribution.md](../04-features/feat-analytics-attribution.md) and gated by [definition-of-done.md](../06-build-plan/definition-of-done.md).
