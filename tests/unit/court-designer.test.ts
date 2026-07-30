import { describe, it, expect } from 'vitest';
import {
  SURFACE_COLORS,
  DEFAULT_DESIGN,
  SPORT_ZONES,
  colorName,
  colorHex,
  designDetail,
  designSummary,
} from '@/lib/court-designer';

describe('surface colors — parity with courtdesigner.builtwithgrit.com', () => {
  it('offers exactly the 15 acrylic colors', () => {
    expect(SURFACE_COLORS).toHaveLength(15);
  });
  it('matches their exact named values', () => {
    const byName = Object.fromEntries(SURFACE_COLORS.map((c) => [c.name, c.hex]));
    expect(byName['Competition Green']).toBe('#38603e'); // rgb(56,96,62)
    expect(byName['Competition Blue']).toBe('#153056'); // rgb(21,48,86)
    expect(byName['Gray']).toBe('#696c6f'); // rgb(105,108,111)
    expect(byName['Bright Yellow']).toBe('#fdb714');
    expect(byName['Black']).toBe('#000000');
  });
  it('uses their defaults: green border, blue court, gray kitchen', () => {
    expect(colorName(DEFAULT_DESIGN.zones.border)).toBe('Competition Green');
    expect(colorName(DEFAULT_DESIGN.zones.court)).toBe('Competition Blue');
    expect(colorName(DEFAULT_DESIGN.zones.kitchen)).toBe('Gray');
  });
});

describe('sport zones', () => {
  it('exposes the right colorable zones per sport', () => {
    expect(SPORT_ZONES.pickleball.map((z) => z.key)).toEqual(['border', 'court', 'kitchen']);
    expect(SPORT_ZONES.basketball.map((z) => z.key)).toEqual(['border', 'threePoint', 'topOfKey', 'key']);
    expect(SPORT_ZONES.tennis.map((z) => z.key)).toEqual(['border', 'court']);
  });
});

describe('designDetail / designSummary', () => {
  it('builds an AI prompt naming the sport and zone colors', () => {
    const d = designDetail(DEFAULT_DESIGN);
    expect(d.toLowerCase()).toContain('pickleball');
    expect(d.toLowerCase()).toContain('competition blue');
  });
  it('summary carries no price and includes the sport', () => {
    const rows = designSummary(DEFAULT_DESIGN);
    expect(rows[0]).toEqual({ k: 'Sport', v: 'Pickleball' });
    expect(rows.some((r) => /\$/.test(r.v))).toBe(false);
  });
});

describe('colorHex', () => {
  it('falls back to Competition Blue for unknown ids', () => {
    expect(colorHex('nope')).toBe('#153056');
  });
});
