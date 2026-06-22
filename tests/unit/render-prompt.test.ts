import { describe, it, expect } from 'vitest';
import { buildPrompt, PROMPT_STRENGTH } from '@/lib/render/prompt';

describe('buildPrompt', () => {
  it('includes structure-preservation language for every court type', () => {
    for (const t of ['pickleball', 'basketball', 'multi-sport', 'epoxy'] as const) {
      const p = buildPrompt(t);
      expect(p).toContain('Preserve the original house');
      expect(p).toContain('camera perspective');
    }
  });

  it('parameterizes surfacing by court type', () => {
    expect(buildPrompt('pickleball')).toContain('pickleball');
    expect(buildPrompt('basketball')).toContain('basketball');
    expect(buildPrompt('epoxy')).toContain('epoxy');
  });

  it('keeps prompt strength in the structure-preserving range', () => {
    expect(PROMPT_STRENGTH).toBeGreaterThanOrEqual(0.5);
    expect(PROMPT_STRENGTH).toBeLessThanOrEqual(0.7);
  });
});
