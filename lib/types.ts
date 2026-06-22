/**
 * Domain types shared across the app. These mirror the Supabase schema in
 * supabase/migrations and docs/03-architecture/data-model.md.
 */

export const COURT_TYPES = ['pickleball', 'basketball', 'multi-sport', 'epoxy'] as const;
export type CourtType = (typeof COURT_TYPES)[number];

export const COURT_SIZES = ['30x60', '44x88', 'full-court', 'unsure'] as const;
export type CourtSize = (typeof COURT_SIZES)[number];

export const LAND_CONDITIONS = ['concrete', 'grass-dirt', 'old-court', 'unsure'] as const;
export type LandCondition = (typeof LAND_CONDITIONS)[number];

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const RENDER_STATUSES = ['queued', 'processing', 'done', 'failed'] as const;
export type RenderStatus = (typeof RENDER_STATUSES)[number];

export interface City {
  id: string;
  slug: string;
  name: string;
  county: string;
  landmark: string | null;
  blurb: string | null;
  lat: number | null;
  lng: number | null;
  median_home_value: number | null;
  target_keywords: string[];
  published: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  created_at: string;
  court_type: CourtType | null;
  court_size: CourtSize | null;
  land_condition: LandCondition | null;
  full_name: string;
  phone: string;
  email: string | null;
  property_address: string | null;
  estimated_min: number | null;
  estimated_max: number | null;
  city_slug: string | null;
  render_id: string | null;
  status: LeadStatus;
  sms_consent: boolean;
  sms_consent_at: string | null;
  utm: Record<string, string>;
  fbc: string | null;
  fbp: string | null;
  source: string;
}

export interface Render {
  id: string;
  created_at: string;
  lead_id: string | null;
  court_type: CourtType;
  original_image_path: string;
  rendered_image_url: string | null;
  provider: string | null;
  model: string | null;
  prompt: string | null;
  status: RenderStatus;
  error: string | null;
  latency_ms: number | null;
  cost_usd: number | null;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string | null;
  court_type: CourtType | null;
  rating: number;
  quote: string;
  photo_url: string | null;
  published: boolean;
  created_at: string;
}

export interface PriceEstimate {
  min: number;
  max: number;
  /** Human label, e.g. "$22,000–$31,000". */
  label: string;
  /** Plain-English notes shown to the visitor about what drives the range. */
  notes: string[];
}
