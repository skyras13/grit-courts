/**
 * City seed data — the source of truth for the programmatic local-SEO pages.
 *
 * Kept as typed TS so the city pages build *statically* with zero external
 * dependencies (great for the demo and for Lighthouse). The same array seeds the
 * Supabase `cities` table (scripts/seed.ts) when a DB is wired, after which the
 * page loader prefers DB rows and falls back to this array.
 *
 * THIN-CONTENT GUARDRAIL: every city carries a genuinely unique `landmark`,
 * `blurb`, `lots` (local lot/site reality) and `neighborhoods`. The page template
 * weaves these into distinct intro copy + FAQs so no two pages read alike. See
 * docs/02-strategy/seo-strategy.md.
 */
import type { City } from './types';

export interface CitySeed extends Omit<City, 'id' | 'created_at'> {
  /** Local lot/site reality — drives a unique paragraph per page. */
  lots: string;
  /** A few neighborhoods/areas for local specificity and internal hooks. */
  neighborhoods: string[];
  /** Distance/time framing from GRIT's Provo base, for the "we serve you" copy. */
  fromProvo: string;
}

function kw(city: string): string[] {
  const c = city.toLowerCase();
  return [
    `${c} pickleball court builder`,
    `backyard pickleball court ${c}`,
    `basketball court installer ${c} utah`,
    `sport court ${c}`,
    `pickleball court cost ${c} utah`,
    `epoxy garage floor ${c}`,
  ];
}

export const CITIES: CitySeed[] = [
  {
    slug: 'provo',
    name: 'Provo',
    county: 'Utah County',
    landmark: 'the Provo River Trail and the Y on the mountain',
    blurb:
      'Our home base. We design and pour custom courts across Provo neighborhoods from the foothills to the river bottoms.',
    lots: 'Provo lots range from tight east-bench yards on a grade to flat west-side parcels — we level and engineer the base for either.',
    neighborhoods: ['Edgemont', 'Grandview', 'Rock Canyon', 'Sunset'],
    fromProvo: 'right here in town',
    lat: 40.2338,
    lng: -111.6585,
    median_home_value: 480_000,
    target_keywords: kw('Provo'),
    published: true,
  },
  {
    slug: 'draper',
    name: 'Draper',
    county: 'Salt Lake County',
    landmark: 'Corner Canyon and the SunCrest ridgeline',
    blurb:
      'Draper homeowners want a court that matches the view. We build hillside-stable courts that hold up against the bench grade.',
    lots: 'Many Draper lots sit on a slope below Corner Canyon — we cut, retain, and pour a dead-level pad so your court plays true.',
    neighborhoods: ['SunCrest', 'Corner Canyon', 'Steeplechase', 'South Mountain'],
    fromProvo: 'about 35 minutes north',
    lat: 40.5247,
    lng: -111.8638,
    median_home_value: 720_000,
    target_keywords: kw('Draper'),
    published: true,
  },
  {
    slug: 'park-city',
    name: 'Park City',
    county: 'Summit County',
    landmark: 'the Park City and Deer Valley resorts',
    blurb:
      'A court that survives a Park City winter takes the right base and surfacing. We build for freeze-thaw at altitude.',
    lots: 'At 7,000 ft, Park City courts need frost-protected footings and cold-tolerant acrylic — we spec both so the surface lasts.',
    neighborhoods: ['Old Town', 'Promontory', 'Glenwild', 'Jeremy Ranch'],
    fromProvo: 'about an hour northeast',
    lat: 40.6461,
    lng: -111.498,
    median_home_value: 1_400_000,
    target_keywords: kw('Park City'),
    published: true,
  },
  {
    slug: 'lehi',
    name: 'Lehi',
    county: 'Utah County',
    landmark: 'Thanksgiving Point and the Silicon Slopes tech corridor',
    blurb:
      'Lehi is booming with new builds and big backyards. We turn that fresh-graded dirt into a finished court fast.',
    lots: 'New Lehi subdivisions often hand you raw, freshly graded dirt — ideal for designing a court footprint in from the start.',
    neighborhoods: ['Traverse Mountain', 'Holbrook Farms', 'Spring Creek', 'Ivory Ridge'],
    fromProvo: 'about 20 minutes north',
    lat: 40.3916,
    lng: -111.8508,
    median_home_value: 560_000,
    target_keywords: kw('Lehi'),
    published: true,
  },
  {
    slug: 'alpine',
    name: 'Alpine',
    county: 'Utah County',
    landmark: 'the mouth of American Fork Canyon and Lone Peak',
    blurb:
      'Alpine estates have the room for a full multi-sport court — and we build the showpiece version.',
    lots: 'Alpine lots are large and often terraced into the foothills; we engineer retaining and drainage so the court sits perfectly flat.',
    neighborhoods: ['Three Falls', 'Alpine Cove', 'Box Elder', 'Lambert Park'],
    fromProvo: 'about 25 minutes north',
    lat: 40.4527,
    lng: -111.7785,
    median_home_value: 1_050_000,
    target_keywords: kw('Alpine'),
    published: true,
  },
  {
    slug: 'highland',
    name: 'Highland',
    county: 'Utah County',
    landmark: 'the Highland Glen Park ponds',
    blurb:
      'Highland families love a backyard that does double duty — pickleball for the parents, hoops for the kids.',
    lots: 'Highland’s flatter half-acre lots are perfect for a 30x60 pickleball court with room left for landscaping.',
    neighborhoods: ['Highland Glen', 'Beacon Hills', 'The Ridge', 'Dry Creek'],
    fromProvo: 'about 20 minutes north',
    lat: 40.4274,
    lng: -111.7949,
    median_home_value: 880_000,
    target_keywords: kw('Highland'),
    published: true,
  },
  {
    slug: 'sandy',
    name: 'Sandy',
    county: 'Salt Lake County',
    landmark: 'the Quarry Bend district and Little Cottonwood Canyon',
    blurb:
      'Sandy yards back right up to the Wasatch. We build courts that frame the canyon view instead of fighting it.',
    lots: 'Established Sandy lots usually have a sound slab or flat lawn — often a quick path to a resurfaced or new court.',
    neighborhoods: ['Pepperwood', 'Granite', 'Alta Canyon', 'Willow Creek'],
    fromProvo: 'about 30 minutes north',
    lat: 40.5649,
    lng: -111.8389,
    median_home_value: 640_000,
    target_keywords: kw('Sandy'),
    published: true,
  },
  {
    slug: 'pleasant-grove',
    name: 'Pleasant Grove',
    county: 'Utah County',
    landmark: 'the Battle Creek Falls trailhead',
    blurb:
      'Pleasant Grove is Utah’s “City of Trees” — we tuck courts into mature-yard settings without losing the shade.',
    lots: 'PG’s older neighborhoods have established trees and uneven grade; we work the footprint around root zones and level carefully.',
    neighborhoods: ['Manila', 'Grove Creek', 'Battle Creek', 'Mahogany Hills'],
    fromProvo: 'about 15 minutes north',
    lat: 40.3641,
    lng: -111.7385,
    median_home_value: 530_000,
    target_keywords: kw('Pleasant Grove'),
    published: true,
  },
  {
    slug: 'orem',
    name: 'Orem',
    county: 'Utah County',
    landmark: 'the SCERA Park and UVU campus',
    blurb:
      'Orem’s “Family City USA” lives up to the name — multi-sport courts here get used every single day.',
    lots: 'Orem’s grid of mid-century lots tends to be flat with existing concrete patios we can build off of cleanly.',
    neighborhoods: ['Sharon', 'Cascade', 'Northridge', 'Hillcrest'],
    fromProvo: 'about 10 minutes north',
    lat: 40.2969,
    lng: -111.6946,
    median_home_value: 470_000,
    target_keywords: kw('Orem'),
    published: true,
  },
  {
    slug: 'american-fork',
    name: 'American Fork',
    county: 'Utah County',
    landmark: 'the mouth of American Fork Canyon and the Timpanogos Cave trail',
    blurb:
      'American Fork sits at the canyon gateway. We build courts that handle the canyon breeze and the afternoon sun.',
    lots: 'AF mixes older in-town lots with new east-side benches; we tailor the base spec to whichever you’ve got.',
    neighborhoods: ['Highland Cove', 'Shelley', 'Forbes', 'Hillcrest'],
    fromProvo: 'about 18 minutes north',
    lat: 40.3769,
    lng: -111.7958,
    median_home_value: 540_000,
    target_keywords: kw('American Fork'),
    published: true,
  },
  {
    slug: 'saratoga-springs',
    name: 'Saratoga Springs',
    county: 'Utah County',
    landmark: 'the Utah Lake shoreline and Jacob’s Ledge',
    blurb:
      'Saratoga Springs is all new builds with big, open lots — prime territory for a regulation court.',
    lots: 'Lakeside Saratoga lots are flat and freshly graded; we mind the higher water table with proper base drainage.',
    neighborhoods: ['The Cove', 'Harvest Hills', 'Talons Cove', 'Saratoga Shores'],
    fromProvo: 'about 25 minutes northwest',
    lat: 40.3494,
    lng: -111.9046,
    median_home_value: 560_000,
    target_keywords: kw('Saratoga Springs'),
    published: true,
  },
  {
    slug: 'heber-city',
    name: 'Heber City',
    county: 'Wasatch County',
    landmark: 'the Heber Valley and Deer Creek Reservoir',
    blurb:
      'Heber Valley estates have acreage to spare. We build courts that stand up to a true mountain-valley winter.',
    lots: 'Heber’s high-valley lots need frost-depth footings; we engineer the base to ride out the freeze-thaw.',
    neighborhoods: ['Red Ledges', 'Timber Lakes', 'Center Creek', 'Midway-adjacent'],
    fromProvo: 'about 45 minutes east',
    lat: 40.5069,
    lng: -111.4133,
    median_home_value: 820_000,
    target_keywords: kw('Heber City'),
    published: true,
  },
  {
    slug: 'lindon',
    name: 'Lindon',
    county: 'Utah County',
    landmark: 'the Lindon Marina on Utah Lake',
    blurb:
      'Lindon’s “a little bit of country” means deep lots — plenty of room to drop in a court and still keep the garden.',
    lots: 'Lindon’s larger residential-ag lots are flat and forgiving, a straightforward base for a new pour.',
    neighborhoods: ['Pheasant Brook', 'Heritage Hills', 'Lindon Hollow', 'Canal'],
    fromProvo: 'about 12 minutes north',
    lat: 40.3416,
    lng: -111.7208,
    median_home_value: 560_000,
    target_keywords: kw('Lindon'),
    published: true,
  },
  {
    slug: 'spanish-fork',
    name: 'Spanish Fork',
    county: 'Utah County',
    landmark: 'the Spanish Fork River and the Fiesta Days rodeo grounds',
    blurb:
      'Spanish Fork families want a court the whole neighborhood plays on. We build the durable, everyday version.',
    lots: 'South-valley lots in Spanish Fork are generous and flat; new east-bench builds give us a clean slate.',
    neighborhoods: ['Canyon Creek', 'Palmyra', 'River Bottoms', 'Spanish Oaks'],
    fromProvo: 'about 15 minutes south',
    lat: 40.1149,
    lng: -111.6549,
    median_home_value: 480_000,
    target_keywords: kw('Spanish Fork'),
    published: true,
  },
  {
    slug: 'mapleton',
    name: 'Mapleton',
    county: 'Utah County',
    landmark: 'the Maple Mountain foothills',
    blurb:
      'Mapleton is large-lot living against the mountain — the perfect canvas for a private multi-sport court.',
    lots: 'Mapleton’s acre-plus foothill lots often need a cut-and-retain to win a flat pad; we handle the grading.',
    neighborhoods: ['Maple Mountain', 'Hobble Creek-adjacent', 'Old Mapleton', 'The Bench'],
    fromProvo: 'about 18 minutes south',
    lat: 40.1294,
    lng: -111.5788,
    median_home_value: 680_000,
    target_keywords: kw('Mapleton'),
    published: true,
  },
  {
    slug: 'cedar-hills',
    name: 'Cedar Hills',
    county: 'Utah County',
    landmark: 'the Cedar Hills golf course and Lone Peak views',
    blurb:
      'Cedar Hills is tucked up against the mountain with tidy, upscale lots — courts here are clean and compact.',
    lots: 'Cedar Hills lots step up the foothill; we level the grade and match the surfacing to the bright mountain light.',
    neighborhoods: ['The Cedars', 'Amber Ridge', 'Bridgestone', 'Harvey'],
    fromProvo: 'about 18 minutes north',
    lat: 40.4136,
    lng: -111.7549,
    median_home_value: 720_000,
    target_keywords: kw('Cedar Hills'),
    published: true,
  },
  {
    slug: 'eagle-mountain',
    name: 'Eagle Mountain',
    county: 'Utah County',
    landmark: 'the Pony Express Parkway and Cedar Valley',
    blurb:
      'Eagle Mountain is Utah County’s fastest-growing city with huge lots and bigger dreams. Room for a full court? Easily.',
    lots: 'Eagle Mountain’s wide-open Cedar Valley lots are flat and dry — fast, economical base work for a big footprint.',
    neighborhoods: ['Silverlake', 'The Ranches', 'City Center', 'Overland'],
    fromProvo: 'about 30 minutes northwest',
    lat: 40.3141,
    lng: -112.0069,
    median_home_value: 520_000,
    target_keywords: kw('Eagle Mountain'),
    published: true,
  },
  {
    slug: 'riverton',
    name: 'Riverton',
    county: 'Salt Lake County',
    landmark: 'the Riverton City Park and Jordan River Parkway',
    blurb:
      'Riverton’s roomy southwest-valley lots were made for a backyard court the kids never want to leave.',
    lots: 'Riverton lots are typically flat with existing lawn or slab — often a quick turnaround to a finished court.',
    neighborhoods: ['Hidden Valley', 'Rosecrest', 'Riverton Ranches', 'Sunstone'],
    fromProvo: 'about 35 minutes north',
    lat: 40.5219,
    lng: -111.9391,
    median_home_value: 640_000,
    target_keywords: kw('Riverton'),
    published: true,
  },
  {
    slug: 'herriman',
    name: 'Herriman',
    county: 'Salt Lake County',
    landmark: 'the Blackridge Reservoir and Butterfield Canyon',
    blurb:
      'Herriman’s new hillside communities have the space and the views — we build courts that earn the backyard.',
    lots: 'Herriman’s benchland lots vary in grade; we cut and pour a level base and detail the drainage for the slope.',
    neighborhoods: ['Rosecrest', 'Juniper Crest', 'Anthem', 'Herriman Towne Center'],
    fromProvo: 'about 40 minutes north',
    lat: 40.5141,
    lng: -112.033,
    median_home_value: 640_000,
    target_keywords: kw('Herriman'),
    published: true,
  },
  {
    slug: 'south-jordan',
    name: 'South Jordan',
    county: 'Salt Lake County',
    landmark: 'the Daybreak community and Oquirrh Lake',
    blurb:
      'From Daybreak to the District, South Jordan is amenity-minded — a private court fits right in.',
    lots: 'Daybreak and newer South Jordan lots are flat and well-graded; HOA setbacks are the main thing we design around.',
    neighborhoods: ['Daybreak', 'Glenmoor', 'Riverside', 'Kennecott'],
    fromProvo: 'about 35 minutes north',
    lat: 40.5622,
    lng: -111.9297,
    median_home_value: 660_000,
    target_keywords: kw('South Jordan'),
    published: true,
  },
  {
    slug: 'vineyard',
    name: 'Vineyard',
    county: 'Utah County',
    landmark: 'the Utah Lake shoreline and the Megaplex at Geneva',
    blurb:
      'Vineyard went from steel mill to one of Utah’s youngest, fastest cities — brand-new lots ready for a court.',
    lots: 'Vineyard is all new construction on reclaimed lakeshore flats; we account for the engineered fill and water table.',
    neighborhoods: ['The Pointe', 'Waters Edge', 'Edgewater', 'Town Center'],
    fromProvo: 'about 12 minutes northwest',
    lat: 40.2969,
    lng: -111.7547,
    median_home_value: 510_000,
    target_keywords: kw('Vineyard'),
    published: true,
  },
  {
    slug: 'springville',
    name: 'Springville',
    county: 'Utah County',
    landmark: 'the Springville Museum of Art and Hobble Creek Canyon',
    blurb:
      '“Art City” Springville has deep lots and a maker’s eye — courts here get a custom color treatment.',
    lots: 'Springville’s mix of old-town and east-bench lots ranges from flat to sloped; we spec the base to fit.',
    neighborhoods: ['Hobble Creek', 'Spring Creek', 'West Fields', 'Cherry Lane'],
    fromProvo: 'about 12 minutes south',
    lat: 40.1652,
    lng: -111.6107,
    median_home_value: 500_000,
    target_keywords: kw('Springville'),
    published: true,
  },
  {
    slug: 'holladay',
    name: 'Holladay',
    county: 'Salt Lake County',
    landmark: 'the Holladay Village and Big Cottonwood Canyon',
    blurb:
      'Holladay’s established estates and mature lots call for a refined court that respects the landscaping.',
    lots: 'Holladay’s older large lots have mature trees and existing slabs; we resurface or pour with the canopy in mind.',
    neighborhoods: ['Cottonwood', 'Holladay Hills', 'Walker Lane', 'Olympus Cove-adjacent'],
    fromProvo: 'about 40 minutes north',
    lat: 40.6688,
    lng: -111.8247,
    median_home_value: 860_000,
    target_keywords: kw('Holladay'),
    published: true,
  },
];

export function getCitySeed(slug: string): CitySeed | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function publishedCities(): CitySeed[] {
  return CITIES.filter((c) => c.published);
}
