/**
 * Prompts for the AI Backyard Previewer.
 *
 * Two view modes, because they are genuinely different problems:
 *
 *   aerial  — a drone or satellite shot. The court is a flat rectangle seen from
 *             above, so the model mainly has to respect the yard's boundaries and
 *             get the colours right. Highest hit-rate, and it matches the way
 *             GRIT's own inspiration gallery is shot.
 *   natural — an eye-level photo from the patio. Much harder: the model has to
 *             infer the ground plane and lay the court in correct perspective.
 *             Worth it because it's the view the customer emotionally responds to.
 *
 * The structure-preservation language is what keeps the house, fence, trees and
 * camera position intact instead of hallucinating a new property.
 */
import type { CourtType } from '../types';

export type RenderView = 'aerial' | 'natural';

const SURFACING: Record<CourtType, string> = {
  pickleball:
    'a high-end residential outdoor pickleball court with acrylic sport surfacing, crisp white regulation lines, and a professional net system',
  basketball:
    'a high-end residential outdoor basketball court with acrylic sport surfacing, crisp white key and three-point lines, and a professional adjustable hoop',
  'multi-sport':
    'a high-end residential multi-sport game court with acrylic sport surfacing, combined white pickleball and basketball regulation lines, a net system and an adjustable hoop',
  epoxy:
    'a high-end residential decorative flake epoxy floor with a glossy clear topcoat and a clean, level finish',
};

const VIEW_DIRECTION: Record<RenderView, string> = {
  aerial:
    'This is a top-down aerial photograph. Keep the exact overhead camera angle. ' +
    'The court must read as a flat rectangle lying on the ground, aligned with the ' +
    'existing property lines and fences, with its corners square and its edges straight.',
  natural:
    'This is an eye-level photograph taken from ground level. Lay the court flat on ' +
    'the existing ground plane in correct one-point perspective, so its far edge is ' +
    'narrower than its near edge and its lines converge toward the horizon. The court ' +
    'must sit level with the surrounding grade — never tilted, floating, or vertical.',
};

/**
 * Builds the image-to-image prompt. `detail` carries the configured design from
 * the court designer, including real dimensions, so the generated court matches
 * what the visitor actually built.
 */
export function buildPrompt(courtType: CourtType, detail?: string, view: RenderView = 'natural'): string {
  return (
    `A photorealistic, perfectly level ${SURFACING[courtType]}, installed cleanly into this exact backyard. ` +
    (detail ? `${detail} ` : '') +
    `${VIEW_DIRECTION[view]} ` +
    `Preserve the original house, fence, trees, landscaping, lighting conditions, shadows, ` +
    `and camera position exactly as they appear. Natural daylight, sharp focus, ` +
    `architectural visualization quality.`
  );
}

export const NEGATIVE_PROMPT =
  'cartoon, illustration, distorted perspective, warped lines, tilted court, floating court, ' +
  'people, watermark, text, low quality, blurry, oversaturated, changed house, removed trees, fisheye';

/**
 * prompt_strength / strength: high enough to add the court, low enough to keep
 * the yard. Aerial tolerates a stronger edit because there's less structure to
 * destroy; eye-level needs a lighter touch or the house starts drifting.
 */
export const PROMPT_STRENGTH: Record<RenderView, number> = {
  aerial: 0.7,
  natural: 0.6,
};
