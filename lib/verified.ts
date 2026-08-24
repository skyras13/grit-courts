/**
 * Claims that must be true before they are published.
 *
 * Review counts, star ratings, memberships and prices are all things a real
 * business can be held to — by the FTC, by Google's spam policies, and by the
 * customer standing in their driveway. Demo placeholders for those are fine in a
 * prototype and are a liability the moment the site is pointed at a real domain.
 *
 * So they live behind one switch. Everything here defaults to OFF, and each flag
 * only goes true once the owner has supplied the real figure. Nothing invented
 * ever renders or reaches structured data.
 */

export const VERIFIED = {
  /** Real aggregate rating from a review platform. Emits AggregateRating schema. */
  rating: false,
  /** Trade memberships we can evidence (e.g. HBA). */
  memberships: false,
  /** Owner-approved starting prices. Until true, no price is shown anywhere. */
  prices: false,
  /** Genuine, attributable customer reviews. */
  testimonials: false,
} as const;

/** Convenience: should any social-proof strip render at all? */
export const showSocialProof = VERIFIED.rating || VERIFIED.testimonials;
