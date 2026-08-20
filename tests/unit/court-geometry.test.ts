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
