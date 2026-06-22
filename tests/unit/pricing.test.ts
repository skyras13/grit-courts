import { describe, it, expect } from 'vitest';
import { estimatePrice, formatUsd } from '@/lib/pricing';

describe('estimatePrice', () => {
  it('produces a sensible band for a standard backyard pickleball court', () => {
    const e = estimatePrice({ courtType: 'pickleball', courtSize: '30x60', landCondition: 'concrete' });
    expect(e.min).toBeGreaterThan(15_000);
    expect(e.max).toBeLessThan(35_000);
    expect(e.min).toBeLessThan(e.max);
  });

  it('charges more for grass/dirt than existing concrete', () => {
    const concrete = estimatePrice({ courtType: 'pickleball', courtSize: '30x60', landCondition: 'concrete' });
    const grass = estimatePrice({ courtType: 'pickleball', courtSize: '30x60', landCondition: 'grass-dirt' });
    expect(grass.min).toBeGreaterThan(concrete.min);
  });

  it('scales up with court size for non-epoxy types', () => {
    const small = estimatePrice({ courtType: 'basketball', courtSize: '30x60', landCondition: 'concrete' });
    const full = estimatePrice({ courtType: 'basketball', courtSize: 'full-court', landCondition: 'concrete' });
    expect(full.max).toBeGreaterThan(small.max);
  });

  it('ignores court size for epoxy floors', () => {
    const a = estimatePrice({ courtType: 'epoxy', courtSize: '30x60', landCondition: 'concrete' });
    const b = estimatePrice({ courtType: 'epoxy', courtSize: 'full-court', landCondition: 'concrete' });
    expect(a.min).toBe(b.min);
    expect(a.max).toBe(b.max);
  });

  it('rounds to the nearest $500', () => {
    const e = estimatePrice({ courtType: 'multi-sport', courtSize: '44x88', landCondition: 'old-court' });
    expect(e.min % 500).toBe(0);
    expect(e.max % 500).toBe(0);
  });

  it('always returns at least one note and a formatted label', () => {
    const e = estimatePrice({ courtType: 'pickleball', courtSize: 'unsure', landCondition: 'unsure' });
    expect(e.notes.length).toBeGreaterThan(0);
    expect(e.label).toMatch(/^\$[\d,]+–\$[\d,]+$/);
  });
});

describe('formatUsd', () => {
  it('formats with commas and a dollar sign', () => {
    expect(formatUsd(24000)).toBe('$24,000');
  });
});
