'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BeforeAfter } from '@/components/ui/before-after';
import { FilePicker } from '@/components/ui/file-picker';
import { CourtThumbnail } from '@/components/court/court-thumbnail';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { loadDesign } from '@/lib/config-store';
import { processYardImage } from '@/lib/image-client';
import { track } from '@/lib/analytics';
import { DEFAULT_DESIGN, designDetail, toLeadCourtType, type DesignConfig } from '@/lib/court-designer';

type Phase = 'idle' | 'ready' | 'generating' | 'done' | 'failed';

export function YardPreviewer() {
  const { open } = useEstimate();
  const [phase, setPhase] = useState<Phase>('idle');
  const [img, setImg] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [consent, setConsent] = useState(false);
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);
  const [aiUrl, setAiUrl] = useState<string | null>(null);
  const [view, setView] = useState<'natural' | 'aerial'>('natural');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDesign(loadDesign()), []);

  function startWith(url: string, b: Blob | null) {
    setImg(url);
    setBlob(b);
    setAiUrl(null);
    setError(null);
    setPhase('ready');
    track('previewer_upload', { sport: design.sport });
  }

  async function handleFile(file: File) {
    setError(null);
    try {
      const p = await processYardImage(file);
      startWith(p.previewUrl, p.blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that image.');
    }
  }

  function reset() { setImg(null); setBlob(null); setAiUrl(null); setPhase('idle'); }

  async function generateAI() {
    if (!img) return;
    setPhase('generating');
    setError(null);
    try {
      let body = blob;
      if (!body) body = await (await fetch(img)).blob();
      const form = new FormData();
      form.append('image', new File([body], 'yard.jpg', { type: body.type || 'image/jpeg' }));
      form.append('courtType', toLeadCourtType(design.sport));
      form.append('detail', designDetail(design));
      form.append('view', view);
      // The render runs synchronously server-side and returns the image URL
      // directly (no polling — reliable on serverless).
      const res = await fetch('/api/renders', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.renderedImageUrl) {
        throw new Error(data.error ?? 'The render didn’t come out right.');
      }
      setAiUrl(data.renderedImageUrl);
      setPhase('done');
      track('previewer_render_done', { sport: design.sport, view });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Render failed.');
      setPhase('failed');
      track('previewer_render_failed', {});
    }
  }

  return (
    <div>

      <div className="relative overflow-hidden rounded-xl shadow-lift" style={{ aspectRatio: '16 / 9', background: 'linear-gradient(165deg,#16293c,#0d1d2e)' }}>
        {/* IDLE */}
        {phase === 'idle' && (
          <FilePicker
            disabled={!consent}
            onFiles={(files) => void handleFile(files[0]!)}
            className="absolute inset-0 m-3.5 flex flex-col items-center justify-center gap-3.5 rounded-[10px] border-2 border-dashed p-8 text-center"
          >
          <div
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f && consent) void handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-3.5"
            style={{ cursor: consent ? 'pointer' : 'default' }}
          >
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-[rgba(127,178,221,0.16)]">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#7fb2dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </div>
            <div className="font-display text-[20px] font-bold text-white">Drag a backyard photo here</div>
            <div className="text-[14px] text-[#9fb0bf]">or <span className="text-sky-accent underline">browse your files</span> — a wide shot of the open space works best</div>
          </div>
          </FilePicker>
        )}

        {/* READY: photo + your-design chip + generate */}
        {(phase === 'ready' || phase === 'generating') && img && (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${img}")`, filter: phase === 'generating' ? 'brightness(0.6)' : 'none' }} />
            <div className="absolute left-4 top-4 z-[3] w-40 overflow-hidden rounded-lg border border-white/30 bg-slate-900/70 p-1.5 backdrop-blur">
              <div className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-white/70">Your design</div>
              <CourtThumbnail config={design} />
            </div>
            {phase === 'ready' ? (
              <div className="absolute inset-x-0 bottom-4 z-[3] flex flex-col items-center gap-2.5">
                <div className="flex items-center gap-1 rounded-full bg-slate-900/75 p-1 backdrop-blur">
                  {(['natural', 'aerial'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={
                        'rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition ' +
                        (view === v ? 'bg-white text-ink' : 'text-white/80 hover:text-white')
                      }
                    >
                      {v === 'natural' ? 'Eye-level photo' : 'Drone / aerial'}
                    </button>
                  ))}
                </div>
                <button onClick={generateAI} className="rounded-full bg-brand-600 px-6 py-3.5 text-[14px] font-bold text-white shadow-lift transition hover:bg-brand-700">
                  ✨ Make it photorealistic
                </button>
                <button onClick={reset} className="rounded-md bg-slate-900/70 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">New photo</button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="h-10 w-10 animate-spin360 rounded-full border-[3px] border-white/25 border-t-sky-accent" />
                <span className="font-display text-[15px] font-bold text-white">Placing your court…</span>
                <span className="text-[13px] text-[#9fb0bf]">Matching grade, colors, and perspective</span>
              </div>
            )}
          </>
        )}

        {/* DONE: before/after */}
        {phase === 'done' && aiUrl && img && (
          <BeforeAfter beforeSrc={img} afterSrc={aiUrl} beforeAlt="Your yard" afterAlt="Your yard with a GRIT court" className="!aspect-[16/9] !rounded-none" />
        )}
      </div>

      {/* IDLE controls */}
      {phase === 'idle' && (
        <>
          <label className="mt-[18px] flex max-w-[620px] cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-[17px] w-[17px] flex-none accent-brand-600" />
            <span className="text-[13px] leading-relaxed text-muted">I’m okay with GRIT using my uploaded photo to generate a court preview. We don’t share it, and you can ask us to delete it anytime. <span className="text-muted-faint">(Required to upload.)</span></span>
          </label>
          {error && <p role="alert" className="mt-3 max-w-[620px] rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-2.5 text-[13.5px] text-muted-soft">
            No photo handy?{' '}
            <button onClick={() => startWith('/samples/yard-aerial.jpg', null)} className="border-b-[1.5px] border-brand-600 font-bold text-brand-600">Try it on a sample yard →</button>
            {' · '}
            <Link href="/design" className="border-b-[1.5px] border-brand-600 font-bold text-brand-600">Change your design</Link>
          </div>
        </>
      )}

      {/* DONE / FAILED controls + always-available send */}
      {(phase === 'ready' || phase === 'done' || phase === 'failed') && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={() => open({ design, source: 'previewer' })} className="rounded-md bg-brand-600 px-6 py-3 text-[14.5px] font-bold text-white transition hover:bg-brand-700">
            Send this to GRIT →
          </button>
          <Link href="/design" className="rounded-md border-[1.5px] border-brand-200 px-5 py-2.5 text-[13.5px] font-bold text-brand-600 hover:bg-brand-50">Change your design</Link>
          {phase === 'done' && <button onClick={generateAI} className="text-[13.5px] font-bold text-brand-600 hover:underline">Regenerate</button>}
          <button onClick={reset} className="text-[13.5px] font-bold text-muted-faint hover:text-ink">New photo</button>
        </div>
      )}

      {phase === 'failed' && (
        <p role="alert" className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Our AI got stuck on that one — no problem. Send it to our team and a designer will render your exact design onto your photo. {error}
        </p>
      )}
    </div>
  );
}
