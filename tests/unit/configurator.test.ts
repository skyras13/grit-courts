import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CONFIG,
  PALETTES,
  accForType,
  configPrice,
  configSummary,
  toLeadCourtType,
} from '@/lib/configurator';

describe('configPrice', () => {
  it('prices a standard pickleball court in a sane band', () => {
    const p = configPrice(DEFAULT_CONFIG);
    expect(p.min).toBeGreaterThan(18_000);
    expect(p.max).toBeLessThan(30_000);
    expect(p.min).toBeLessThan(p.max);
  });

  it('adds for fence and lights', () => {
    const base = configPrice(DEFAULT_CONFIG).total;
    const withAddons = configPrice({ ...DEFAULT_CONFIG, acc: { ...DEFAULT_CONFIG.acc, fence: true, lights: true } }).total;
    expect(withAddons).toBe(base + 4800 + 3900);
  });

  it('scales up for a full court', () => {
    const standard = configPrice({ ...DEFAULT_CONFIG, courtType: 'basketball', size: 'standard' }).total;
    const full = configPrice({ ...DEFAULT_CONFIG, courtType: 'basketball', size: 'full' }).total;
    expect(full).toBeGreaterThan(standard);
  });

  it('rounds the band to the nearest $500', () => {
    const p = configPrice({ ...DEFAULT_CONFIG, courtType: 'multisport', size: 'tournament' });
    expect(p.min % 500).toBe(0);
    expect(p.max % 500).toBe(0);
  });
});

describe('accForType', () => {
  it('turns the hoop on for basketball and net off', () => {
    const acc = accForType('basketball', DEFAULT_CONFIG.acc);
    expect(acc.hoop).toBe(true);
    expect(acc.net).toBe(false);
  });
  it('turns net on and hoop off for pickleball', () => {
    const acc = accForType('pickleball', { ...DEFAULT_CONFIG.acc, hoop: true, net: false });
    expect(acc.net).toBe(true);
    expect(acc.hoop).toBe(false);
  });
});

describe('toLeadCourtType', () => {
  it('maps multisport to the lead court type', () => {
    expect(toLeadCourtType('multisport')).toBe('multi-sport');
    expect(toLeadCourtType('pickleball')).toBe('pickleball');
  });
});

describe('configSummary', () => {
  it('summarizes the config with a palette name', () => {
    const rows = configSummary(DEFAULT_CONFIG);
    expect(rows.find((r) => r.k === 'Surface combo')?.v).toBe(PALETTES[0]!.name);
  });
});
