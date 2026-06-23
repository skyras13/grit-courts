/**
 * Site content for the "GRIT Courts Site" design — featured/index services, recent
 * work, process, pull quote, gallery, and the pickleball service page. Photo paths
 * point at the real job photos downloaded from builtwithgrit.com (public/photos).
 * Edit copy or swap images here; pages and SEO update automatically.
 */

export const PHOTOS = {
  heroCourt: '/photos/court-04.jpg',
  featPickle: '/photos/jake-court.jpg',
  featBball: '/photos/court-08.jpg',
  featMulti: '/photos/poh-24.jpg',
  prevBefore: '/photos/court-04.jpg',
  prevAfter: '/photos/jake-court.jpg',
  servicePickle: '/photos/jake-court.jpg',
} as const;

export interface FeaturedService {
  name: string;
  hook: string;
  price: string;
  href: string;
  img: string;
}

export const FEATURED_SERVICES: FeaturedService[] = [
  { name: 'Pickleball', hook: 'Regulation courts with cushioned acrylic and a pro net system.', price: 'from $22,000', href: '/services/pickleball', img: PHOTOS.featPickle },
  { name: 'Basketball', hook: 'Half-court to full-court, with adjustable pro hoops.', price: 'from $16,000', href: '/design', img: PHOTOS.featBball },
  { name: 'Multi-Sport', hook: 'Hoops, pickleball, and more on one shared surface.', price: 'from $28,000', href: '/design', img: PHOTOS.featMulti },
];

export interface IndexService {
  num: string;
  name: string;
  hook: string;
  price: string;
  href: string;
}

export const INDEX_SERVICES: IndexService[] = [
  { name: 'Court resurfacing', hook: 'Crack repair and a fresh tournament-grade surface.', price: 'from $6,000', href: '/design' },
  { name: 'Epoxy flake floors', hook: 'Garages, shops, and patios that shine and last.', price: 'from $3,500', href: '/design' },
  { name: 'Concrete & flatwork', hook: 'Reinforced pads, patios, and driveways.', price: 'from $8/sq ft', href: '/design' },
  { name: 'Fencing', hook: 'Court, privacy, and pool-safety fencing.', price: 'from $35/ft', href: '/design' },
  { name: 'Pools', hook: 'Design the whole backyard with one builder.', price: 'from $55,000', href: '/design' },
  { name: 'Landscaping & turf', hook: 'From raw dirt to finished yard, one crew.', price: 'from $6/sq ft', href: '/design' },
  { name: 'In-ground trampolines', hook: 'Flush, safe, and built into the yard.', price: 'from $4,500', href: '/design' },
].map((d, i) => ({ ...d, num: String(i + 4).padStart(2, '0') }));

export interface WorkItem {
  title: string;
  city: string;
  img: string;
}

export const WORK: WorkItem[] = [
  { title: 'Tournament court', city: 'Alpine, UT', img: '/photos/kevin-court.jpg' },
  { title: 'Full basketball court', city: 'Lehi, UT', img: '/photos/court-08.jpg' },
  { title: 'Multi-sport court', city: 'Highland, UT', img: '/photos/poh-24.jpg' },
  { title: 'Backyard pickleball', city: 'Draper, UT', img: '/photos/jake-court.jpg' },
  { title: 'Epoxy garage floor', city: 'Orem, UT', img: '/photos/court-05.jpg' },
  { title: 'Court + turf yard', city: 'Park City, UT', img: '/photos/court-01.jpg' },
];

export const PROCESS = [
  { n: '01', title: 'Walk the yard', desc: 'A free on-site visit to measure, assess grade, and talk through how you want to use the space.' },
  { n: '02', title: 'See it first', desc: 'Preview a finished court in a photo of your yard, or design every detail in 3D with a live estimate.' },
  { n: '03', title: 'One crew builds it', desc: 'Excavation, engineered base, concrete, surfacing, and lines — handled end to end, no subs to chase.' },
  { n: '04', title: 'Play for decades', desc: 'Final coat, fresh lines, and a 10-year surface warranty. Then it is game on.' },
];

export const PULL_QUOTE = {
  quote: 'GRIT turned our sloped, useless side yard into a court the whole neighborhood is jealous of. One crew, one quote, flawless surface.',
  name: 'Megan R.',
  detail: 'Pickleball court, Draper UT',
};

export interface GalleryItem {
  id: string;
  title: string;
  city: string;
  cat: string;
  tall: boolean;
  img: string;
}

export const GALLERY_FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'pickleball', label: 'Pickleball' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'multisport', label: 'Multi-sport' },
  { key: 'epoxy', label: 'Epoxy' },
  { key: 'turf', label: 'Turf & yards' },
  { key: 'pool', label: 'Pools' },
];

export const GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Tournament pickleball', city: 'Alpine, UT', cat: 'pickleball', tall: true, img: '/photos/jake-court.jpg' },
  { id: 'g2', title: 'Backyard pickleball', city: 'Draper, UT', cat: 'pickleball', tall: false, img: '/photos/court-03.jpg' },
  { id: 'g3', title: 'Full basketball court', city: 'Lehi, UT', cat: 'basketball', tall: false, img: '/photos/court-08.jpg' },
  { id: 'g4', title: 'Half court + pro hoop', city: 'Orem, UT', cat: 'basketball', tall: true, img: '/photos/kevin-court.jpg' },
  { id: 'g5', title: 'Multi-sport game court', city: 'Highland, UT', cat: 'multisport', tall: false, img: '/photos/poh-24.jpg' },
  { id: 'g6', title: 'Court + turf transformation', city: 'Park City, UT', cat: 'turf', tall: true, img: '/photos/court-04.jpg' },
  { id: 'g7', title: 'Epoxy flake garage floor', city: 'Provo, UT', cat: 'epoxy', tall: false, img: '/photos/court-05.jpg' },
  { id: 'g8', title: 'Backyard turf + trampoline', city: 'Lindon, UT', cat: 'turf', tall: false, img: '/photos/court-01.jpg' },
  { id: 'g9', title: 'Pool + court backyard', city: 'Alpine, UT', cat: 'pool', tall: true, img: '/photos/court-02.jpg' },
];

export const PICKLE_SERVICE = {
  inclusions: [
    'On-site evaluation + satellite court layout',
    'Excavation and engineered, reinforced base',
    'Regulation 30 × 60 slab with cushioned acrylic surfacing',
    'Hand-taped, tournament-grade lines',
    'Pro net system with tensioned center',
    '10-year surface warranty',
  ],
  addons: 'LED lighting · fencing & windscreen · rebound wall · second court color · color-matched logo',
  startingAt: '$22,000',
  miniGallery: ['/photos/jake-court.jpg', '/photos/court-03.jpg', '/photos/poh-24.jpg'],
  faqs: [
    { q: 'How much does a backyard court cost in Utah?', a: 'Most backyard pickleball courts land between $20,000 and $32,000; multi-sport and full basketball courts run higher. Price depends on size, site prep, and surfacing. The 3D configurator gives you a live range, then we confirm it on a free on-site visit.' },
    { q: 'How long does a build take?', a: 'A typical court takes 3–6 weeks from base prep to final coat, weather permitting. Epoxy floors are often finished in a single week.' },
    { q: 'Do you handle the concrete and excavation?', a: 'Yes — one crew manages the whole project: design, excavation, engineered base, concrete, surfacing, lines, and net or hoop systems. One point of contact, one warranty.' },
    { q: 'Can I really see it in my backyard first?', a: 'Yes. Upload a photo in the Backyard Previewer and we drop a finished court right into your space — your size and colors — before you commit a dollar.' },
    { q: 'What areas do you serve?', a: 'We are based in Provo and build across the Wasatch Front — Utah, Salt Lake, Wasatch, and Summit counties, from Spanish Fork to Park City.' },
  ],
};
