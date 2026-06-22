> Purpose: The WCAG 2.1 AA checklist and component-specific accessibility requirements.

Status: draft

# Accessibility (WCAG 2.1 AA)

AA is a Definition-of-Done gate ([definition-of-done.md](../06-build-plan/definition-of-done.md)). This is the checklist plus the tricky cases (slider, uploader, funnel, modal).

## Global checklist

- [ ] **Contrast:** body text ≥ 4.5:1; large text / UI components / focus indicators ≥ 3:1. Verify every token pairing in [design-system.md](./design-system.md) (navy-500 on white for small text fails — use `--color-ink`).
- [ ] **Keyboard:** every interactive element reachable and operable by keyboard; logical tab order; no traps (except intentional modal focus trap with ESC).
- [ ] **Focus visible:** a clear `focus-visible` ring on all focusable elements.
- [ ] **Semantics:** correct landmarks (`header/nav/main/footer`), one `h1` per page, no skipped heading levels.
- [ ] **Labels:** every input has an associated `<label>`; errors linked via `aria-describedby`; `aria-invalid` on error.
- [ ] **Alt text:** meaningful `alt` on content images; `alt=""` for decorative.
- [ ] **Color not sole signal:** errors/status use text/icon, not color alone.
- [ ] **Motion:** honor `prefers-reduced-motion` (see [motion.md](./motion.md)).
- [ ] **Target size:** tap targets ≥ 44×44px (mobile-first audience).
- [ ] **Zoom/reflow:** usable at 200% zoom and 320px width without horizontal scroll.
- [ ] **Language:** `<html lang="en">`.
- [ ] **Skip link:** "skip to content."
- [ ] **Live regions:** async status (submitting, render done/failed) announced via `aria-live`.

## Component-specific

### EstimatorWizard
- Steps as a labeled group; progress conveyed with text (not color alone).
- On submit error, move focus to the error summary; announce via `aria-live="assertive"`.
- Radio groups (court type/size/land) use `role=radiogroup` semantics; arrow-key navigation.

### PreviewerWidget
- **PhotoUploader:** real `<input type=file>` with visible label; accepted types announced; errors announced.
- **RenderProgress:** `aria-live="polite"` announcing "rendering…" then "done"/"couldn't render — designer will follow up."
- **BeforeAfterSlider:** handle is a `role="slider"` with `aria-valuemin/max/now`, label "reveal amount"; operable with arrow keys; focus ring; provide text alt for both before/after images.

### LeadForm / consent
- TCPA consent is a real checkbox with a programmatic label; required state announced.

### Modal / Drawer (admin detail, mobile menu)
- Focus trap, ESC to close, return focus to trigger, `aria-modal`, labelled by title.

### Navigation
- Mobile menu button has `aria-expanded`/`aria-controls`; dropdown keyboard-operable.

### Admin tables
- Proper `<table>` semantics with `<th scope>`; status select is a labeled native control; empty/loading states announced.

## Testing
- **Automated:** axe (via Playwright `@axe-core/playwright`) on key templates in CI; fail on violations.
- **Manual:** keyboard-only pass of the lead and render journeys; screen-reader spot check (VoiceOver) of the slider and funnel.
- **Lighthouse a11y** score tracked alongside performance.

→ Gated by [definition-of-done.md](../06-build-plan/definition-of-done.md); tested per [testing-strategy.md](../06-build-plan/testing-strategy.md).
