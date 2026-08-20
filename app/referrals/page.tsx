import { ServicePage, type ServicePageData } from '@/components/site/service-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Referral Program | Refer a Court, Get Rewarded | GRIT Courts',
  description:
    'Most GRIT courts come from neighbours talking to neighbours. Send someone our way and we take care of you when their court gets built.',
  path: '/referrals',
  image: '/photos/court-01.jpg',
});

const DATA: ServicePageData = {
  eyebrow: 'Referrals',
  h1: 'Neighbours talking to neighbours',
  intro:
    'A court gets used in full view of the whole street, so most of our work arrives the same way: someone plays on a court we built and asks who did it. If that is you, we would rather thank you properly than pay an ad platform.',
  hero: { src: '/photos/court-01.jpg', alt: 'Finished backyard court in a Utah neighbourhood' },
  includesTitle: 'How it works',
  includes: [
    'Send us a name, or have them mention you when they call',
    'We quote them the same as anyone else — no inflated price to fund your reward',
    'They get a free on-site estimate with no obligation',
    'When their court is finished and paid, we take care of you',
    'No cap on how many people you can send',
    'Works for homeowners, builders, landscapers and pool contractors alike',
  ],
  choices: [
    {
      label: 'Homeowners',
      title: 'You already did the hard part',
      body:
        'If someone has stood on your court and asked about it, that is a warmer introduction than any advert we could buy. Point them at us and mention it when you do, so we know where they came from.',
    },
    {
      label: 'Trades',
      title: 'Builders, landscapers, pool crews',
      body:
        'If courts are not your scope, they do not have to be. We work behind the scenes on your projects and keep you in the loop with the client. See our trade partners page for how that arrangement usually runs.',
    },
  ],
  detail: {
    title: 'Why we do it this way',
    paragraphs: [
      'Advertising a court to someone who has never seen one in person is expensive and slow. Someone who has already played on one needs almost no convincing — they have felt the surface, seen how it holds up, and watched their kids use it every night for a summer.',
      'So the money that would go to ads goes to the person who made the introduction instead. It is a better deal for everyone in the chain, and it keeps our prices honest because we are not funding a marketing budget out of your quote.',
    ],
  },
  ctaTitle: 'Know someone who wants a court?',
  path: '/referrals',
  breadcrumb: 'Referrals',
};

export default function ReferralsPage() {
  return <ServicePage data={DATA} />;
}
