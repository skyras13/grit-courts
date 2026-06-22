> Purpose: Define motion principles, durations/easing tokens, specific animations, and reduced-motion behavior.

Status: draft

# Motion

Motion should feel premium and purposeful, never gratuitous — it guides attention (the render reveal, the estimate result) and confirms actions. Performance-safe (transform/opacity only) to protect CWV and Lighthouse ≥ 95.

## Tokens (from [design-system.md](./design-system.md))
| Token | Value | Use |
|---|---|---|
| `--motion-fast` | 120ms | hovers, small toggles |
| `--motion-base` | 200ms | most transitions |
| `--motion-slow` | 320ms | reveals, modals |
| `--ease-standard` | `cubic-bezier(0.2,0,0,1)` | enter/standard |
| `--ease-out` | `cubic-bezier(0,0,0.2,1)` | exit |

## Principles
1. **Animate transform/opacity only** (GPU-friendly; no layout thrash).
2. **Short and subtle** — base 200ms; nothing over ~320ms for UI.
3. **Purposeful** — motion marks a state change or draws the eye to the payoff.
4. **Respect `prefers-reduced-motion`** — collapse to instant/opacity-only.

## Specific animations

| Element | Motion |
|---|---|
| Buttons | bg/transform on hover (`--motion-fast`); subtle press scale 0.98 |
| Cards | shadow + 2px lift on hover (`--motion-base`) |
| Header on scroll | background fade to solid (`--motion-base`) |
| Mobile menu | slide/fade in (`--motion-slow`, `--ease-standard`) |
| Modal/drawer | fade backdrop + scale/slide panel (`--motion-slow`) |
| Estimator step change | fade/slide between steps (`--motion-base`); progress fill animates |
| **Estimate result** | count-up or fade-in of the range to mark the payoff |
| **Render processing** | calm looping progress indicator (not a frantic spinner); honest ETA |
| **Before/After reveal** | on done, the slider animates from After→split to invite interaction (`--motion-slow`); then user-controlled |
| Toasts | slide+fade in/out |
| Scroll-in sections | optional gentle fade/translate on first view (IntersectionObserver), disabled under reduced motion |

## Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```
- The render reveal still works (slider is functional); it just won't auto-animate.
- No essential information is conveyed by motion alone (a11y).

## Don'ts
- No parallax-heavy hero, no large continuous loops, no motion that delays interactivity, no animation that blocks the render reveal or form submission.

→ Tokens [design-system.md](./design-system.md); a11y [accessibility.md](./accessibility.md).
