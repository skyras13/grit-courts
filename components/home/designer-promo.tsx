'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CourtThumbnail } from '@/components/court/court-thumbnail';
import { Reveal } from '@/components/ui/reveal';
import { DEFAULT_DESIGN, SURFACE_COLORS, colorName, type DesignConfig } from '@/lib/court-designer';
import { cn } from '@/lib/utils';

/**
 * Homepage promo for the court designer.
 *
 * Deliberately renders through CourtThumbnail — the same drawCourt engine the
 * real designer and the yard planner use — so the court shown here can never
 * drift away from the one on /design. The previous homepage widget was a
 * separate CSS-3D component with its own invented colour list, which is exactly
 * the divergence this avoids.
 *
 * The swatches are the real acrylic chart, so every colour a visitor can pick
 * here is one GRIT actually sprays.
 */

// A representative slice of the chart — the combinations people actually order.
const QUICK_COLOURS = ['competition-blue', 'competition-green', 'slate', 'bright-red', 'pro-purple', 'sandstone'];

export function DesignerPromo() {
  const [design, setDesign] = useState<DesignConfig>({ ...DEFAULT_DESIGN, bball: 'standard' });

  return (
    <section className="mx-auto max-w-content px-5 py-[clamp(56px,7vw,100px)] sm:px-7">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <div className="eyebrow mb-4">Court designer</div>
          <h2 className="max-w-[17ch] font-display text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.03] tracking-[-0.02em]">
            Pick your colours before we pour.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16.5px] leading-relaxed text-muted">
            Every colour below is a real acrylic we spray — the same chart we hand you on site. Lay
            out your court, add basketball lines, drop a logo at centre, then send us the exact spec.
          </p>

          <div className="mt-6">
            <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-faint">
              Try the court colour — {colorName(design.zones.court)}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_COLOURS.map((id) => {
                const c = SURFACE_COLORS.find((s) => s.id === id)!;
                const selected = design.zones.court === id;
                return (
                  <button
                    key={id}
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={selected}
                    onClick={() => setDesign((d) => ({ ...d, zones: { ...d.zones, court: id } }))}
                    className="h-9 w-9 rounded-md transition hover:scale-105"
                    style={{
                      background: c.hex,
                      border: `2px solid ${selected ? '#2b598a' : 'rgba(0,0,0,0.12)'}`,
                      boxShadow: selected ? '0 0 0 2px #bcd4ea' : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/design"
              className="rounded-md bg-brand-600 px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-brand-700"
            >
              Open the 3D designer
            </Link>
            <Link
              href="/planner"
              className={cn(
                'rounded-md border-[1.5px] border-muted-input px-5 py-3 text-[15px] font-bold text-[#3a4651]',
                'transition hover:border-brand-300',
              )}
            >
              Will it fit my yard?
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <figure className="overflow-hidden rounded-xl border border-muted-line bg-white p-3 shadow-lift">
            <CourtThumbnail config={design} />
            <figcaption className="px-1 pt-2.5 text-[12.5px] text-muted-faint">
              Regulation 20′ × 44′ pickleball on a 35′ × 60′ pad, with standard basketball lines.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
