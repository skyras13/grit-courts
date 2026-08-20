import { ServicePage, type ServicePageData } from '@/components/site/service-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sports Line Painting on Concrete | Pickleball & Basketball | GRIT Courts',
  description:
    'Regulation court lines painted onto your existing concrete or asphalt across Utah. Pickleball, basketball, tennis and multi-sport layouts, taped and measured to spec.',
  path: '/sports-lines',
  image: '/photos/svc-lines.jpg',
});

const DATA: ServicePageData = {
  eyebrow: 'Sports Line Painting',
  h1: 'Already have concrete? We can make it a court.',
  intro:
    'If your slab is sound, you do not need a whole new court to start playing. We measure, tape and paint regulation lines directly onto existing concrete or asphalt — the fastest, cheapest way into the game.',
  hero: { src: '/photos/svc-lines.jpg', alt: 'Hand-taped regulation court lines being painted' },
  includesTitle: 'What line painting includes',
  includes: [
    'Pressure-wash and surface prep',
    'Laser-measured layout to regulation dimensions',
    'Hand-taped edges for genuinely sharp lines',
    'Court-grade textured line paint, not driveway striping',
    'Single sport or multi-sport layouts in two colours',
    'Optional acrylic colour coats inside the lines',
  ],
  choices: [
    {
      label: 'One sport',
      title: 'Single layout',
      body:
        'Cleanest to read and quickest to install. A regulation 20ft by 44ft pickleball court needs about 30ft by 60ft of slab to play comfortably, but we can fit lines to a tighter pad and tell you honestly what you give up.',
    },
    {
      label: 'Sharing a slab',
      title: 'Multi-sport layout',
      body:
        'Pickleball and basketball on one surface, with the second sport painted in a contrasting colour and broken where the lines cross so both stay readable. On a standard 35ft by 60ft pad the hoop goes on the long side — a 19ft 9in arc spans nearly 40ft and will not fit across the width.',
    },
  ],
  detail: {
    title: 'What we check before quoting',
    paragraphs: [
      'Line paint only looks as good as what is under it. We look at three things: whether the slab is level enough for a true bounce, whether there are cracks that will telegraph straight through the paint within a season, and whether the surface has ever been sealed — because a sealed slab has to be ground before anything will stick.',
      'If the concrete is not worth painting, we will say so rather than take the job and watch it fail. In that case resurfacing or a new base is the honest answer, and we quote that instead.',
    ],
  },
  gallery: [
    { src: '/photos/lines-2.jpg', caption: 'Crisp hand-taped edges' },
    { src: '/photos/drone-1.jpg', caption: 'Multi-sport layout from above' },
    { src: '/photos/svc-parking.jpg', caption: 'Striping and layout work' },
  ],
  ctaTitle: 'Send us a photo of your slab.',
  path: '/sports-lines',
  breadcrumb: 'Sports Line Painting',
};

export default function SportsLinesPage() {
  return <ServicePage data={DATA} />;
}
