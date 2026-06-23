'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Court3D } from '@/components/court/court-3d';
import { TypeChips, SizeChips, PaletteRow, AddonToggles } from '@/components/design/controls';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { saveConfig } from '@/lib/config-store';
import {
  DEFAULT_CONFIG,
  PALETTES,
  accForType,
  configPrice,
  fmtUsd,
  type AccKey,
  type ConfigCourtType,
  type ConfigSize,
  type CourtConfig,
} from '@/lib/configurator';
import { cn } from '@/lib/utils';

export function Configurator() {
  const router = useRouter();
  const { open } = useEstimate();
  const [layout, setLayout] = useState<'panel' | 'bottom'>('panel');
  const [config, setConfig] = useState<CourtConfig>(DEFAULT_CONFIG);
  const [loadingModel, setLoadingModel] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (loadTimer.current) clearTimeout(loadTimer.current); }, []);

  function setType(courtType: ConfigCourtType) {
    setConfig((c) => ({ ...c, courtType, acc: accForType(courtType, c.acc) }));
    setLoadingModel(true);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoadingModel(false), 620);
  }
  const setSize = (size: ConfigSize) => setConfig((c) => ({ ...c, size }));
  const setPalette = (paletteIdx: number) => setConfig((c) => ({ ...c, paletteIdx }));
  const toggleAcc = (k: AccKey) => setConfig((c) => ({ ...c, acc: { ...c.acc, [k]: !c.acc[k] } }));

  const pal = PALETTES[config.paletteIdx]!;
  const price = configPrice(config);

  function seeInYard() {
    saveConfig(config);
    router.push('/preview');
  }

  const viewport = (
    <Court3D
      courtType={config.courtType}
      play={pal.play}
      surround={pal.surround}
      netOn={config.acc.net}
      hoopOn={config.acc.hoop}
      fenceOn={config.acc.fence}
      lightsOn={config.acc.lights}
      reboundOn={config.acc.rebound}
      autoRotate={false}
    />
  );

  return (
    <div className="mx-auto max-w-content px-5 sm:px-7">
      {/* header row */}
      <div className="flex flex-wrap items-end justify-between gap-5 pb-3 pt-6">
        <div>
          <div className="eyebrow mb-2.5">3D configurator</div>
          <h1 className="font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-none">Design your court.</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#9aa4ad]">Layout</span>
          <LayoutToggle active={layout === 'panel'} onClick={() => setLayout('panel')}>Side panel</LayoutToggle>
          <LayoutToggle active={layout === 'bottom'} onClick={() => setLayout('bottom')}>Bottom bar</LayoutToggle>
        </div>
      </div>

      {layout === 'panel' ? (
        <div className="mb-9 grid min-h-[600px] overflow-hidden rounded-lg border border-muted-line bg-white lg:grid-cols-[360px_1fr]">
          {/* options rail */}
          <div className="no-scrollbar flex max-h-[78vh] flex-col gap-6 overflow-y-auto border-b border-muted-line p-6 lg:border-b-0 lg:border-r">
            <Field label="Court type"><TypeChips value={config.courtType} onChange={setType} /></Field>
            <Field label="Size"><SizeChips value={config.size} onChange={setSize} /></Field>
            <Field label="Surface combo" right={pal.name}><PaletteRow value={config.paletteIdx} onChange={setPalette} /></Field>
            <Field label="Add-ons"><AddonToggles acc={config.acc} onToggle={toggleAcc} /></Field>
          </div>
          {/* viewport */}
          <div className="relative min-h-[560px]" style={{ background: 'radial-gradient(120% 100% at 50% 32%,#1c4734,#0d1f16 70%)' }}>
            <div className="absolute left-[18px] top-4 z-[4] text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Live 3D · drag to orbit · scroll to zoom</div>
            {viewport}
            {loadingModel && (
              <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center gap-3.5 bg-[rgba(13,29,46,0.6)] backdrop-blur-sm">
                <span className="h-[34px] w-[34px] animate-spin360 rounded-full border-[3px] border-white/25 border-t-sky-accent" />
                <span className="text-[13px] font-semibold text-white/70">Loading court…</span>
              </div>
            )}
            <PriceBar price={price} onSeeYard={seeInYard} onEstimate={() => open({ config, source: 'configurator' })} dark />
          </div>
        </div>
      ) : (
        <div className="mb-9">
          <div className="relative h-[54vh] min-h-[380px] overflow-hidden rounded-t-lg border border-b-0 border-muted-line" style={{ background: 'radial-gradient(120% 100% at 50% 30%,#1c4734,#0d1f16 70%)' }}>
            <div className="absolute left-[18px] top-4 z-[4] text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Live 3D · drag to orbit</div>
            {viewport}
            <div className="absolute right-[18px] top-3.5 z-[4] text-right">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/55">Estimated</div>
              <div className="font-display text-[24px] font-extrabold leading-tight text-white">{fmtUsd(price.min)}–{fmtUsd(price.max)}</div>
            </div>
          </div>
          <div className="grid gap-6 rounded-b-lg border border-muted-line bg-white p-5 lg:grid-cols-[1.1fr_1fr_1.2fr_auto]">
            <div>
              <RailLabel>Type &amp; size</RailLabel>
              <div className="mb-2"><TypeChips value={config.courtType} onChange={setType} compact /></div>
              <SizeChips value={config.size} onChange={setSize} compact />
            </div>
            <div>
              <RailLabel>Surface</RailLabel>
              <PaletteRow value={config.paletteIdx} onChange={setPalette} cols={3} height={36} />
            </div>
            <div>
              <RailLabel>Add-ons</RailLabel>
              <AddonToggles acc={config.acc} onToggle={toggleAcc} />
            </div>
            <div className="flex flex-col justify-center gap-2.5">
              <button onClick={() => open({ config, source: 'configurator' })} className="whitespace-nowrap rounded-md bg-brand-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">Get my estimate →</button>
              <button onClick={seeInYard} className="whitespace-nowrap text-[13.5px] font-bold text-brand-600">See it in my yard →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceBar({ price, onSeeYard, onEstimate }: { price: { min: number; max: number }; onSeeYard: () => void; onEstimate: () => void; dark?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[5] flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-slate-900 px-[22px] py-4">
      <div>
        <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-faint">Estimated installed</div>
        <div className="font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-none text-white">{fmtUsd(price.min)} – {fmtUsd(price.max)}</div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button onClick={onSeeYard} className="rounded-md border-[1.5px] border-white/35 bg-white/10 px-[18px] py-3 text-sm font-bold text-white transition hover:bg-white/20">See it in my yard</button>
        <button onClick={onEstimate} className="rounded-md bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-cream">Get my estimate →</button>
      </div>
    </div>
  );
}

function Field({ label, right, children }: { label: string; right?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <RailLabel>{label}</RailLabel>
        {right && <span className="text-[12.5px] font-bold text-brand-600">{right}</span>}
      </div>
      {children}
    </div>
  );
}
function RailLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted-faint">{children}</div>;
}
function LayoutToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={cn('rounded-md border-[1.5px] px-3.5 py-1.5 text-[12.5px] font-bold transition', active ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300')}>
      {children}
    </button>
  );
}
