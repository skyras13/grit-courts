import Image from 'next/image';
import { NavyLink, UnderlineLink } from '@/components/ui/buttons';
import { PHOTOS } from '@/lib/content';
import { COMPANY } from '@/lib/site';
import { VERIFIED } from '@/lib/verified';

/**
 * Home hero.
 *
 * Previously this shipped a pseudo-3D court built from CSS-transformed DOM
 * planes — not the WebGL designer on /design, and offering six invented surface
 * colours ("Coastal Teal", "Night Violet") that GRIT does not sell. It read as a
 * gimmick because it was one.
 *
 * A court builder's strongest asset is a photograph of a finished court, so the
 * hero leads with real work and sends people to the actual designer rather than
 * imitating it here.
 */
export function HomeHero() {
  return (
    <section className="mx-auto grid max-w-content items-center gap-8 px-5 pb-10 pt-9 sm:px-7 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:pb-14 lg:pt-[72px]">
      <div className="animate-fade-up">
        <div className="eyebrow mb-6">Build With GRIT</div>
        <h1 className="text-balance font-display text-[clamp(38px,5.4vw,66px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-ink">
          High-quality court <span className="text-brand-600">construction.</span>
        </h1>
        <p className="mt-5 max-w-[490px] text-[clamp(16px,1.4vw,18.5px)] leading-relaxed text-[#42504a]">
          Full-service athletic court installers on the Wasatch Front — from pouring your slab to
          surfacing, painting regulation lines, and setting hoops, lights and nets. One crew, start
          to finish.
        </p>

        <div className="mb-8 mt-7 flex flex-wrap items-center gap-5">
          <NavyLink href="/contact">Get a free estimate</NavyLink>
          <UnderlineLink href="/gallery">See our work →</UnderlineLink>
        </div>

        <div className="flex flex-wrap items-center gap-[18px] border-t border-muted-line pt-6">
          {VERIFIED.rating && (
            <span className="flex items-center gap-1.5">
              <span className="tracking-[1px] text-gold">★★★★★</span>
              <span className="text-[13.5px] font-bold text-ink">{COMPANY.rating.value}</span>
            </span>
          )}
          <span className="text-[13px] text-muted-soft">{COMPANY.courtsBuilt} courts built</span>
          {VERIFIED.memberships && <span className="text-[13px] text-muted-soft">HBA member</span>}
          <span className="text-[13px] text-muted-soft">Licensed &amp; insured</span>
          <span className="text-[13px] text-muted-soft">Indoor &amp; outdoor</span>
        </div>
      </div>

      <div className="animate-fade-up [animation-delay:120ms]">
        <figure className="relative overflow-hidden rounded-xl bg-[#e8eef3] shadow-lift" style={{ aspectRatio: '4 / 3.1' }}>
          <Image
            src={PHOTOS.heroCourt}
            alt="A finished backyard sport court built by GRIT Courts on the Wasatch Front"
            fill
            priority
            sizes="(max-width:1024px) 100vw, 660px"
            className="object-cover"
          />
          <figcaption className="absolute bottom-[18px] left-[18px] rounded-[5px] bg-[rgba(20,33,47,0.82)] px-3.5 py-2 text-[12.5px] font-semibold text-white backdrop-blur">
            Backyard sport court · Wasatch Front, UT
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
