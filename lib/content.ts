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

/**
 * ALL_SERVICES — the full service list from builtwithgrit.com (every one is real;
 * each has a real photo except pools, which uses a branded tile until the owner
 * supplies one). Drives the /services index page; the home page features the
 * three court services and lists the rest.
 */
export interface ServiceCard {
  name: string;
  hook: string;
  href: string;
  img: string | null;
  featured?: boolean;
}

export const ALL_SERVICES: ServiceCard[] = [
  { name: 'Build a Court', hook: 'Custom basketball, pickleball, and tennis courts built fast with premium materials.', href: '/design', img: '/photos/drone-1.jpg', featured: true },
  { name: 'Court Surfacing', hook: 'Resurface old courts or install a new, pro-quality surface for peak play in Utah.', href: '/court-surfacing', img: '/photos/svc-surfacing.jpg', featured: true },
  { name: 'Multi-Sport Courts', hook: 'Hoops, pickleball, and tennis lines on one shared, color-matched surface.', href: '/design', img: '/photos/poh-24.jpg', featured: true },
  { name: 'Court Repair', hook: 'Restore cracked or damaged courts with expert repair for safe, long-lasting play.', href: '/contact', img: '/photos/svc-repair.jpg' },
  { name: 'Sport Lines', hook: 'Crisp, professional game lines for basketball, pickleball, tennis, and more.', href: '/contact', img: '/photos/lines-2.jpg' },
  { name: 'Fencing', hook: 'Durable court and yard fencing for security, privacy, and ball containment.', href: '/contact', img: '/photos/svc-fencing.jpg' },
  { name: 'Epoxy', hook: 'Durable, seamless epoxy flooring for your garage, patio, or shop — built to last.', href: '/coatings', img: '/photos/epoxy-1.jpg' },
  { name: 'Pools', hook: 'Custom in-ground pools designed and built for lasting beauty and family fun.', href: '/contact', img: null },
  { name: 'Landscaping', hook: 'Transform your yard with expert landscaping for beauty, function, and curb appeal.', href: '/contact', img: '/photos/svc-landscaping.jpg' },
  { name: 'Concrete Work', hook: 'Top-quality concrete pads, driveways, retaining walls, and patios built to last.', href: '/contact', img: '/photos/svc-concrete.jpg' },
  { name: 'Trampolines', hook: 'In-ground trampolines installed for safe, fun play — perfect for Utah backyards.', href: '/contact', img: '/photos/svc-trampoline.jpg' },
  { name: 'Parking Lot Striping', hook: 'Sharp parking-lot lines and curbing for a clean, organized, safe property.', href: '/contact', img: '/photos/svc-parking.jpg' },
  { name: 'Golf Simulators', hook: 'Custom golf simulators in any space — we handle design, construction, and install.', href: '/contact', img: '/photos/svc-golf.jpg' },
];

// Home "what we build" list = everything past the three featured cards.
export const INDEX_SERVICES: IndexService[] = ALL_SERVICES.filter((s) => !s.featured).map((s, i) => ({
  num: String(i + 4).padStart(2, '0'),
  name: s.name,
  hook: s.hook,
  price: '',
  href: s.href,
}));

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
  { n: '02', title: 'See it first', desc: 'Preview a finished court in a photo of your yard, or design every detail in 3D and send us the exact spec.' },
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
