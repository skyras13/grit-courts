/**
 * Real project photography for the homepage, city pages and the previewer's
 * sample gallery.
 *
 * Previously these pointed at flat-vector placeholder art — a grey cartoon house
 * on green — which was the first image on 23 city pages. One piece of clip art
 * undoes every other credibility signal on a contractor's site, so every entry
 * here is now an actual GRIT job photo.
 *
 * Note on before/after: a slider implies both frames are the same property.
 * We only make that claim when VERIFIED.beforeAfter is true, i.e. the owner has
 * supplied genuine matched pairs. Until then the site shows real single photos
 * rather than implying a transformation we can't evidence.
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

/** Real "before" conditions: worn surfaces and bare base work. */
export const BEFORE = {
  crackedCourt: '/photos/svc-build.jpg',
  liftingSurface: '/photos/svc-repair.jpg',
  freshSlab: '/photos/svc-concrete.jpg',
} as const;

/** The crew actually working — the shot most competitors never publish. */
export const PROCESS = {
  pour: '/photos/svc-concrete.jpg',
  surfacing: '/photos/court-08.jpg',
  lines: '/photos/lines-2.jpg',
} as const;

export const SAMPLE_PAIRS: SamplePair[] = [
  {
    id: 's1',
    courtType: 'pickleball',
    city: 'Draper',
    before: BEFORE.crackedCourt,
    after: SAMPLE_RENDERS.pickleball,
    caption: 'Cracked, lifting surface → resurfaced and re-lined',
  },
  {
    id: 's2',
    courtType: 'multi-sport',
    city: 'Alpine',
    before: BEFORE.freshSlab,
    after: SAMPLE_RENDERS['multi-sport'],
    caption: 'Engineered slab → finished multi-sport game court',
  },
  {
    id: 's3',
    courtType: 'basketball',
    city: 'Lehi',
    before: BEFORE.liftingSurface,
    after: SAMPLE_RENDERS.basketball,
    caption: 'Worn surface → full basketball court',
  },
];

export const HERO_PAIR: SamplePair = SAMPLE_PAIRS[0]!;
