import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { NavyLink, WhiteLink, OutlineLightLink, UnderlineLink } from '@/components/ui/buttons';
import { FaqList } from '@/components/ui/faq-list';
import { PICKLE_SERVICE, PHOTOS } from '@/lib/content';
import { JsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo';

// Only the pickleball service page is fully specified in the design today.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: 'pickleball' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== 'pickleball') return {};
  return {
    title: 'Backyard Pickleball Court Builder in Utah',
    description:
      'Regulation backyard pickleball courts with cushioned acrylic surfacing, tournament lines, and a pro net system — engineered to play true for decades. From $22,000.',
    alternates: { canonical: '/services/pickleball' },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== 'pickleball') notFound();
  const s = PICKLE_SERVICE;

  return (
    <>
      <JsonLd data={serviceJsonLd('Pickleball Court Construction', 'Utah')} />
      <JsonLd data={faqJsonLd(s.faqs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Pickleball', path: '/services/pickleball' }])} />

      {/* hero */}
      <section className="mx-auto grid max-w-content items-center gap-8 px-5 pb-[clamp(36px,4vw,56px)] pt-[clamp(28px,4vw,56px)] sm:px-7 lg:grid-cols-[1fr_1.05fr] lg:gap-[60px]">
        <div>
          <Link href="/" className="mb-5 inline-block text-[13px] font-semibold text-muted-faint">Courts / <span className="text-ink">Pickleball</span></Link>
          <div className="eyebrow mb-4">The Backyard Pro</div>
          <h1 className="font-display text-[clamp(34px,5vw,60px)] font-extrabold leading-[0.98] tracking-[-0.03em]">Pickleball courts, built for daily play.</h1>
          <p className="mt-[18px] max-w-[480px] text-[17px] leading-relaxed text-[#4a5560]">
            Stop waiting on the public lines. A regulation backyard court with cushioned acrylic surfacing, crisp tournament lines, and a pro net system — on a base engineered to play true for decades.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <NavyLink href="/design">Design yours in 3D</NavyLink>
            <UnderlineLink href="/preview">See it in your yard →</UnderlineLink>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#e8eef3] shadow-lift" style={{ aspectRatio: '4 / 3.4' }}>
          <Image src={PHOTOS.servicePickle} alt="Finished backyard pickleball court" fill priority sizes="(max-width:1024px) 100vw, 600px" className="object-cover" />
        </div>
      </section>

      {/* inclusions + pricing */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-content items-start gap-8 px-5 py-[clamp(48px,6vw,84px)] sm:px-7 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <h2 className="mb-6 font-display text-[clamp(24px,3vw,36px)] font-extrabold">What’s in every court.</h2>
            <div className="grid gap-x-7 gap-y-3.5 sm:grid-cols-2">
              {s.inclusions.map((inc) => (
                <div key={inc} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white">✓</span>
                  <span className="text-[14.5px] leading-snug text-[#384551]">{inc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-muted-line bg-white p-7">
            <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted-faint">The Backyard Pro · starting at</div>
            <div className="mb-1.5 font-display text-[42px] font-extrabold leading-none">{s.startingAt}</div>
            <div className="mb-5 text-[13.5px] text-muted-faint">Estimate, not a quote — confirmed on site.</div>
            <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted-faint">Popular add-ons</div>
            <p className="mb-[22px] text-[14px] leading-relaxed text-[#4a5560]">{s.addons}</p>
            <NavyLink href="/design" className="w-full">Build &amp; price yours →</NavyLink>
          </div>
        </div>
      </section>

      {/* mini gallery */}
      <section className="mx-auto max-w-content px-5 py-[clamp(48px,6vw,84px)] sm:px-7">
        <h2 className="mb-6 font-display text-[clamp(24px,3vw,36px)] font-extrabold">Pickleball courts we’ve built.</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {s.miniGallery.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-lg bg-[#e8eef3]" style={{ aspectRatio: '4 / 3' }}>
              <Image src={src} alt={`GRIT pickleball project ${i + 1}`} width={420} height={315} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[880px] px-5 pb-[clamp(48px,6vw,84px)] sm:px-7">
        <h2 className="mb-5 font-display text-[clamp(24px,3vw,36px)] font-extrabold">Common questions.</h2>
        <FaqList faqs={s.faqs} />
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-[clamp(48px,7vw,90px)] text-center sm:px-7">
          <h2 className="mb-6 font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-none text-white">Ready to see your court?</h2>
          <div className="flex flex-wrap justify-center gap-3.5">
            <WhiteLink href="/preview">See it in your yard</WhiteLink>
            <OutlineLightLink href="/design">Design in 3D</OutlineLightLink>
          </div>
        </div>
      </section>
    </>
  );
}
