import { ServicePage, type ServicePageData } from '@/components/site/service-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'How Much Does a Golf Simulator Cost in Utah? | GRIT Courts',
  description:
    'What a golf simulator bay actually costs to build in Utah — the ceiling height and room depth you need, what each component runs, and where the money really goes.',
  path: '/golf-simulators',
  image: '/photos/svc-golf.jpg',
});

const DATA: ServicePageData = {
  eyebrow: 'Golf Simulators',
  h1: 'What a golf simulator really costs to build',
  intro:
    'Most simulator quotes only cover the equipment and leave out the room. We build the whole bay — framing, surface, screen, enclosure and the launch monitor — so the number you get is the number you pay.',
  hero: { src: '/photos/svc-golf.jpg', alt: 'Indoor golf simulator bay' },
  includesTitle: 'What a turnkey bay includes',
  includes: [
    'Room assessment — ceiling height, depth and swing clearance',
    'Framing, blackout and wall treatment',
    'Impact screen and enclosure',
    'Hitting surface and surrounding turf',
    'Launch monitor and computer, calibrated on site',
    'Projector, mount and cable management',
  ],
  choices: [
    {
      label: 'The hard constraint',
      title: 'Ceiling height decides everything',
      body:
        'You need roughly 9ft of clear ceiling for most adults to swing a driver without hitting anything, and 10ft is genuinely comfortable. Under about 8ft 6in, a full-swing bay stops being realistic no matter what you spend. Check this first — it is the one thing money cannot fix cheaply.',
    },
    {
      label: 'The other one',
      title: 'Depth and width',
      body:
        'Plan on about 15ft of depth and 12ft of width for a right- and left-handed setup. You can go narrower for a single-handed bay, but you lose the ability to let a guest hit and you crowd the projector throw.',
    },
  ],
  detail: {
    title: 'Where the money actually goes',
    paragraphs: [
      'The launch monitor is the single biggest line item and the widest range. Entry-level photometric units start in the low four figures; the radar and camera systems that most people picture when they say "simulator" run several times that. This one choice can swing a build by more than everything else combined.',
      'After that it is the room. If the space is already finished with the height you need, the build is mostly screen, enclosure, surface and projector. If we are framing out a garage bay, insulating it, and raising or working around a ceiling, the construction side can match or exceed the equipment cost.',
      'The part people underestimate is the surface and the enclosure. A cheap mat wrecks your wrists and a cheap screen ripples and wears through. These are the components you feel every single session, and they are the ones we would not cut.',
      'We quote the room and the equipment as separate lines so you can see exactly which half you are paying for, and swap the launch monitor tier without re-quoting the whole job.',
    ],
  },
  ctaTitle: 'Tell us your ceiling height and we’ll tell you what’s possible.',
  path: '/golf-simulators',
  breadcrumb: 'Golf Simulators',
};

export default function GolfSimulatorsPage() {
  return <ServicePage data={DATA} />;
}
