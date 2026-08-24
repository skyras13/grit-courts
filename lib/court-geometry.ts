/**
 * Court geometry — every dimension in FEET, from the governing spec.
 *
 * Why this file exists: the previous renderer drew courts as arbitrary fractions
 * of a fixed 1024x640 canvas (`w * 0.22`, `h * 0.4`), which squashed a 44x20
 * pickleball court (2.2:1) into a 1.57:1 box. Courts drawn that way never look
 * like real courts because they aren't.
 *
 * Everything below is a real measurement:
 *   - Pickleball  — USA Pickleball rulebook (20 x 44 play area, 7ft non-volley zone)
 *   - Basketball  — NFHS / high-school spec (12ft lane, 19ft to FT line, 19'9" arc)
 *   - Tennis      — ITF spec (36 x 78 doubles, 27ft singles, 21ft service line)
 *
 * Pad sizes are GRIT's own, measured out of their designer's line art rather
 * than guessed. Every sport renders into the same 720x420 box and only the
 * scale changes, so all three pads share a 12:7 (1.714:1) aspect ratio:
 *
 *   sport                px/ft   pad (ft)      verified against their art
 *   residential combo      12    60 x 35       court 44.00 x 20.00, kitchen 7.00 each side of net
 *   full-court basketball   7    103 x 60      court 84.00 x 50.00, division line at midpoint
 *   tennis                  8    90 x 52.5     court 78.00 x 36.00, singles 27.00, alley 4.50
 *
 * Those figures came from per-pixel analysis of pickleball-lines.png,
 * basketball-lines-full-court.png and tennis-court-lines.png, converted at each
 * sport's px/ft. They land on regulation to the hundredth of a foot, which is
 * how we know the scales are real and not coincidence.
 */

/** A concrete pad. `lengthFt` is the long axis (drawn horizontally). */
export interface PadSpec {
  id: PadId;
  label: string;
  widthFt: number;
  lengthFt: number;
  /** Shown in the UI so the buyer understands what they're being quoted. */
  note: string;
}

export type PadId = 'compact' | 'standard' | 'large' | 'full-court' | 'tennis';

export const PADS: Record<PadId, PadSpec> = {
  compact: {
    id: 'compact',
    label: '30 × 56',
    widthFt: 30,
    lengthFt: 56,
    note: 'Tight lots. Regulation play, reduced run-off behind the baselines.',
  },
  standard: {
    id: 'standard',
    label: '35 × 60',
    widthFt: 35,
    lengthFt: 60,
    note: "GRIT's standard residential pad. Full run-off on all four sides.",
  },
  large: {
    id: 'large',
    label: '40 × 68',
    widthFt: 40,
    lengthFt: 68,
    note: 'Tournament-grade surround. Room for spectators and seating.',
  },
  'full-court': {
    id: 'full-court',
    label: '60 × 103',
    widthFt: 60,
    lengthFt: 103,
    note: 'Full-size basketball. Commercial, school, and large-estate builds.',
  },
  tennis: {
    id: 'tennis',
    label: '52.5 × 90',
    widthFt: 52.5,
    lengthFt: 90,
    // Measured from their tennis line art at 8 px/ft: a regulation 78 x 36 court
    // centred with 6ft behind each baseline and 8.25ft down each side. That is a
    // compact residential enclosure — ITF tournament run-off is far deeper — but
    // it is the slab GRIT actually draws, so it is the slab we draw.
    note: 'Regulation 78′ × 36′ court on a compact residential enclosure.',
  },
};

export const PAD_ORDER: PadId[] = ['compact', 'standard', 'large', 'full-court', 'tennis'];

// ─── Pickleball (USA Pickleball) ─────────────────────────────────────────────
export const PICKLEBALL = {
  courtW: 20,
  courtL: 44,
  /** Non-volley zone ("kitchen") extends 7ft from the net on each side. */
  kitchenFromNet: 7,
  /** Service courts run from the kitchen line to the baseline: 22 - 7 = 15ft. */
  serviceDepth: 15,
  /** Net posts sit 1ft outside each sideline. */
  netPostOverhang: 1,
} as const;

// ─── Basketball (NFHS / high school — what residential courts are built to) ──
export const BASKETBALL = {
  laneW: 12,
  /** Baseline to the free-throw line. */
  baselineToFt: 19,
  ftCircleR: 6,
  /** 19'9" high-school three-point radius, measured from the centre of the ring. */
  threePtR: 19.75,
  /** Ring centre is 63in (5.25ft) in from the baseline. */
  hoopFromBaseline: 5.25,
  backboardFromBaseline: 4,
  ringR: 0.75,
  /** Straight section of the arc running off the baseline before it curves. */
  cornerStraight: 3,
  /** Lane-space (block/hash) marks along the lane, measured from the baseline. */
  laneMarks: [7, 11, 14, 17],
  centreCircleR: 6,
  fullCourtW: 50,
  fullCourtL: 84,
} as const;

// ─── Tennis (ITF) ────────────────────────────────────────────────────────────
export const TENNIS = {
  doublesW: 36,
  singlesW: 27,
  courtL: 78,
  /** Each doubles alley is 4.5ft wide. */
  alley: 4.5,
  /** Service line is 21ft from the net. */
  serviceFromNet: 21,
  centreMark: 0.5,
} as const;

/**
 * Which pad a sport defaults to. Tennis needs a far bigger slab than a combo
 * court, and full-court basketball needs the 60x103.
 */
export function defaultPadFor(sport: 'pickleball' | 'basketball' | 'tennis', full = false): PadId {
  if (sport === 'tennis') return 'tennis';
  if (sport === 'basketball' && full) return 'full-court';
  return 'standard';
}

/**
 * Pads a given sport can actually be built on. A regulation tennis court will
 * not fit on a 35x60 slab, so we never offer the combination.
 */
export function padsFor(sport: 'pickleball' | 'basketball' | 'tennis', full = false): PadId[] {
  if (sport === 'tennis') return ['tennis'];
  if (sport === 'basketball' && full) return ['full-court'];
  return ['compact', 'standard', 'large'];
}

/**
 * Does the sport physically fit on the pad? Used to keep the designer honest —
 * a 19'9" arc spans 39.5ft, so a half-court hoop cannot be placed on the short
 * side of a 35ft pad. That single constraint is why GRIT mounts residential
 * hoops on the *long* side, and why their line art is drawn that way.
 */
export function fits(sport: 'pickleball' | 'basketball' | 'tennis', pad: PadSpec, full = false): boolean {
  if (sport === 'pickleball') return pad.lengthFt >= PICKLEBALL.courtL && pad.widthFt >= PICKLEBALL.courtW;
  if (sport === 'tennis') return pad.lengthFt >= TENNIS.courtL && pad.widthFt >= TENNIS.doublesW;
  if (full) return pad.lengthFt >= BASKETBALL.fullCourtL && pad.widthFt >= BASKETBALL.fullCourtW;
  // Half court: the arc runs along the long axis, its depth across the short axis.
  const arcSpan = BASKETBALL.threePtR * 2;
  const arcDepth = BASKETBALL.hoopFromBaseline + BASKETBALL.threePtR;
  return pad.lengthFt >= arcSpan && pad.widthFt >= arcDepth;
}

/** Texture width in px. Height is derived from the pad so aspect is always true. */
export const TEXTURE_W = 1440;

export interface PadPixels {
  w: number;
  h: number;
  /** px per foot */
  scale: number;
  pad: PadSpec;
}

/** Pixel dimensions for a pad, preserving its true aspect ratio. */
export function padPixels(padId: PadId): PadPixels {
  const pad = PADS[padId];
  const scale = TEXTURE_W / pad.lengthFt;
  return {
    w: TEXTURE_W,
    h: Math.round(pad.widthFt * scale),
    scale,
    pad,
  };
}
