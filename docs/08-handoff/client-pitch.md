> Purpose: The demo plan and pitch script for showing the rebuilt site to the GRIT Courts owner.

Status: draft

# Client Pitch

Goal: get the owner to say "yes, build this." The owner doesn't know about the rebuild yet — this is a working demo presented casually, then a clear value story.

## The opener (verbatim)

> "Messed around with an idea for your site this weekend. Built a version that renders a finished court right onto a photo of someone's backyard, and spins up a Google-friendly page for every city you serve — Draper, Alpine, Park City, all of them. Take a look on your phone: [link]. If you like it, I can wire it so every lead texts you the second it comes in, with the rendered court and their address attached."

Keep it low-pressure and concrete. Lead with the demo, not the tech.

## Demo flow (on the owner's phone)

1. **Open the live link** on his phone — it loads fast (contrast with the current Square site).
2. **The Previewer (the wow):** upload a photo of a backyard (have a good sample ready, ideally one of his own past job sites or a stock yard) → court renders into it → drag the before/after slider. Let him do it himself.
3. **A city page:** open `/utah/draper-pickleball-court-construction` → show it's about Draper specifically (landmark, local copy), looks pro, and explain "there's one of these for every city you serve — that's how you show up on Google for 'pickleball court builder Draper.'"
4. **The estimator:** run it quickly to a price range.
5. **Speed-to-lead:** submit a lead → show that an alert can hit his phone instantly with the render + address attached. "This is the part that wins you jobs — you call them back before anyone else."

## The value story (after the demo)

Frame against his current pain ([current-site-audit.md](../01-discovery/current-site-audit.md)):

- **More found:** "Right now you're invisible on Google for the searches that matter. This gives you a page for every city — Salt Lake, Utah, and Wasatch counties — built to rank."
- **More converted:** "People don't have to imagine it — they see a court in their own yard. That's a hook no competitor has."
- **More closed:** "Every lead texts you in under a minute with their address and the render. First to call usually wins these jobs."
- **Smarter ad spend:** "Server-side conversion tracking feeds Facebook cleaner data, so your cost-per-lead should drop on the same budget."
- **Costs almost nothing to run:** "~$0–$70/month infrastructure. One extra court a year pays for it many times over." ([cost-model.md](../07-ops/cost-model.md))

## Proof points to have ready
- Live demo link (mobile-friendly preview deploy).
- A few real city pages populated and published.
- A clean sample yard image for the render.
- Lighthouse score screenshot (rebuilt vs current).
- The KPI list ([goals-and-kpis.md](../02-strategy/goals-and-kpis.md)) as the "here's how we'll measure it" close.

## Anticipated questions
- **"How much / how long?"** — Have a clear scope + price. The phased plan ([phases.md](../06-build-plan/phases.md)) shows it's already largely built.
- **"Is the render real / will it look like my yard?"** — Show it live; explain it preserves the house/fence/trees and just adds the court.
- **"Can I see the leads?"** — Show the owner dashboard ([feat-owner-dashboard.md](../04-features/feat-owner-dashboard.md)).
- **"What about my current reviews / brand?"** — Carried over: 4.8★, HBA, navy brand.
- **"Will texting people get me in trouble?"** — Consent checkbox + timestamp; we only text people who opt in ([security-and-privacy.md](../03-architecture/security-and-privacy.md)).

## The ask
> "If you like it, I'll finish wiring the lead alerts to your phone and point your domain at it. Want me to?"

→ After yes: [maintenance.md](./maintenance.md) for handoff; [deployment.md](../07-ops/deployment.md) launch checklist.
