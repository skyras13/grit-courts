import { describe, it, expect } from 'vitest';
import {
  PADS,
  PICKLEBALL,
  BASKETBALL,
  TENNIS,
  padPixels,
  fits,
  padsFor,
} from '@/lib/court-geometry';

/**
 * These lock the dimensions to the governing specs. If someone "tidies" a number
 * here the courts stop being real courts, which is exactly the bug this file was
 * written to kill.
 */
describe('regulation dimensions', () => {
  it('pickleball is 20 x 44 with a 7ft non-volley zone', () => {
    expect(PICKLEBALL.courtW).toBe(20);
    expect(PICKLEBALL.courtL).toBe(44);
    expect(PICKLEBALL.kitchenFromNet).toBe(7);
    // Baseline to kitchen line must be the remaining 15ft.
    expect(PICKLEBALL.courtL / 2 - PICKLEBALL.kitchenFromNet).toBe(PICKLEBALL.serviceDepth);
  });

  it('basketball uses high-school spec', () => {
    expect(BASKETBALL.laneW).toBe(12);
    expect(BASKETBALL.baselineToFt).toBe(19);
    expect(BASKETBALL.threePtR).toBe(19.75);
  });

  it('tennis is 36 x 78 with 4.5ft doubles alleys', () => {
    expect(TENNIS.doublesW).toBe(36);
    expect(TENNIS.courtL).toBe(78);
    expect(TENNIS.singlesW + TENNIS.alley * 2).toBe(TENNIS.doublesW);
  });
});

describe('pads match GRIT’s own designer', () => {
  it('the standard residential pad is 35 x 60', () => {
    expect(PADS.standard.widthFt).toBe(35);
    expect(PADS.standard.lengthFt).toBe(60);
  });

  it('reproduces their 720x420 render box aspect ratio', () => {
    // Their designer renders 720x420 at 12 px/ft => 60ft x 35ft.
    const aspect = PADS.standard.lengthFt / PADS.standard.widthFt;
    expect(aspect).toBeCloseTo(720 / 420, 5);
  });

  it('full court is 60 x 103, their 7 px/ft setting', () => {
    expect(PADS['full-court'].lengthFt).toBe(103);
    expect(720 / 103).toBeCloseTo(7, 0);
  });
});

describe('pixel mapping preserves true aspect', () => {
  it('derives height from the pad, never a fixed canvas', () => {
    const p = padPixels('standard');
    expect(p.w / p.h).toBeCloseTo(60 / 35, 2);
  });

  it('a pickleball court is 2.2:1, not squashed', () => {
    const { scale } = padPixels('standard');
    expect((PICKLEBALL.courtL * scale) / (PICKLEBALL.courtW * scale)).toBeCloseTo(2.2, 5);
  });
});

describe('fit constraints', () => {
  it('a regulation tennis court does not fit a residential pad', () => {
    expect(fits('tennis', PADS.standard)).toBe(false);
    expect(fits('tennis', PADS.tennis)).toBe(true);
  });

  it('pickleball fits every residential pad we offer', () => {
    for (const id of padsFor('pickleball')) expect(fits('pickleball', PADS[id])).toBe(true);
  });

  it('a half-court hoop needs the long side: the arc spans 39.5ft', () => {
    // This is why GRIT mounts residential hoops on the 60ft side.
    expect(BASKETBALL.threePtR * 2).toBeGreaterThan(PADS.standard.widthFt);
    expect(BASKETBALL.threePtR * 2).toBeLessThan(PADS.standard.lengthFt);
  });
});

/**
 * Values measured per-pixel out of courtdesigner.builtwithgrit.com's own line
 * art, converted at each sport's px/ft. These are the numbers that make our
 * courts *their* courts, so they are locked here rather than left to drift.
 *
 *   pickleball-lines.png        720x420 @ 12 px/ft
 *     verticals   ft: 7.96, 22.96, 29.96, 36.96, 51.96  (span 44.00)
 *     horizontals ft: 7.46, 27.46                        (span 20.00)
 *   basketball-lines-full-court.png @ 7 px/ft
 *     verticals   ft: 9.43, 51.43, 93.43  (span 84.00, division at midpoint)
 *     horizontals ft: 5.00, 55.00         (span 50.00)
 *   basketball half + secondary overlays @ 12 px/ft
 *     lane lines  ft: 23.83, 36.08  (12ft lane centred on 30ft)
 *     arc width      39.42 ft  => radius 19.71 ft
 *     deepest ink    24.92 ft  => ring 5.21 ft off a baseline at 0
 *   tennis-court-lines.png @ 8 px/ft
 *     verticals   ft: 6.00, 45.00, 84.00  (span 78.00, net at midpoint)
 *     horizontals ft: 8.25, 12.75, 39.75, 44.25 (doubles 36, singles 27, alley 4.5)
 */
describe('measured against GRIT’s own line art', () => {
  it('all three pads share their 12:7 render-box aspect', () => {
    // Their designer keeps one 720x420 box and only changes px/ft, so every pad
    // must come out at the same ratio.
    for (const id of ['standard', 'full-court', 'tennis'] as const) {
      expect(PADS[id].lengthFt / PADS[id].widthFt).toBeCloseTo(720 / 420, 2);
    }
  });

  it('reproduces their pickleball line positions on the 60x35 pad', () => {
    const pad = PADS.standard;
    const ox = (pad.lengthFt - PICKLEBALL.courtL) / 2;
    const oy = (pad.widthFt - PICKLEBALL.courtW) / 2;
    const net = ox + PICKLEBALL.courtL / 2;
    expect(ox).toBeCloseTo(7.96, 1);
    expect(oy).toBeCloseTo(7.46, 1);
    expect(net).toBeCloseTo(29.96, 1);
    expect(net - PICKLEBALL.kitchenFromNet).toBeCloseTo(22.96, 1);
    expect(net + PICKLEBALL.kitchenFromNet).toBeCloseTo(36.96, 1);
  });

  it('reproduces their basketball lane and arc', () => {
    const centre = PADS.standard.lengthFt / 2;
    expect(centre - BASKETBALL.laneW / 2).toBeCloseTo(23.83, 0);
    expect(centre + BASKETBALL.laneW / 2).toBeCloseTo(36.08, 0);
    // Measured arc width 39.42ft; regulation 19'9" radius gives 39.5ft.
    expect(BASKETBALL.threePtR * 2).toBeCloseTo(39.42, 0);
    // Deepest ink 24.92ft = ring centre + radius, with the baseline at 0.
    expect(BASKETBALL.hoopFromBaseline + BASKETBALL.threePtR).toBeCloseTo(24.92, 0);
  });

  it('reproduces their full-court line positions at 7 px/ft', () => {
    const pad = PADS['full-court'];
    const ox = (pad.lengthFt - BASKETBALL.fullCourtL) / 2;
    const oy = (pad.widthFt - BASKETBALL.fullCourtW) / 2;
    expect(ox).toBeCloseTo(9.43, 0);
    expect(oy).toBeCloseTo(5.0, 0);
    expect(ox + BASKETBALL.fullCourtL / 2).toBeCloseTo(51.43, 0);
  });

  it('reproduces their tennis pad — 90 x 52.5 at 8 px/ft, not 60 x 120', () => {
    const pad = PADS.tennis;
    expect(pad.lengthFt).toBe(90);
    expect(pad.widthFt).toBe(52.5);
    const ox = (pad.lengthFt - TENNIS.courtL) / 2;
    const oy = (pad.widthFt - TENNIS.doublesW) / 2;
    expect(ox).toBeCloseTo(6.0, 2); // 6ft behind each baseline
    expect(oy).toBeCloseTo(8.25, 2); // 8.25ft down each side
    expect(oy + TENNIS.alley).toBeCloseTo(12.75, 2); // singles sideline
    expect(ox + TENNIS.courtL / 2).toBeCloseTo(45.0, 2); // net at midpoint
  });
});
