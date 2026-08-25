'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { saveDesign } from '@/lib/config-store';
import { track } from '@/lib/analytics';
import { PADS, padsFor } from '@/lib/court-geometry';
import {
  BBALL_OVERLAYS,
  DEFAULT_DESIGN,
  LOGO_PRESETS,
  LOGO_POSITIONS,
  zonesFor,
  SURFACE_COLORS,
  colorName,
  type BasketballOverlay,
  type CourtSizeOpt,
  type DesignConfig,
  type LogoKey,
  type LogoPos,
  type Sport,
  type ZoneKey,
} from '@/lib/court-designer';
import { FilePicker } from '@/components/ui/file-picker';
import { cn } from '@/lib/utils';

// Three.js viewport is client-only + heavy → lazy load, no SSR.
const CourtThree = dynamic(() => import('@/components/court/court-three'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950">
      <span className="h-9 w-9 animate-spin360 rounded-full border-[3px] border-white/25 border-t-sky-accent" />
    </div>
  ),
});

const SPORTS: { key: Sport; label: string }[] = [
  { key: 'pickleball', label: 'Pickleball' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'tennis', label: 'Tennis' },
];

export function CourtDesignerUI() {
  const router = useRouter();
  const { open } = useEstimate();
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);

  const zones = zonesFor(design);
  const pads = padsFor(design.sport, design.size === 'full');

  const setSport = (sport: Sport) =>
    setDesign((d) => {
      const allowed = padsFor(sport, d.size === 'full');
      return { ...d, sport, pad: allowed.includes(d.pad) ? d.pad : allowed[0]! };
    });
  const setZone = (zone: ZoneKey, colorId: string) =>
    setDesign((d) => ({ ...d, zones: { ...d.zones, [zone]: colorId } }));
  const setSize = (size: CourtSizeOpt) =>
    setDesign((d) => {
      const allowed = padsFor(d.sport, size === 'full');
      return { ...d, size, pad: allowed.includes(d.pad) ? d.pad : allowed[0]! };
    });
  const setBball = (bball: BasketballOverlay) => setDesign((d) => ({ ...d, bball }));
  const setLogo = (logo: LogoKey) => setDesign((d) => ({ ...d, logo }));
  const setLogoPos = (logoPos: LogoPos) => setDesign((d) => ({ ...d, logoPos }));

  function onUploadLogo(f: File) {
    const url = URL.createObjectURL(f);
    setDesign((d) => ({ ...d, logo: 'custom', customLogoUrl: url }));
  }
  function clearLogo() {
    setDesign((d) => ({ ...d, logo: 'none', customLogoUrl: undefined }));
  }

  function seeInYard() {
    saveDesign(design);
    track('cta_click', { location: 'designer_see_yard' });
    router.push('/preview');
  }

  return (
    <div className="mx-auto max-w-content px-5 sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 pt-6">
        <div>
          <div className="eyebrow mb-2.5">3D Court Designer</div>
          <h1 className="font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-none">Design your court.</h1>
        </div>
        {/* Sport tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-muted-line bg-white p-1">
          {SPORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSport(s.key)}
              aria-pressed={design.sport === s.key}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-bold transition',
                design.sport === s.key ? 'bg-brand-600 text-white' : 'text-[#46525d] hover:bg-cream',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D viewport */}
      <div className="relative overflow-hidden rounded-xl border border-muted-line" style={{ aspectRatio: '16 / 10', maxHeight: '62vh' }}>
        <CourtThree config={design} />
        <div className="pointer-events-none absolute left-4 top-3.5 z-[2] text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
          Live 3D · drag to orbit · scroll to zoom
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={seeInYard} className="rounded-md bg-brand-600 px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-700">
          See it in my yard →
        </button>
        <button onClick={() => open({ design, source: 'designer' })} className="rounded-md border-[1.5px] border-brand-200 px-6 py-3 text-[15px] font-bold text-brand-600 transition hover:bg-brand-50">
          Get a quote
        </button>
        <a href="/planner" className="rounded-md border-[1.5px] border-muted-input px-5 py-3 text-[15px] font-bold text-[#3a4651] transition hover:border-brand-300">
          Will it fit my yard?
        </a>
        <span className="text-[13px] text-muted-faint">Free on-site estimate — no pricing games.</span>
      </div>

      {/* Controls */}
      <div className="mt-8 grid gap-x-8 gap-y-7 border-t border-muted-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {design.sport === 'basketball' && (
          <Group label="Court Size" value={design.size === 'full' ? 'Full' : 'Half'}>
            <div className="flex gap-2">
              {(['half', 'full'] as CourtSizeOpt[]).map((s) => (
                <Pill key={s} active={design.size === s} onClick={() => setSize(s)}>
                  {s === 'half' ? 'Half' : 'Full'}
                </Pill>
              ))}
            </div>
          </Group>
        )}

        {pads.length > 1 && (
          <Group label="Pad Size" value={PADS[design.pad].label + ' ft'}>
            <div className="flex flex-wrap gap-2">
              {pads.map((p) => (
                <Pill key={p} active={design.pad === p} onClick={() => setDesign((d) => ({ ...d, pad: p }))}>
                  {PADS[p].label}
                </Pill>
              ))}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-faint">{PADS[design.pad].note}</p>
          </Group>
        )}

        {zones.map((z) => (
          <Group key={z.key} label={z.label} value={colorName(design.zones[z.key])}>
            <Swatches selected={design.zones[z.key]} onSelect={(id) => setZone(z.key, id)} />
          </Group>
        ))}

        {design.sport === 'pickleball' && (
          <Group label="Basketball" value={design.bball === 'none' ? 'None' : cap(design.bball)}>
            <div className="flex flex-wrap gap-2">
              {BBALL_OVERLAYS.map((o) => (
                <Pill key={o.key} active={design.bball === o.key} onClick={() => setBball(o.key)}>
                  {o.label}
                </Pill>
              ))}
            </div>
          </Group>
        )}

        <Group label="Logo" value={design.logo === 'none' ? 'None' : cap(design.logo)}>
          <div className="flex flex-wrap gap-2">
            {LOGO_PRESETS.filter((l) => l.key !== 'custom').map((l) => (
              <Pill key={l.key} active={design.logo === l.key} onClick={() => setLogo(l.key)}>
                {l.label}
              </Pill>
            ))}
            <FilePicker
              onFiles={(files) => onUploadLogo(files[0]!)}
              className={cn(
                'cursor-pointer rounded-md border-[1.5px] px-3 py-2 text-[13px] font-bold transition',
                design.logo === 'custom' ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
              )}
            >
              Upload Logo
            </FilePicker>
            {design.logo !== 'none' && (
              <button onClick={clearLogo} className="rounded-md px-3 py-2 text-[13px] font-bold text-muted-faint hover:text-ink">
                Clear
              </button>
            )}
          </div>
          {design.logo !== 'none' && (
            <div className="mt-3">
              <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-muted-faint">Position</div>
              <div className="flex flex-wrap gap-2">
                {LOGO_POSITIONS.map((p) => (
                  <Pill key={p.key} active={design.logoPos === p.key} onClick={() => setLogoPos(p.key)}>
                    {p.label}
                  </Pill>
                ))}
              </div>
            </div>
          )}
        </Group>
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Group({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-display text-[15px] font-extrabold uppercase tracking-wide text-accent">{label}</span>
        {value && <span className="text-[12.5px] font-semibold text-muted-faint">{value}</span>}
      </div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Swatches({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {SURFACE_COLORS.map((c) => (
        <button
          key={c.id}
          title={c.name}
          aria-label={c.name}
          aria-pressed={selected === c.id}
          onClick={() => onSelect(c.id)}
          className="h-9 w-full rounded-md transition"
          style={{
            background: c.hex,
            border: `2px solid ${selected === c.id ? '#2b598a' : 'rgba(0,0,0,0.12)'}`,
            boxShadow: selected === c.id ? '0 0 0 2px #bcd4ea' : 'none',
          }}
        />
      ))}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-md border-[1.5px] px-3.5 py-2 text-[13px] font-bold transition',
        active ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
      )}
    >
      {children}
    </button>
  );
}
