/**
 * The editable content model.
 *
 * Everything the owner should be able to change without a developer lives here.
 * Copy that is structural (nav order, route names) deliberately does NOT — a CMS
 * that lets you break your own information architecture is a liability, not a
 * feature.
 *
 * Secrets are the exception: they are referenced by name here but their values
 * live in lib/cms/secrets.ts and are never serialised to the browser.
 */

export interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  salesEmail: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  hours: string;
  areaServed: string[];
  courtsBuilt: string;
  foundingYear: number;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  googleBusiness: string;
}

/** Site-wide promo bar. The single most-requested small-business CMS feature. */
export interface Special {
  enabled: boolean;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** ISO date; the bar hides itself automatically after this. */
  expiresAt: string | null;
}

export interface HomeContent {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  sectionTitle: string;
  sectionBody: string;
}

export interface PageContent {
  slug: string;
  /** Nav/UI label. */
  label: string;
  /** <title> — the single highest-leverage SEO field on the page. */
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  /** Markdown-ish body; rendered as paragraphs. */
  body: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  hook: string;
  body: string;
  image: string | null;
  featured: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  /** Drives the city pages — a photo tagged "Lehi" appears on /utah/lehi. */
  city: string;
  sport: 'pickleball' | 'basketball' | 'tennis' | 'multi-sport' | 'epoxy' | 'other';
  colors: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Which page it shows on; also emitted as FAQPage schema. */
  group: 'court' | 'coatings' | 'general';
}

export interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
}

/** Non-secret integration settings. Key *values* live in secrets.ts. */
export interface IntegrationSettings {
  renderProvider: 'mock' | 'replicate' | 'fal';
  replicateModel: string;
  gaMeasurementId: string;
  metaPixelId: string;
  ownerNotifyEmail: string;
  leadWebhookUrl: string;
}

export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  /** Cities we generate landing pages for. Owner-editable = owner-expandable. */
  cities: string[];
}

export interface SiteContent {
  version: number;
  updatedAt: string;
  business: BusinessInfo;
  social: SocialLinks;
  special: Special;
  home: HomeContent;
  pages: PageContent[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  integrations: IntegrationSettings;
  seo: SeoSettings;
}

/** Names of the secrets the owner can set from the dashboard. */
export const SECRET_KEYS = [
  'FAL_KEY',
  'REPLICATE_API_TOKEN',
  'RESEND_API_KEY',
  'META_CAPI_TOKEN',
  'GOOGLE_MAPS_API_KEY',
] as const;

export type SecretKey = (typeof SECRET_KEYS)[number];

export const SECRET_LABELS: Record<SecretKey, { label: string; help: string; url: string }> = {
  FAL_KEY: {
    label: 'fal.ai API key',
    help: 'Powers the AI backyard previewer. Fastest and cheapest option — about a cent a render.',
    url: 'https://fal.ai/dashboard/keys',
  },
  REPLICATE_API_TOKEN: {
    label: 'Replicate API token',
    help: 'Alternative AI image provider. Use if you prefer Replicate’s model catalogue.',
    url: 'https://replicate.com/account/api-tokens',
  },
  RESEND_API_KEY: {
    label: 'Resend API key',
    help: 'Sends you an email the moment a lead comes in.',
    url: 'https://resend.com/api-keys',
  },
  META_CAPI_TOKEN: {
    label: 'Meta Conversions API token',
    help: 'Reports leads back to Facebook so your ads learn who actually converts.',
    url: 'https://business.facebook.com/events_manager',
  },
  GOOGLE_MAPS_API_KEY: {
    label: 'Google Maps API key',
    help: 'Lets the yard planner pull a satellite image straight from a customer’s address.',
    url: 'https://console.cloud.google.com/google/maps-apis/credentials',
  },
};
