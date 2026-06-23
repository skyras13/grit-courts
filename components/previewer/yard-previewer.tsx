'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { Court3D } from '@/components/court/court-3d';
import { TypeChips, PaletteRow } from '@/components/design/controls';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { loadConfig, saveConfig } from '@/lib/config-store';
import { processYardImage } from '@/lib/image-client';
import { track } from '@/lib/analytics';
import {
  DEFAULT_CONFIG,
  PALETTES,
  accForType,
  configPrice,
  fmtUsd,
  type ConfigCourtType,
  type CourtConfig,
} from '@/lib/configurator';

type Phase = 'idle' | 'loading' | 'result';

export function YardPreviewer() {
  const router = useRouter();
  const { open } = useEstimate();
  const [phase, setPhase] = useState<Phase>('idle');
  const [img, setImg] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [showCourt, setShowCourt] = useState(true);
  const [scale, setScale] = useState(1);
  const [posY, setPosY] = useState(62);
  const [config, setConfig] = useState<CourtConfig>(DEFAULT_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pick up a config carried over from /design.
  useEffect(() => {
    setConfig(loadConfig());
    return () => { if (loadTimer.current) clearTimeout(loadTimer.current); };
  }, []);

  const pal = PALETTES[config.paletteIdx]!;
  const price = configPrice(config);

  function startWith(url: string) {
    setImg(url);
    setPhase('loading');
    setShowCourt(true);
    track('previewer_upload', { courtType: config.courtType });
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => {
      setPhase('result');
      track('previewer_render_done', { courtType: config.courtType });
    }, 1700);
  }

  async function handleFile(file: File) {
    setError(null);
    try {
      const processed = await processYardImage(file);
      startWith(processed.previewUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that image.');
    }
  }

  const pickFile = () => { if (consent) fileRef.current?.click(); };
  function reset() { setImg(null); setPhase('idle'); }
  const setType = (t: ConfigCourtType) => setConfig((c) => ({ ...c, courtType: t, acc: accForType(t, c.acc) }));
  const setPalette = (i: number) => setConfig((c) => ({ ...c, paletteIdx: i }));

  const courtLayer: CSSProperties = {
    position: 'absolute', left: '50%', top: `${posY}%`,
    width: `${Math.round(74 * scale)}%`, height: `${Math.round(70 * scale)}%`,
    transform: 'translate(-50%,-50%)', zIndex: 3,
    opacity: showCourt ? 1 : 0, pointerEvents: showCourt ? 'auto' : 'none',
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }} />

      <div className="relative overflow-hidden rounded-xl shadow-lift" style={{ aspectRatio: '16 / 9', background: 'linear-gradient(165deg,#16332a,#0d1d16)' }}>
        {phase === 'idle' && (
          <div
            role="button"
            tabIndex={0}
            onClick={pickFile}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFile()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f && consent) void handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            className="absolute inset-0 m-3.5 flex flex-col items-center justify-center gap-3.5 rounded-[10px] border-2 border-dashed p-8 text-center transition"
            style={{ cursor: consent ? 'pointer' : 'default', borderColor: consent ? '#27704a' : 'rgba(255,255,255,0.22)' }}
          >
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-[rgba(127,198,163,0.16)]">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#7fc6a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </div>
            <div className="font-display text-[20px] font-bold text-white">Drag a backyard photo here</div>
            <div className="text-[14px] text-[#9fb0bf]">or <span className="text-sky-accent underline">browse your files</span> — a wide shot of the open space works best</div>
          </div>
        )}

        {phase === 'loading' && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url("${img}")` : undefined, filter: 'brightness(0.65)', background: img ? undefined : '#0e1a27' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(13,29,46,0.5)] backdrop-blur-sm">
              <span className="h-10 w-10 animate-spin360 rounded-full border-[3px] border-white/25 border-t-sky-accent" />
              <span className="font-display text-[15px] font-bold text-white">Placing your court…</span>
              <span className="text-[13px] text-[#9fb0bf]">Matching grade and perspective</span>
            </div>
          </>
        )}

        {phase === 'result' && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: img ? `url("${img}")` : undefined, background: img ? undefined : '#0e1a27' }} />
            <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,0.28))', pointerEvents: 'none' }} />
            <div style={courtLayer}>
              <Court3D courtType={config.courtType} play={pal.play} surround={pal.surround} netOn={config.acc.net} hoopOn={config.acc.hoop} fenceOn={config.acc.fence} lightsOn={config.acc.lights} reboundOn={config.acc.rebound} autoRotate={false} showControls={false} />
            </div>
            <div className="absolute left-4 top-4 z-[5] flex gap-2.5">
              <button onClick={() => setShowCourt((v) => !v)} className="rounded-md bg-white/90 px-3.5 py-2 text-[12.5px] font-bold text-ink backdrop-blur">{showCourt ? 'Hide court' : 'Show court'}</button>
              <button onClick={reset} className="rounded-md bg-[rgba(20,33,47,0.7)] px-3.5 py-2 text-[12.5px] font-bold text-white backdrop-blur">New photo</button>
            </div>
            <div className="absolute right-4 top-4 z-[5] rounded-md bg-[rgba(20,33,47,0.55)] px-2.5 py-[7px] text-[11px] font-bold uppercase tracking-[0.1em] text-white/85">Preview · drag the court to orbit</div>
          </>
        )}
      </div>

      {phase === 'idle' && (
        <>
          <label className="mt-[18px] flex max-w-[620px] cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-[17px] w-[17px] flex-none accent-brand-600" />
            <span className="text-[13px] leading-relaxed text-muted">I’m okay with GRIT using my uploaded photo to generate a court preview. We don’t share it, and you can ask us to delete it anytime. <span className="text-muted-faint">(Required to upload.)</span></span>
          </label>
          {error && <p role="alert" className="mt-3 max-w-[620px] rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-2.5 text-[13.5px] text-muted-soft">
            No photo handy?{' '}
            <button onClick={() => startWith('/samples/yard-before.svg')} className="border-b-[1.5px] border-brand-600 font-bold text-brand-600">Try it on a sample yard →</button>
          </div>
        </>
      )}

      {phase === 'result' && (
        <div className="mt-5 grid gap-6 rounded-xl border border-muted-line bg-white p-[22px] md:grid-cols-3">
          <div>
            <RailLabel>Court &amp; surface</RailLabel>
            <div className="mb-3"><TypeChips value={config.courtType} onChange={setType} compact /></div>
            <PaletteRow value={config.paletteIdx} onChange={setPalette} cols={6} height={30} />
          </div>
          <div>
            <RailLabel>Placement</RailLabel>
            <div className="mb-3">
              <div className="mb-1.5 text-[12.5px] text-muted">Size</div>
              <input type="range" min={0.5} max={1.6} step={0.02} value={scale} onChange={(e) => setScale(+e.target.value)} className="w-full accent-brand-600" aria-label="Court size" />
            </div>
            <div>
              <div className="mb-1.5 text-[12.5px] text-muted">Position</div>
              <input type="range" min={42} max={82} step={1} value={posY} onChange={(e) => setPosY(+e.target.value)} className="w-full accent-brand-600" aria-label="Court position" />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3.5">
            <div>
              <RailLabel>Your estimate</RailLabel>
              <div className="font-display text-[26px] font-extrabold leading-none">{fmtUsd(price.min)} – {fmtUsd(price.max)}</div>
            </div>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => open({ config, source: 'previewer' })} className="rounded-md bg-brand-600 py-3.5 text-[14.5px] font-bold text-white transition hover:bg-brand-700">Send this to GRIT →</button>
              <button onClick={() => { saveConfig(config); router.push('/design'); }} className="rounded-md border-[1.5px] border-brand-200 py-3 text-[13.5px] font-bold text-brand-600">Fine-tune in 3D</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RailLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-faint">{children}</div>;
}
