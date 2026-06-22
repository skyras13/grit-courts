/**
 * Court price estimator model.
 *
 * Pure, deterministic, and unit-tested (tests/unit/pricing.test.ts). The numbers
 * are honest order-of-magnitude ranges for the Wasatch Front market the owner
 * quoted ($18k–$45k typical). They are intentionally conservative and shown as a
 * RANGE so the estimator sets expectations without over-promising. Tune in one
 * place; see docs/04-features/feat-court-estimator-funnel.md.
 *
 * No magic numbers float free in the codebase — every constant is named here.
 */
import type { CourtSize, CourtType, LandCondition, PriceEstimate } from './types';

/** Base installed price (USD) for a finished court by type, at the typical size. */
const BASE_PRICE: Record<CourtType, number> = {
  pickleball: 24_000,
  basketball: 28_000,
  'multi-sport': 34_000,
  epoxy: 6_500, // garage/shop/patio epoxy flake floor — lower-ticket warming entry
};

/** Size multiplier applied to the base price. "unsure" assumes the typical size. */
const SIZE_MULTIPLIER: Record<CourtSize, number> = {
  '30x60': 1.0, // standard backyard pickleball footprint
  '44x88': 1.55, // tournament / multi-use
  'full-court': 1.9, // full basketball
  unsure: 1.0,
};

/**
 * Land/site-prep multiplier. Existing concrete is cheapest; turning grass/dirt
 * into a pad costs the most; resurfacing an old court is in between.
 */
const LAND_MULTIPLIER: Record<LandCondition, number> = {
  concrete: 1.0,
  'old-court': 1.12,
  'grass-dirt': 1.28,
  unsure: 1.15,
};

/** Half-width of the quoted band, as a fraction of the midpoint. */
const RANGE_SPREAD = 0.16;

/** Round to the nearest $500 so ranges read like real quotes. */
function roundTo(value: number, step = 500): number {
  return Math.round(value / step) * step;
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

export interface EstimateInput {
  courtType: CourtType;
  courtSize: CourtSize;
  landCondition: LandCondition;
}

export function estimatePrice({
  courtType,
  courtSize,
  landCondition,
}: EstimateInput): PriceEstimate {
  // Epoxy floors don't scale by court size — keep the size factor neutral.
  const sizeFactor = courtType === 'epoxy' ? 1.0 : SIZE_MULTIPLIER[courtSize];
  const midpoint = BASE_PRICE[courtType] * sizeFactor * LAND_MULTIPLIER[landCondition];

  const min = roundTo(midpoint * (1 - RANGE_SPREAD));
  const max = roundTo(midpoint * (1 + RANGE_SPREAD));

  const notes: string[] = [];
  if (landCondition === 'grass-dirt') {
    notes.push('Includes excavation and a new engineered concrete base.');
  } else if (landCondition === 'concrete') {
    notes.push('Assumes your existing slab is sound — saves on site prep.');
  } else if (landCondition === 'old-court') {
    notes.push('Covers crack repair and resurfacing over your existing court.');
  } else {
    notes.push("We'll confirm site prep on a free on-site visit.");
  }

  if (courtType === 'multi-sport') {
    notes.push('Multi-game lines (pickleball + basketball) and adjustable hoop included.');
  }
  if (courtType === 'epoxy') {
    notes.push('Decorative flake epoxy with a clear topcoat; price scales with square footage.');
  }
  notes.push('Final quote confirmed after a free design consult — no obligation.');

  return {
    min,
    max,
    label: `${formatUsd(min)}–${formatUsd(max)}`,
    notes,
  };
}
