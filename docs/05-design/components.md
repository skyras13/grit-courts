> Purpose: Inventory of UI components with their props and states, so build is consistent and complete.

Status: draft

# Component Inventory

All components consume tokens from [design-system.md](./design-system.md). TS strict, no `any`. Every interactive component must define hover/focus/active/disabled and (where async) loading/error states (DoD).

## Primitives

### Button
- **Props:** `variant: 'primary'|'secondary'|'ghost'|'accent'`, `size: 'sm'|'md'|'lg'`, `href?`, `loading?`, `disabled?`, `iconLeft?`, `iconRight?`, `fullWidth?`.
- **States:** default, hover, focus-visible (ring), active, disabled, loading (spinner + aria-busy).

### Input / Textarea / Select
- **Props:** `name`, `label`, `placeholder?`, `error?`, `required?`, `helpText?`, `type?`.
- **States:** default, focus, error (message + `aria-invalid`), disabled. Always label-associated.

### Checkbox / RadioGroup
- **Props:** `name`, `label`, `value(s)`, `error?`, `required?`.
- **States:** unchecked, checked, focus, error, disabled. Used for court type/size/land condition and **TCPA consent**.

### Badge / Pill
- **Props:** `tone: 'navy'|'success'|'warning'|'neutral'`, `icon?`. Used for status, rating, HBA.

### Card
- **Props:** `elevation`, `as`, `media?`. Testimonials, court types, gallery.

### Modal / Drawer
- **Props:** `open`, `onClose`, `title`. Focus trap, ESC, scroll lock, `aria-modal`.

### Spinner / Skeleton
- Loading states for async (estimator submit, render poll, admin tables).

### Toast / Alert
- **Props:** `tone`, `message`, `action?`. Errors and confirmations.

## Layout / chrome

### Header / NavBar
- Desktop nav + mobile hamburger; primary CTA button; tap-to-call (mobile).
- States: transparent-over-hero → solid on scroll; mobile menu open/closed.

### Footer
- Court types, service-area links (top cities + all), company, legal; NAP block; rating + HBA badges.

### StickyMobileCTA
- Fixed bottom bar (mobile): "Get Estimate" + "Preview". Hidden on desktop.

### Breadcrumbs
- For city pages (Home › Utah › {City}); emits `BreadcrumbList` schema.

### SectionHeading
- **Props:** `eyebrow?`, `title`, `subtitle?`, `align?`.

## Feature components

### EstimatorWizard
- **Props:** `embedded?`, `citySlug?`, `defaultCourtType?`.
- **Sub:** `StepCourtType`, `StepSize`, `StepLand`, `StepContact`, `ResultRange`, `ProgressIndicator`.
- **States:** in-progress, validating, submitting, success (range), error. (See [feat-court-estimator-funnel.md](../04-features/feat-court-estimator-funnel.md).)

### PreviewerWidget
- **Props:** `embedded?`, `citySlug?`, `defaultCourtType?`.
- **Sub:** `CourtTypePicker`, `PhotoUploader` (validate/downscale/EXIF-strip), `RenderProgress` (queued/processing with ETA), `BeforeAfterSlider`, `RenderFallback`, `LeadCaptureAfterRender`.
- **States:** idle, validating, uploading, queued/processing, done (slider), failed/timeout (fallback). (See [feat-backyard-previewer.md](../04-features/feat-backyard-previewer.md).)

### BeforeAfterSlider
- **Props:** `beforeSrc`, `afterSrc`, `initial?` (0–100), `alt`.
- **A11y:** keyboard-operable handle (arrow keys), ARIA slider role, focus ring.

### LeadForm (contact / shared)
- **Props:** `source`, `citySlug?`, `renderId?`, `compact?`.
- **States:** idle, validating, submitting, success, error. Includes consent checkbox.

### TestimonialCard / TestimonialCarousel
- **Props:** `name`, `city`, `courtType`, `rating`, `quote`, `photoUrl?`. Missing-photo fallback.

### RatingBadge / HbaBadge
- Static trust badges; `aggregateRating` data for schema.

### CourtTypeBlock
- **Props:** `courtType`, `image`, `cta`. Reusable on home + city pages.

### Gallery / Lightbox
- Optimized images (`next/image`), lazy, alt text, keyboard lightbox.

### CityCard / CityGrid
- For `/utah` index and "nearby cities" links.

### JsonLd
- **Props:** `data` (typed schema object). Server-rendered `<script type="application/ld+json">`.

### Admin components
- `AdminTable`, `LeadRow`, `LeadDetailDrawer`, `StatusSelect`, `RenderRow`, `AuthGate`. States: loading (skeleton), empty, error.

## State coverage matrix (must-haves per DoD)

| Component class | loading | empty | error | a11y focus |
|---|---|---|---|---|
| Estimator | ✓ | n/a | ✓ | ✓ |
| Previewer | ✓ | ✓ (idle) | ✓ (fallback) | ✓ |
| LeadForm | ✓ | n/a | ✓ | ✓ |
| Admin tables | ✓ | ✓ | ✓ | ✓ |
| Testimonials | n/a | ✓ (fallback) | n/a | ✓ |

→ Tokens [design-system.md](./design-system.md); wireframes [page-templates.md](./page-templates.md); a11y [accessibility.md](./accessibility.md); motion [motion.md](./motion.md).
