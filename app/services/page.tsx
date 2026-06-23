import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ALL_SERVICES } from '@/lib/content';
import { NavyLink, WhiteLink, OutlineLightLink } from '@/components/ui/buttons';

export const metadata: Metadata = {
  title: 'Our Services — Courts, Surfacing, Backyards & More',
  description:
    'Everything GRIT Courts builds in Utah: custom basketball, pickleball, and tennis courts, surfacing & repair, sport lines, fencing, epoxy, pools, landscaping, concrete, trampolines, parking-lot striping, and golf simulators.',
  alternates: { canonical: '/services' },
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="mx-auto max-w-content px-5 pb-6 pt-[clamp(28px,4vw,56px)] sm:px-7">
        <div className="max-w-[680px]">
          <div className="eyebrow mb-4">Our Services</div>
          <h1 className="font-display text-[clamp(32px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">
            One crew for the whole backyard.
          </h1>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#4a5560]">
            GRIT is known for courts — but we’re full-service. From pouring the slab to surfacing,
            lines, hoops, fencing, and the rest of the yard, we handle it end to end with
            professional-grade materials.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <NavyLink href="/design">Design your court</NavyLink>
            <Link href="/contact" className="inline-flex items-center border-b-2 border-ink px-0.5 py-1 text-[15.5px] font-bold text-ink transition hover:border-brand-600 hover:text-brand-600">
              Get a free estimate →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-10 sm:px-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_SERVICES.map((s) => (
            <Link key={s.name} href={s.href} className="group flex flex-col overflow-hidden rounded-xl border border-muted-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e8eef3]">
                {s.img ? (
                  <Image src={s.img} alt={s.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="court-gradient flex h-full w-full items-center justify-center">
                    <span className="font-display text-2xl font-extrabold text-white/90">{s.name}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-[19px] font-extrabold">{s.name}</h2>
                  {s.featured && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">Popular</span>}
                </div>
                <p className="mt-2 flex-1 text-[14.5px] leading-snug text-muted">{s.hook}</p>
                <span className="mt-3 text-[13.5px] font-bold text-brand-600">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-[clamp(48px,7vw,90px)] text-center sm:px-7">
          <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-none text-white">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-[#d2e0ee]">
            Design a court in 3D, see it in your own backyard, or just tell us what you’re thinking.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <WhiteLink href="/design">Open the Court Designer</WhiteLink>
            <OutlineLightLink href="/contact">Talk to us</OutlineLightLink>
          </div>
        </div>
      </section>
    </>
  );
}
