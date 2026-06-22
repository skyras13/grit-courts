/**
 * Static site content & constants: company NAP, services, FAQs, testimonials,
 * nav. Hardcoded for v1 (OPEN DECISION: Sanity CMS deferred). The owner/developer
 * edits copy here; testimonials can later move to the Supabase `testimonials`
 * table without changing components.
 */
import type { CourtType, Testimonial } from './types';

export const COMPANY = {
  name: 'GRIT Courts',
  legalName: 'GRIT Courts LLC',
  tagline: 'Utah’s custom sport-court builders',
  phone: '(801) 555-0142', // ASSUMPTION: placeholder — swap for the real tracking number
  phoneHref: 'tel:+18015550142',
  email: 'hello@builtwithgrit.com',
  city: 'Provo',
  region: 'UT',
  regionName: 'Utah',
  street: '', // ASSUMPTION: not published; owner to confirm for LocalBusiness schema
  postalCode: '84601',
  areaServed: ['Salt Lake County', 'Utah County', 'Wasatch County', 'Summit County'],
  rating: { value: 4.8, count: 37 }, // from HomeAdvisor footprint; confirm exact count
  foundingYear: 2018, // ASSUMPTION
  brandColor: '#2b598a',
  social: {
    facebook: 'https://www.facebook.com/builtwithgrit',
    instagram: 'https://www.instagram.com/builtwithgrit',
  },
} as const;

export interface ServiceDef {
  slug: CourtType;
  name: string;
  short: string;
  description: string;
  priceFrom: string;
  features: string[];
}

export const SERVICES: ServiceDef[] = [
  {
    slug: 'pickleball',
    name: 'Pickleball Courts',
    short: 'The backyard upgrade everyone’s asking for.',
    description:
      'Regulation 30×60 backyard pickleball courts with cushioned acrylic surfacing, crisp lines, and a pro net system — built on an engineered base that plays true for decades.',
    priceFrom: 'from $20,000',
    features: ['Regulation lines & net', 'Cushioned acrylic surface', 'Custom color combos', 'Optional fencing & lights'],
  },
  {
    slug: 'basketball',
    name: 'Basketball Courts',
    short: 'Half-court to full-court, built to last.',
    description:
      'Outdoor basketball courts from key-only half-courts to full-size, with adjustable pro hoops, true-bounce surfacing, and weather-tough lines.',
    priceFrom: 'from $24,000',
    features: ['Adjustable pro hoop', 'True-bounce surface', 'Key & three-point lines', 'Glass or acrylic backboard'],
  },
  {
    slug: 'multi-sport',
    name: 'Multi-Sport Courts',
    short: 'Pickleball, hoops, and more — one court.',
    description:
      'The do-it-all game court: combined pickleball and basketball lines, an adjustable hoop, and a net system so the whole family plays on a single surface.',
    priceFrom: 'from $30,000',
    features: ['Multi-game line sets', 'Hoop + net combo', 'Rebounder & fencing options', 'Tournament sizing available'],
  },
  {
    slug: 'epoxy',
    name: 'Epoxy Flake Floors',
    short: 'Garages, shops, and patios that shine.',
    description:
      'Decorative flake epoxy with a clear topcoat — a tough, beautiful, easy-clean floor for garages, shops, and covered patios. The fast, lower-cost way to get GRIT quality.',
    priceFrom: 'from $5,500',
    features: ['Decorative flake blends', 'Clear UV topcoat', 'Hot-tire & chemical resistant', 'Same-week install'],
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const GLOBAL_FAQS: Faq[] = [
  {
    q: 'How much does a backyard court cost in Utah?',
    a: 'Most of our backyard pickleball courts land between $20,000 and $32,000, and multi-sport courts run higher. Price depends on size, site prep, and surfacing. Use our 60-second estimator for a tailored range, then we confirm it with a free on-site visit.',
  },
  {
    q: 'How long does it take to build?',
    a: 'A typical court takes 3–6 weeks from base prep to the final coat, weather permitting. Epoxy floors are often done in a single week.',
  },
  {
    q: 'Do you handle the concrete and excavation?',
    a: 'Yes — we manage the whole project end to end: design, excavation, engineered base, concrete, surfacing, lines, and net/hoop systems. One crew, one warranty.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We’re based in Provo and build across the Wasatch Front — Utah, Salt Lake, Wasatch, and Summit counties, from Spanish Fork to Park City.',
  },
  {
    q: 'Can I see what a court would look like in my yard?',
    a: 'Yes — that’s our favorite part. Upload a photo of your space and our AI previewer renders a finished court right onto it in seconds. No guessing.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Megan R.',
    city: 'Draper',
    court_type: 'pickleball',
    rating: 5,
    quote:
      'GRIT turned our sloped, useless side yard into a gorgeous pickleball court. The crew leveled everything and the surface is flawless. Our neighbors are jealous.',
    photo_url: null,
    published: true,
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 't2',
    name: 'Tyson & Aubrey K.',
    city: 'Alpine',
    court_type: 'multi-sport',
    rating: 5,
    quote:
      'We wanted hoops for the kids and pickleball for us. The multi-sport court they built does both and the lines are perfect. Best money we’ve spent on the house.',
    photo_url: null,
    published: true,
    created_at: '2025-06-15T00:00:00Z',
  },
  {
    id: 't3',
    name: 'David M.',
    city: 'Lehi',
    court_type: 'basketball',
    rating: 5,
    quote:
      'Professional from quote to final coat. The full-court plays like a gym and looks incredible. They hit the timeline they promised.',
    photo_url: null,
    published: true,
    created_at: '2025-09-10T00:00:00Z',
  },
  {
    id: 't4',
    name: 'Sara L.',
    city: 'Park City',
    court_type: 'pickleball',
    rating: 5,
    quote:
      'They knew exactly how to build for our mountain weather. Two winters in and the surface still looks brand new.',
    photo_url: null,
    published: true,
    created_at: '2025-05-20T00:00:00Z',
  },
];

export const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/preview', label: 'AI Preview' },
  { href: '/estimate', label: 'Get an Estimate' },
  { href: '/#proof', label: 'Our Work' },
  { href: '/service-area', label: 'Service Area' },
] as const;
