> Purpose: Define the design tokens — color (evolving #2b598a), typography, spacing, radii, shadows, and motion baselines.

Status: draft

# Design System

Premium, confident, local, mobile-first. The brand navy `#2b598a` anchors the palette. Tokens are CSS variables consumed by Tailwind.

## Color tokens

### Brand navy scale (from #2b598a)
> ASSUMPTION: tints/shades below are derived from the brand navy; tune for AA contrast.

| Token | Hex | Use |
|---|---|---|
| `--color-navy-900` | `#15304a` | Darkest text-on-light accents, footers |
| `--color-navy-700` | `#1f4368` | Hover states |
| `--color-navy-600` | `#244e7a` | Pressed |
| `--color-navy-500` | `#2b598a` | **Brand primary** (CTAs, links) |
| `--color-navy-400` | `#4a76a4` | Secondary |
| `--color-navy-200` | `#aac3dc` | Borders, subtle fills |
| `--color-navy-50` | `#eef4fa` | Section backgrounds |

### Court accent (energy / sport)
| Token | Hex | Use |
|---|---|---|
| `--color-court-blue` | `#1f86c9` | Pickleball blue accents, matches render surfacing |
| `--color-court-green` | `#2f9e63` | Court green accents, success |
| `--color-accent` | `#f5a623` | High-emphasis CTA / highlight (amber, pairs with navy) |

### Neutrals & feedback
| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#1a1f24` | Body text |
| `--color-muted` | `#5b6670` | Secondary text |
| `--color-line` | `#e2e6ea` | Borders/dividers |
| `--color-bg` | `#ffffff` | Page background |
| `--color-bg-alt` | `#f6f8fa` | Alt sections |
| `--color-success` | `#2f9e63` | Success |
| `--color-warning` | `#d98a00` | Warning |
| `--color-error` | `#c5372c` | Error |

### Contrast rule (Accessibility, AA)
- Body text vs background ≥ 4.5:1; large text/UI ≥ 3:1.
- Navy-500 on white ≈ AA for large text/buttons; for small body text use `--color-ink`. Verify all pairings (see [accessibility.md](./accessibility.md)).

## Typography

> OPEN DECISION (minor): confirm exact families at P2. Recommended pairing:
- **Display/Headings:** a strong geometric/grotesk sans (e.g. "Sora" or "Plus Jakarta Sans") — confident, modern.
- **Body:** a highly legible sans (e.g. "Inter") — neutral, fast-loading via `next/font`.

| Token | Size / line-height | Use |
|---|---|---|
| `--font-display` | family | H1–H3 |
| `--font-body` | family | body, UI |
| `--text-xs` | 12 / 16 | labels |
| `--text-sm` | 14 / 20 | secondary |
| `--text-base` | 16 / 24 | body |
| `--text-lg` | 18 / 28 | lead |
| `--text-xl` | 20 / 28 | H4 |
| `--text-2xl` | 24 / 32 | H3 |
| `--text-3xl` | 30 / 38 | H2 |
| `--text-4xl` | 36 / 44 | H1 (mobile) |
| `--text-5xl` | 48 / 56 | H1 (desktop hero) |

- Load via `next/font` (no layout shift, self-hosted → CWV-friendly).

## Spacing scale (4px base)
`--space-1:4 · 2:8 · 3:12 · 4:16 · 5:20 · 6:24 · 8:32 · 10:40 · 12:48 · 16:64 · 20:80 · 24:96`

## Radii
| Token | px | Use |
|---|---|---|
| `--radius-sm` | 6 | inputs, chips |
| `--radius-md` | 10 | cards, buttons |
| `--radius-lg` | 16 | panels, media |
| `--radius-full` | 9999 | pills, avatars |

## Shadows (elevation)
| Token | Use |
|---|---|
| `--shadow-sm` | subtle card |
| `--shadow-md` | raised card / dropdown |
| `--shadow-lg` | modal / sticky CTA bar |

## Layout
- Container max-width ~1200px; gutters 16px mobile / 24px+ desktop.
- Breakpoints (Tailwind defaults): `sm 640 · md 768 · lg 1024 · xl 1280`.
- Mobile-first; design from 320px up.

## Motion baseline (see [motion.md](./motion.md))
- Durations: `--motion-fast 120ms`, `--motion-base 200ms`, `--motion-slow 320ms`.
- Easing: `--ease-standard cubic-bezier(0.2,0,0,1)`.
- Respect `prefers-reduced-motion`.

## Token implementation
- Define as CSS variables on `:root` (and a `.dark` later if needed); map into `tailwind.config` `theme.extend.colors/spacing/borderRadius`. No hardcoded hex in components — always tokens.

→ Components consume these in [components.md](./components.md); templates in [page-templates.md](./page-templates.md); a11y rules in [accessibility.md](./accessibility.md).
