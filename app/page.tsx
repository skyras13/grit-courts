import { Hero } from '@/components/home/hero';
import {
  TrustBar,
  Services,
  PreviewerTeaser,
  Gallery,
  Proof,
  Faqs,
  FinalCta,
} from '@/components/home/sections';
import { JsonLd, faqJsonLd } from '@/lib/seo';
import { GLOBAL_FAQS } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(GLOBAL_FAQS)} />
      <Hero />
      <TrustBar />
      <Services />
      <PreviewerTeaser />
      <Gallery />
      <Proof />
      <Faqs />
      <FinalCta />
    </>
  );
}
