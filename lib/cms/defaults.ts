/**
 * Seed content. This is what the site ships with and what the CMS restores to.
 *
 * The page set is drawn from builtwithgrit.com's own sitemap.xml, so the rebuild
 * covers every page the live site has — including the revenue lines the old
 * build missed entirely (epoxy, sports-line painting, coatings products, golf
 * simulators, trade partners, referrals).
 */
import type { SiteContent } from './types';

export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  updatedAt: '2026-01-01T00:00:00.000Z',
  business: {
    name: 'GRIT Courts',
    tagline: 'Utah’s trusted court builders',
    phone: '',
    email: 'grant@builtwithgrit.com',
    salesEmail: 'sales@builtwithgrit.com',
    street: '',
    city: 'Provo',
    region: 'UT',
    postalCode: '84601',
    hours: 'Mon–Fri 8:00–6:00',
    areaServed: ['Utah County', 'Salt Lake County', 'Wasatch County', 'Summit County', 'Davis County'],
    courtsBuilt: '20+',
    foundingYear: 2018,
  },
  social: {
    facebook: 'https://www.facebook.com/builtwithgrit',
    instagram: 'https://www.instagram.com/gritcourts',
    youtube: '',
    googleBusiness: '',
  },
  special: {
    enabled: false,
    headline: 'Winter booking — save on spring installs',
    body: 'Reserve your 2026 build before March and lock in this season’s surfacing price.',
    ctaLabel: 'Get a quote',
    ctaHref: '/contact',
    expiresAt: null,
  },
  home: {
    heroEyebrow: 'Utah’s trusted court builders',
    heroTitle: 'Your backyard. Your court. Built with GRIT.',
    heroBody:
      'We design and install professional basketball and pickleball courts for homes and businesses across Utah — engineered base, cushioned acrylic surfacing, and lines that play true for decades.',
    heroCtaPrimary: 'Design your court',
    heroCtaSecondary: 'See it in your yard',
    sectionTitle: 'Upgrade Your Home Today!',
    sectionBody:
      'A court is the one addition that gets used every single day. It brings the neighbourhood to your driveway, keeps the kids home, and adds real value to your property.',
  },
  // Full parity with the live sitemap.
  pages: [
    { slug: 'about', label: 'About', metaTitle: 'About GRIT Courts | Utah Court Builders', metaDescription: 'Meet the Utah crew behind GRIT Courts — court builders, resurfacers and coatings specialists serving the Wasatch Front.', heading: 'Built with GRIT', intro: 'We’re a Utah crew that builds courts we’d want in our own backyards.', body: '' },
    { slug: 'court-surfacing', label: 'Court Surfacing', metaTitle: 'Court Surfacing & Resurfacing in Utah | GRIT Courts', metaDescription: 'Acrylic court surfacing and resurfacing across Utah. Cushioned systems, crack repair, and colour-matched finishes for pickleball, basketball and tennis.', heading: 'Court Surfacing', intro: 'Resurfacing brings a tired court back to tournament condition in days, not weeks.', body: '' },
    { slug: 'gallery', label: 'Gallery', metaTitle: 'Court Gallery | Utah Backyard Courts | GRIT Courts', metaDescription: 'Real GRIT courts across Utah — backyard pickleball, basketball half-courts, and multi-sport game courts. Browse colours and layouts.', heading: 'Our Work', intro: 'Every photo here is a court we built.', body: '' },
    { slug: 'services', label: 'Our Services', metaTitle: 'Our Services | Court Building & Coatings | GRIT Courts', metaDescription: 'Court construction, surfacing, sports-line painting, epoxy floors, concrete, fencing and lighting — everything GRIT Courts does across Utah.', heading: 'Our Services', intro: 'From the base up, or just the final coat.', body: '' },
    { slug: 'coatings', label: 'Coatings', metaTitle: 'Concrete Coatings Utah | Garage & Patio | GRIT Courts', metaDescription: 'Durable concrete coatings for garages, patios and shops across Utah — polyaspartic and epoxy systems that outlast the slab.', heading: 'Coatings', intro: 'The same materials science we put under a court, applied to your garage floor.', body: '' },
    { slug: 'coatings-products', label: 'Coatings Products', metaTitle: 'Coatings Products & Colour Chart | GRIT Courts', metaDescription: 'Browse GRIT Courts coating products and the full acrylic colour chart for court surfacing.', heading: 'Coatings Products', intro: 'Our full product line and colour chart.', body: '' },
    { slug: 'epoxy', label: 'Epoxy Flooring', metaTitle: 'Epoxy Flooring | Durable & Custom Finish | GRIT Courts', metaDescription: 'Decorative flake epoxy floors for Utah garages, basements and shops. Chemical-resistant, seamless, and installed in a day.', heading: 'Epoxy Flooring', intro: 'A garage floor you can hose off and never think about again.', body: '' },
    { slug: 'sports-lines', label: 'Sports Lines', metaTitle: 'Court Line Painting on Concrete | Basketball & Pickleball | GRIT Courts', metaDescription: 'Regulation sports-line painting on existing concrete — pickleball, basketball, tennis and multi-sport layouts, painted to spec across Utah.', heading: 'Sports Line Painting', intro: 'Already have concrete? We can put regulation lines on it.', body: '' },
    { slug: 'golf-simulators', label: 'Golf Simulators', metaTitle: 'How Much Does it Cost To Build A Golf Simulator In Utah? | GRIT Courts', metaDescription: 'What a golf simulator build actually costs in Utah — room requirements, screen and launch monitor options, and full turnkey pricing.', heading: 'Golf Simulators', intro: 'What a simulator bay really costs to build in Utah.', body: '' },
    { slug: 'trade-partners', label: 'Trade Partners', metaTitle: 'Trade Partners | GRIT Courts', metaDescription: 'Builders, landscapers and pool contractors — partner with GRIT Courts on court construction and surfacing for your clients.', heading: 'Trade Partners', intro: 'We work behind the scenes for builders, landscapers and pool contractors.', body: '' },
    { slug: 'referrals', label: 'Referrals', metaTitle: 'Referral Program | GRIT Courts', metaDescription: 'Refer a friend to GRIT Courts and get rewarded when their court gets built.', heading: 'Referrals', intro: 'Most of our work comes from neighbours talking to neighbours.', body: '' },
    { slug: 'warranty', label: 'Warranty Agreement', metaTitle: 'Warranty Agreement | GRIT Courts', metaDescription: 'The GRIT Courts warranty on court construction, surfacing and coatings.', heading: 'Warranty Agreement', intro: 'What we stand behind, in plain language.', body: '' },
    { slug: 'contact', label: 'Contact Us', metaTitle: 'Contact GRIT Courts | Free Court Estimate in Utah', metaDescription: 'Get a free on-site estimate for a backyard court anywhere along the Wasatch Front. Tell us about your space and we’ll come measure it.', heading: 'Let’s talk about your court', intro: 'Tell us about your space and we’ll come measure it — free.', body: '' },
  ],
  services: [
    { id: 'pickleball', name: 'Pickleball Courts', hook: 'Regulation backyard courts with cushioned acrylic and a pro net system.', body: '', image: '/photos/court-05.jpg', featured: true, order: 1 },
    { id: 'basketball', name: 'Basketball Courts', hook: 'Half-court to full-court, with adjustable pro hoops that play true.', body: '', image: '/photos/jake-court.jpg', featured: true, order: 2 },
    { id: 'multi-sport', name: 'Multi-Sport Game Courts', hook: 'Hoops, pickleball and more on one shared, colour-matched surface.', body: '', image: '/photos/poh-24.jpg', featured: true, order: 3 },
    { id: 'surfacing', name: 'Court Surfacing & Resurfacing', hook: 'Bring a faded or cracked court back to tournament condition.', body: '', image: '/photos/court-08.jpg', featured: false, order: 4 },
    { id: 'sports-lines', name: 'Sports Line Painting', hook: 'Regulation lines painted onto your existing concrete.', body: '', image: null, featured: false, order: 5 },
    { id: 'epoxy', name: 'Epoxy Flooring', hook: 'Flake epoxy and polyaspartic floors for garages and shops.', body: '', image: '/photos/epoxy-1.jpg', featured: false, order: 6 },
    { id: 'concrete', name: 'Concrete & Base Work', hook: 'The engineered slab everything else depends on.', body: '', image: null, featured: false, order: 7 },
    { id: 'fencing', name: 'Fencing & Netting', hook: 'Ball containment that doesn’t look like a cage.', body: '', image: null, featured: false, order: 8 },
    { id: 'lighting', name: 'Court Lighting', hook: 'LED systems so the court doesn’t close at sunset.', body: '', image: null, featured: false, order: 9 },
    { id: 'golf-simulators', name: 'Golf Simulators', hook: 'Turnkey simulator bays, framing through launch monitor.', body: '', image: null, featured: false, order: 10 },
  ],
  gallery: [],
  faqs: [
    { id: 'f1', question: 'How much does a backyard court cost in Utah?', answer: 'It depends on the slab. A resurface on good existing concrete is the cheapest path; a new engineered base, surfacing, fencing and lights is the most involved. We give a firm number after we walk the site — no guessing from a photo.', group: 'court' },
    { id: 'f2', question: 'How long does a court take to build?', answer: 'Most residential builds run two to four weeks from breaking ground to first serve, weather depending. Resurfacing an existing court is usually three to five days.', group: 'court' },
    { id: 'f3', question: 'What size pad do I need for pickleball?', answer: 'The court itself is 20ft by 44ft, but you want run-off behind the baselines. Our standard residential pad is 35ft by 60ft. We can build a 30ft by 56ft on a tight lot — you keep regulation play with less room behind the line.', group: 'court' },
    { id: 'f4', question: 'Can I have pickleball and basketball on the same court?', answer: 'Yes — it’s our most requested build. The hoop goes on the long side so the three-point arc fits, and we paint the basketball lines in a second colour that breaks where it crosses the pickleball lines so both read clearly.', group: 'court' },
    { id: 'f5', question: 'Do you work in the winter?', answer: 'Concrete and base work continue in cold weather. Acrylic surfacing needs consistent temperatures, so we schedule coatings for spring through autumn — which is exactly why booking in winter gets you an early slot.', group: 'court' },
    { id: 'f6', question: 'How long do the coatings last?', answer: 'A properly installed acrylic system holds colour for eight to twelve years before it wants a refresh. The base underneath, if it’s built right, lasts decades.', group: 'coatings' },
  ],
  testimonials: [],
  integrations: {
    renderProvider: 'mock',
    replicateModel: 'black-forest-labs/flux-dev',
    gaMeasurementId: '',
    metaPixelId: '',
    ownerNotifyEmail: 'grant@builtwithgrit.com',
    leadWebhookUrl: '',
  },
  seo: {
    defaultTitle: 'Custom Basketball & Pickleball Court Builders | GRIT Courts',
    titleTemplate: '%s | GRIT Courts',
    defaultDescription:
      'Utah’s trusted court builders. We design and install professional basketball and pickleball courts for homes and businesses. Free on-site estimate.',
    ogImage: '/photos/court-01.jpg',
    cities: [
      'Provo', 'Orem', 'Lehi', 'American Fork', 'Pleasant Grove', 'Alpine', 'Highland',
      'Draper', 'Sandy', 'South Jordan', 'Herriman', 'Riverton', 'Lone Peak',
      'Park City', 'Heber City', 'Salt Lake City', 'Bountiful', 'Farmington', 'Kaysville', 'Layton',
    ],
  },
};
