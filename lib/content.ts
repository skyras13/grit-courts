/**
 * Site content for GRIT Courts — built from the live site's real positioning
 * ("Utah's trusted court builders") and the real job photos in public/photos
 * (every photo is an actual GRIT court). No invented services or fake imagery:
 * GRIT builds basketball, pickleball, and multi-sport courts (indoor & outdoor),
 * plus resurfacing, epoxy, and the concrete base work that goes under a court.
 */

export const PHOTOS = {
  heroCourt: '/photos/court-01.jpg', // finished backyard basketball court, mountains
  featPickle: '/photos/court-05.jpg', // blue/green multi-use court
  featBball: '/photos/jake-court.jpg', // backyard basketball court + hoop
  featMulti: '/photos/poh-24.jpg', // outdoor multi-sport court + hoop & lines
  prevBefore: '/photos/court-08.jpg', // crew mid-surfacing (the "before")
  prevAfter: '/photos/poh-24.jpg', // finished court (the "after")
  servicePickle: '/photos/court-05.jpg',
} as const;

export interface FeaturedService {
  name: string;
  hook: string;
  price: string;
  href: string;
  img: string;
}

export const FEATURED_SERVICES: FeaturedService[] = [
  { name: 'Pickleball', hook: 'Regulation backyard courts with cushioned acrylic and a pro net system.', price: 'from $22,000', href: '/services/pickleball', img: PHOTOS.featPickle },
  { name: 'Basketball', hook: 'Half-court to full-court, with adjustable pro hoops that play true.', price: 'from $16,000', href: '/design', img: PHOTOS.featBball },
  { name: 'Multi-Sport', hook: 'Hoops, pickleball, and more on one shared, color-matched surface.', price: 'from $28,000', href: '/design', img: PHOTOS.featMulti },
];

export interface IndexService {
  num: string;
  name: string;
  hook: string;
  price: string;
  href: string;
}

// Court-focused offerings only — what GRIT actually does (no pools/turf).
export const INDEX_SERVICES: IndexService[] = [
  { name: 'Indoor courts', hook: 'Garage, barn, and home-gym courts — climbing walls optional.', price: 'by project', href: '/design' },
  { name: 'Court resurfacing', hook: 'Crack repair and a fresh tournament-grade acrylic surface.', price: 'from $6,000', href: '/design' },
  { name: 'Epoxy flake floors', hook: 'Garages, shops, and patios that shine and last.', price: 'from $3,500', href: '/design' },
  { name: 'Concrete & base prep', hook: 'Excavation and an engineered, reinforced slab built for play.', price: 'from $8/sq ft', href: '/design' },
  { name: 'Fencing & netting', hook: 'Ball-containment fencing, windscreen, and pro net systems.', price: 'from $35/ft', href: '/design' },
  { name: 'Court lighting', hook: 'LED pole lighting so the games go on after dark.', price: 'from $3,900', href: '/design' },
  { name: 'Game lines & striping', hook: 'Hand-taped, regulation multi-game lines and logos.', price: 'by project', href: '/design' },
].map((d, i) => ({ ...d, num: String(i + 4).padStart(2, '0') }));

export interface WorkItem {
  title: string;
  city: string;
  img: string;
}

export const WORK: WorkItem[] = [
  { title: 'Indoor multi-sport gym', city: 'Wasatch Front, UT', img: '/photos/kevin-court.jpg' },
  { title: 'Backyard basketball court', city: 'Lehi, UT', img: '/photos/court-01.jpg' },
  { title: 'Outdoor multi-sport court', city: 'Highland, UT', img: '/photos/poh-24.jpg' },
  { title: 'Backyard court + hoop', city: 'Draper, UT', img: '/photos/jake-court.jpg' },
  { title: 'Multi-sport court', city: 'Alpine, UT', img: '/photos/court-05.jpg' },
  { title: 'Fresh acrylic surfacing', city: 'Provo, UT', img: '/photos/court-08.jpg' },
];

export const PROCESS = [
  { n: '01', title: 'Walk the yard', desc: 'A free on-site visit to measure, assess grade, and talk through how you want to use the space.' },
  { n: '02', title: 'See it first', desc: 'Preview a finished court in a photo of your yard, or design every detail in 3D with a live estimate.' },
  { n: '03', title: 'One crew builds it', desc: 'Excavation, engineered base, concrete, surfacing, and lines — handled end to end, no subs to chase.' },
  { n: '04', title: 'Play for years', desc: 'Final coat, fresh lines, and a surface built to last. Then it is game on.' },
];

export const PULL_QUOTE = {
  quote: 'GRIT turned our sloped, useless side yard into a court the whole neighborhood is jealous of. One crew, one quote, flawless surface.',
  name: 'Megan R.',
  detail: 'Backyard court, Draper UT',
};

export interface GalleryItem {
  id: string;
  title: string;
  city: string;
  cat: string;
  tall: boolean;
  img: string;
}

// Categories reflect what the photos actually show — all are real GRIT courts.
export const GALLERY_FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'multisport', label: 'Multi-sport' },
  { key: 'indoor', label: 'Indoor' },
  { key: 'inprogress', label: 'In progress' },
];

export const GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Indoor multi-sport gym', city: 'Wasatch Front, UT', cat: 'indoor', tall: true, img: '/photos/kevin-court.jpg' },
  { id: 'g2', title: 'Backyard basketball court', city: 'Lehi, UT', cat: 'basketball', tall: false, img: '/photos/court-01.jpg' },
  { id: 'g3', title: 'Outdoor multi-sport court', city: 'Highland, UT', cat: 'multisport', tall: true, img: '/photos/poh-24.jpg' },
  { id: 'g4', title: 'Backyard court + hoop', city: 'Draper, UT', cat: 'basketball', tall: false, img: '/photos/jake-court.jpg' },
  { id: 'g5', title: 'Multi-sport court', city: 'Alpine, UT', cat: 'multisport', tall: false, img: '/photos/court-05.jpg' },
  { id: 'g6', title: 'New court surfacing', city: 'Mapleton, UT', cat: 'inprogress', tall: true, img: '/photos/court-04.jpg' },
  { id: 'g7', title: 'Acrylic coat going down', city: 'Provo, UT', cat: 'inprogress', tall: false, img: '/photos/court-08.jpg' },
  { id: 'g8', title: 'Backyard sport court', city: 'Lindon, UT', cat: 'multisport', tall: false, img: '/photos/court-02.jpg' },
  { id: 'g9', title: 'Backyard sport court', city: 'Orem, UT', cat: 'basketball', tall: true, img: '/photos/court-03.jpg' },
  { id: 'g10', title: 'Backyard sport court', city: 'Saratoga Springs, UT', cat: 'multisport', tall: false, img: '/photos/court-06.jpg' },
  { id: 'g11', title: 'Backyard sport court', city: 'Eagle Mountain, UT', cat: 'basketball', tall: false, img: '/photos/court-07.jpg' },
  { id: 'g12', title: 'Backyard sport court', city: 'Spanish Fork, UT', cat: 'multisport', tall: true, img: '/photos/court-09.jpg' },
  { id: 'g13', title: 'Backyard sport court', city: 'Pleasant Grove, UT', cat: 'basketball', tall: false, img: '/photos/court-10.jpg' },
];

export const PICKLE_SERVICE = {
  inclusions: [
    'On-site evaluation + satellite court layout',
    'Excavation and engineered, reinforced base',
    'Regulation 30 × 60 slab with cushioned acrylic surfacing',
    'Hand-taped, tournament-grade lines',
    'Pro net system with tensioned center',
    'Color-matched surface in your choice of combo',
  ],
  addons: 'LED lighting · fencing & windscreen · rebound wall · second court color · color-matched logo',
  startingAt: '$22,000',
  miniGallery: ['/photos/court-05.jpg', '/photos/poh-24.jpg', '/photos/court-04.jpg'],
  faqs: [
    { q: 'How much does a backyard court cost in Utah?', a: 'Most backyard pickleball courts land between $20,000 and $32,000; multi-sport and full basketball courts run higher. Price depends on size, site prep, and surfacing. The 3D configurator gives you a live range, then we confirm it on a free on-site visit.' },
    { q: 'How long does a build take?', a: 'A typical court takes 3–6 weeks from base prep to final coat, weather permitting. Epoxy floors are often finished in a single week.' },
    { q: 'Do you handle the concrete and excavation?', a: 'Yes — one crew manages the whole project: design, excavation, engineered base, concrete, surfacing, lines, and net or hoop systems. One point of contact, one warranty.' },
    { q: 'Can I really see it in my backyard first?', a: 'Yes. Upload a photo in the Backyard Previewer and we drop a finished court right into your space — your size and colors — before you commit a dollar.' },
    { q: 'What areas do you serve?', a: 'We are based in Provo and build across the Wasatch Front — Utah, Salt Lake, Wasatch, and Summit counties, from Spanish Fork to Park City.' },
  ],
};
