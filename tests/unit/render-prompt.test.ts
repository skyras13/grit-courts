import { describe, it, expect } from 'vitest';
import { buildPrompt, NEGATIVE_PROMPT, PROMPT_STRENGTH } from '@/lib/render/prompt';
import { COURT_TYPES } from '@/lib/types';

describe('buildPrompt', () => {
  it('preserves the existing property in every court type and view', () => {
    for (const t of COURT_TYPES) {
      for (const v of ['aerial', 'natural'] as const) {
        const p = buildPrompt(t, undefined, v);
        expect(p).toContain('Preserve the original house');
        expect(p).toContain('camera position exactly');
      }
    }
  });

  it('defaults to the eye-level view', () => {
    expect(buildPrompt('pickleball')).toBe(buildPrompt('pickleball', undefined, 'natural'));
  });

  it('gives the model genuinely different framing instructions per view', () => {
    const aerial = buildPrompt('pickleball', undefined, 'aerial');
    const natural = buildPrompt('pickleball', undefined, 'natural');
    expect(aerial).toContain('top-down aerial');
    expect(aerial).toContain('flat rectangle');
    expect(natural).toContain('eye-level');
    expect(natural).toContain('perspective');
    expect(aerial).not.toBe(natural);
  });

  it('includes the design detail so the render matches what was configured', () => {
    const p = buildPrompt('pickleball', 'court in competition blue on a 35ft by 60ft slab');
    expect(p).toContain('competition blue');
    expect(p).toContain('35ft by 60ft');
  });

  it('guards against the failure modes we actually see', () => {
    expect(NEGATIVE_PROMPT).toContain('tilted court');
    expect(NEGATIVE_PROMPT).toContain('floating court');
    expect(NEGATIVE_PROMPT).toContain('changed house');
  });
});

describe('PROMPT_STRENGTH', () => {
  it('stays in the structure-preserving range for both views', () => {
    for (const v of ['aerial', 'natural'] as const) {
      expect(PROMPT_STRENGTH[v]).toBeGreaterThanOrEqual(0.5);
      expect(PROMPT_STRENGTH[v]).toBeLessThanOrEqual(0.75);
    }
  });

  it('edits aerial harder than eye-level — less structure to destroy', () => {
    expect(PROMPT_STRENGTH.aerial).toBeGreaterThan(PROMPT_STRENGTH.natural);
  });
});
