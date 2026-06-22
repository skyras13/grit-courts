/**
 * The locked architectural prompt for the AI Backyard Previewer, parameterized by
 * court type. The structure-preservation language is what keeps the house, fence,
 * trees, lighting and camera perspective intact while painting the court in.
 * See docs/04-features/feat-backyard-previewer.md (Appendix C).
 */
import type { CourtType } from '../types';

const SURFACING: Record<CourtType, string> = {
  pickleball:
    'a high-end residential outdoor pickleball court with vibrant blue and green acrylic surfacing, crisp white regulation lines, and a professional net system',
  basketball:
    'a high-end residential outdoor basketball court with rich blue and gray acrylic surfacing, crisp white key and three-point lines, and a professional adjustable hoop system',
  'multi-sport':
    'a high-end residential multi-sport game court with blue and green acrylic surfacing, combined white pickleball and basketball regulation lines, a net system and an adjustable hoop',
  epoxy:
    'a high-end residential decorative flake epoxy floor with a glossy clear topcoat and a clean, level finish',
};

export function buildPrompt(courtType: CourtType): string {
  return (
    `A photorealistic, perfectly level, ${SURFACING[courtType]}, ` +
    `installed cleanly into this exact space. Preserve the original house, fence, ` +
    `trees, landscaping, lighting conditions, shadows, and camera perspective exactly. ` +
    `Natural daylight, sharp focus, architectural visualization quality.`
  );
}

export const NEGATIVE_PROMPT =
  'cartoon, illustration, distorted perspective, warped lines, people, watermark, text, ' +
  'low quality, blurry, oversaturated, changed house, removed trees, fisheye';

/** prompt_strength / strength: high enough to add the court, low enough to keep the yard. */
export const PROMPT_STRENGTH = 0.62;
