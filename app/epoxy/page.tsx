import { ServicePage, type ServicePageData } from '@/components/site/service-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Epoxy Flooring Utah | Garage & Shop Floor Coatings | GRIT Courts',
  description:
    'Decorative flake epoxy and polyaspartic floors for Utah garages, basements and shops. Hot-tire resistant, seamless, and usually installed in a single day.',
  path: '/epoxy',
  image: '/photos/epoxy-1.jpg',
});

const DATA: ServicePageData = {
  eyebrow: 'Epoxy Flooring',
  h1: 'A garage floor you can hose off and forget about',
  intro:
    'Decorative flake and polyaspartic systems that shrug off hot tires, road salt, dropped tools and whatever the winter drags in. Ground down to bare concrete, built back up in layers, and sealed under a clear topcoat.',
  hero: { src: '/photos/epoxy-1.jpg', alt: 'Finished flake epoxy garage floor' },
  includesTitle: 'What an epoxy floor includes',
  includes: [
    'Diamond grinding to open the concrete profile',
    'Crack, spall and pit repair before any coating goes down',
    'Moisture testing so the coating actually bonds',
    'Full broadcast flake in your colour blend',
    'Polyaspartic clear topcoat — UV stable, non-yellowing',
    'Hot-tire, salt and chemical resistant when cured',
  ],
  choices: [
    {
      label: 'Most garages',
      title: 'Full flake system',
      body:
        'A pigmented base coat, flake broadcast to refusal, then scraped back and sealed. It hides dust and tyre marks, adds grip when wet, and is the finish most people picture when they picture a nice garage.',
    },
    {
      label: 'Shops & basements',
      title: 'Solid colour or metallic',
      body:
        'A cleaner, more industrial look. Solid colour reads sharp under shop lighting; metallic gives a poured, marbled depth that suits a finished basement or a showroom bay more than a working garage.',
    },
  ],
  detail: {
    title: 'Why grinding matters more than the coating',
    paragraphs: [
      'Most failed garage floors in Utah did not fail because of a bad product. They failed because the concrete was etched with acid or simply swept instead of mechanically ground, so the coating never keyed into the slab. It looks perfect for a season, then peels off in sheets the first time a hot tyre sits on it.',
      'We grind every floor with diamond tooling. It is the slow, dusty, expensive part of the job and it is the part that decides whether the floor is still there in ten years.',
      'Freeze-thaw is the other Utah-specific problem. Salt-laden slush melts off the car, sits in a low spot, and works into any pinhole in the finish. Repairing pits and low spots before coating is not optional here the way it might be in a drier climate.',
    ],
  },
  gallery: [
    { src: '/photos/epoxy-2.jpg', caption: 'Flake broadcast, mid-install' },
    { src: '/photos/garage-1.jpg', caption: 'Finished two-car garage' },
    { src: '/photos/coatings-cars.jpg', caption: 'Holding up to daily driving' },
  ],
  ctaTitle: 'Get a number on your garage floor.',
  path: '/epoxy',
  breadcrumb: 'Epoxy Flooring',
};

export default function EpoxyPage() {
  return <ServicePage data={DATA} />;
}
