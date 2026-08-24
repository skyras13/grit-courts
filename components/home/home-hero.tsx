'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Court3D } from '@/components/court/court-3d';
import { NavyLink, UnderlineLink } from '@/components/ui/buttons';
import { PALETTES, HERO_PALETTES } from '@/lib/configurator';
import { PHOTOS } from '@/lib/content';
import { COMPANY } from '@/lib/site';
import { VERIFIED } from '@/lib/verified';

export function HomeHero() {
  const [heroPal, setHeroPal] = useState(0); // default to Center Court Green (on-brand)
  const pal = PALETTES[heroPal]!;

  return (
    <>
      <section className="mx-auto grid max-w-content items-center gap-8 px-5 pb-8 pt-9 sm:px-7 lg:grid-cols-[1fr_1.08fr] lg:gap-16 lg:pb-10 lg:pt-[72px]">
        <div className="animate-fade-up">
          <div className="eyebrow mb-6">Build With GRIT</div>
          <h1 className="text-balance font-display text-[clamp(38px,5.4vw,66px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-ink">
            Design your court, down to the <span className="text-brand-600">last line.</span>
          </h1>
          <p className="mt-5 max-w-[480px] text-[clamp(16px,1.4vw,18.5px)] leading-relaxed text-[#42504a]">
            Spin a real court in 3D, pick your surface colours, then drop it into a photo of your
            own backyard — before we ever break ground. Full-service installers on the Wasatch
            Front, slab to final line.
          </p>
          <div className="mb-8 mt-7 flex flex-wrap items-center gap-5">
            <NavyLink href="/design">Design your court in 3D</NavyLink>
            <UnderlineLink href="/planner">Will it fit my yard? →</UnderlineLink>
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
          <div className="relative overflow-hidden rounded-lg shadow-lift" style={{ aspectRatio: '4 / 3.2', background: 'linear-gradient(165deg,#13314c,#0c1d2e)' }}>
              <div className="absolute left-4 top-3.5 z-[4] text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">Live 3D · drag to orbit</div>
              <Court3D courtType="pickleball" play={pal.play} surround={pal.surround} netOn fenceOn autoRotate showControls={false} />
              <div className="absolute bottom-3.5 left-4 z-[4] flex flex-wrap items-center gap-2.5">
                {HERO_PALETTES.map((pi) => {
                  const p = PALETTES[pi]!;
                  const sel = heroPal === pi;
                  return (
                    <button
                      key={pi}
                      title={p.name}
                      aria-label={p.name}
                      onClick={() => setHeroPal(pi)}
                      className="h-7 w-7 rounded-md p-0"
                      style={{ background: `linear-gradient(135deg,${p.play} 0 55%,${p.surround} 55% 100%)`, border: `2px solid ${sel ? '#fff' : 'rgba(255,255,255,0.3)'}`, boxShadow: sel ? '0 0 0 2px #7fb2dd' : 'none' }}
                    />
                  );
                })}
              </div>
          </div>

          {/* Real work, directly under the interactive court: the 3D panel earns
              attention, the photograph proves we actually build them. */}
          <figure className="relative mt-3 overflow-hidden rounded-lg bg-[#e8eef3] shadow-card" style={{ aspectRatio: '16 / 6' }}>
            <Image
              src={PHOTOS.heroCourt}
              alt="A finished backyard sport court built by GRIT Courts on the Wasatch Front"
              fill
              sizes="(max-width:1024px) 100vw, 620px"
              className="object-cover"
            />
            <figcaption className="absolute bottom-2.5 left-3 rounded-[5px] bg-[rgba(20,33,47,0.82)] px-2.5 py-1.5 text-[11.5px] font-semibold text-white backdrop-blur">
              Backyard sport court · Wasatch Front, UT
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
