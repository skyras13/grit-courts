'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Court3D } from '@/components/court/court-3d';
import { NavyLink, UnderlineLink } from '@/components/ui/buttons';
import { PALETTES, HERO_PALETTES } from '@/lib/configurator';
import { PHOTOS } from '@/lib/content';
import { cn } from '@/lib/utils';

export function HomeHero() {
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [heroPal, setHeroPal] = useState(0);
  const pal = PALETTES[heroPal]!;

  return (
    <>
      <section className="mx-auto grid max-w-content items-center gap-8 px-5 pb-8 pt-9 sm:px-7 lg:grid-cols-[1fr_1.08fr] lg:gap-16 lg:pb-10 lg:pt-[72px]">
        <div className="animate-fade-up">
          <div className="eyebrow mb-6">Custom court &amp; backyard builders · Provo, UT</div>
          <h1 className="text-balance font-display text-[clamp(38px,5.4vw,66px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-ink">
            {variant === 'A' ? (
              <>Build the backyard you’ll never want to <span className="text-brand-600">leave.</span></>
            ) : (
              <>Design your court, down to the <span className="text-brand-600">last line.</span></>
            )}
          </h1>
          <p className="mt-5 max-w-[480px] text-[clamp(16px,1.4vw,18.5px)] leading-relaxed text-[#4a5560]">
            {variant === 'A'
              ? 'Custom sport courts, pools, concrete, and complete backyard transformations across the Wasatch Front — designed, built, and warrantied by one Utah crew.'
              : 'Spin a real 3D court, pick your surface colors, add fencing and lights — then drop it into a photo of your own backyard before we ever break ground.'}
          </p>
          <div className="mb-8 mt-7 flex flex-wrap items-center gap-5">
            {variant === 'A' ? (
              <>
                <NavyLink href="/preview">See it in your yard</NavyLink>
                <UnderlineLink href="/gallery">View our work →</UnderlineLink>
              </>
            ) : (
              <>
                <NavyLink href="/design">Design in 3D</NavyLink>
                <UnderlineLink href="/preview">See it in your yard →</UnderlineLink>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-[18px] border-t border-muted-line pt-6">
            <span className="flex items-center gap-1.5">
              <span className="tracking-[1px] text-gold">★★★★★</span>
              <span className="text-[13.5px] font-bold text-ink">4.8</span>
            </span>
            <span className="text-[13px] text-muted-soft">120+ backyards built</span>
            <span className="text-[13px] text-muted-soft">HBA member</span>
            <span className="text-[13px] text-muted-soft">10-yr warranty</span>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          {variant === 'A' ? (
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg bg-[#e8eef3] shadow-lift" style={{ aspectRatio: '4 / 3.2' }}>
                <Image src={PHOTOS.heroCourt} alt="Finished backyard sport court by GRIT Courts" fill priority sizes="(max-width:1024px) 100vw, 620px" className="object-cover" />
              </div>
              <div className="absolute bottom-[18px] left-[18px] rounded-[5px] bg-[rgba(20,33,47,0.82)] px-3.5 py-2 text-[12.5px] font-semibold text-white backdrop-blur">
                Backyard sport court · Wasatch Front, UT
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-content items-center justify-end gap-2.5 px-5 pb-2.5 sm:px-7">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#9aa4ad]">Hero</span>
        <HeroToggle active={variant === 'A'} onClick={() => setVariant('A')}>Photo</HeroToggle>
        <HeroToggle active={variant === 'B'} onClick={() => setVariant('B')}>Interactive</HeroToggle>
      </div>
    </>
  );
}

function HeroToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-md border-[1.5px] px-3.5 py-1.5 text-[12.5px] font-bold transition',
        active ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
      )}
    >
      {children}
    </button>
  );
}
