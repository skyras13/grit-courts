/**
 * Curated before/after sample pairs for the homepage and the previewer's sample
 * gallery, so the AI feature is compelling before any user uploads a photo.
 *
 * These use Unsplash placeholders for the demo. Replace `before`/`after` with the
 * owner's real job-site photos and AI renders for production (see
 * docs/08-handoff/maintenance.md). `after` reuses SAMPLE_RENDERS by court type.
 */
import type { CourtType } from './types';
import { SAMPLE_RENDERS } from './render';

export interface SamplePair {
  id: string;
  courtType: CourtType;
  city: string;
  before: string;
  after: string;
  caption: string;
}

// Self-contained "before" yard illustration (no network dependency).
const before = {
  yardGrass: '/samples/yard-before.svg',
  yardConcrete: '/samples/yard-before.svg',
  yardOpen: '/samples/yard-before.svg',
};

export const SAMPLE_PAIRS: SamplePair[] = [
  {
    id: 's1',
    courtType: 'pickleball',
    city: 'Draper',
    before: before.yardGrass,
    after: SAMPLE_RENDERS.pickleball,
    caption: 'Sloped side yard → regulation pickleball court',
  },
  {
    id: 's2',
    courtType: 'multi-sport',
    city: 'Alpine',
    before: before.yardOpen,
    after: SAMPLE_RENDERS['multi-sport'],
    caption: 'Open backyard → multi-sport game court',
  },
  {
    id: 's3',
    courtType: 'basketball',
    city: 'Lehi',
    before: before.yardConcrete,
    after: SAMPLE_RENDERS.basketball,
    caption: 'Plain slab → full basketball court',
  },
];

export const HERO_PAIR: SamplePair = SAMPLE_PAIRS[0]!;
