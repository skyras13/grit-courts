'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BeforeAfter } from '@/components/ui/before-after';
import { QuickLeadForm } from '@/components/lead/quick-lead-form';
import { processYardImage } from '@/lib/image-client';
import { ACCEPTED_IMAGE_TYPES } from '@/lib/schemas';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { CourtType } from '@/lib/types';

type Phase = 'idle' | 'ready' | 'rendering' | 'done' | 'failed';

const COURT_CHOICES: { value: CourtType; label: string; icon: string }[] = [
  { value: 'pickleball', label: 'Pickleball', icon: '🥒' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
  { value: 'multi-sport', label: 'Multi-sport', icon: '🎾' },
];

const PROGRESS_MESSAGES = [
  'Reading your yard…',
  'Mapping the perspective…',
  'Pouring the court…',
  'Painting the lines…',
  'Adding the finishing touches…',
];

export function Previewer() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [courtType, setCourtType] = useState<CourtType>('pickleball');
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState(PROGRESS_MESSAGES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = useCallback(async (file: File) => {
    setError(null);
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setError('Please choose a JPG, PNG, WebP, or HEIC photo.');
      return;
    }
    try {
      const processed = await processYardImage(file);
      setBeforeUrl(processed.previewUrl);
      setProcessedBlob(processed.blob);
      setPhase('ready');
      track('previewer_upload', { courtType });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that image.');
    }
  }, [courtType]);

  async function startRender() {
    if (!processedBlob) return;
    setPhase('rendering');
    setError(null);

    // Cycle progress messages for a lively wait.
    let i = 0;
    const ticker = window.setInterval(() => {
      i = (i + 1) % PROGRESS_MESSAGES.length;
      setProgressMsg(PROGRESS_MESSAGES[i]!);
    }, 2200);

    try {
      const form = new FormData();
      form.append('image', new File([processedBlob], 'yard.jpg', { type: 'image/jpeg' }));
      form.append('courtType', courtType);
      const res = await fetch('/api/renders', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not start the preview.');
      setRenderId(data.renderId);
      await poll(data.renderId, ticker);
    } catch (err) {
      window.clearInterval(ticker);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setPhase('failed');
      track('previewer_render_failed', {});
    }
  }

  async function poll(id: string, ticker: number) {
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1800));
      const res = await fetch(`/api/renders/${id}`);
      const data = await res.json();
      if (data.status === 'done' && data.renderedImageUrl) {
        window.clearInterval(ticker);
        setAfterUrl(data.renderedImageUrl);
        setPhase('done');
        track('previewer_render_done', { courtType });
        return;
      }
      if (data.status === 'failed') {
        window.clearInterval(ticker);
        throw new Error('The preview didn’t come out right.');
      }
    }
    window.clearInterval(ticker);
    throw new Error('This is taking longer than usual.');
  }

  function reset() {
    setPhase('idle');
    setBeforeUrl(null);
    setProcessedBlob(null);
    setAfterUrl(null);
    setRenderId(null);
    setError(null);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Court type selector — always visible except on done/failed */}
      {(phase === 'idle' || phase === 'ready') && (
        <fieldset className="mb-6">
          <legend className="mb-3 text-sm font-semibold text-ink">1. Pick a court type</legend>
          <div className="grid grid-cols-3 gap-3">
            {COURT_CHOICES.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={courtType === c.value}
                onClick={() => setCourtType(c.value)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition',
                  courtType === c.value ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-brand-300',
                )}
              >
                <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                <span className="text-sm font-semibold text-ink">{c.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Upload zone */}
      {(phase === 'idle' || phase === 'ready') && (
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">2. Add a photo of your space</p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) void onSelectFile(f);
            }}
            className="flex min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-6 text-center transition hover:border-brand-400 hover:bg-brand-50"
          >
            {beforeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={beforeUrl} alt="Your uploaded yard" className="max-h-56 rounded-lg object-contain" />
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-brand-400" aria-hidden="true">
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-3 font-semibold text-ink">Tap to upload or drag a photo here</p>
                <p className="mt-1 text-sm text-fg-muted">Backyard, driveway, or old court · JPG/PNG/HEIC · up to 10MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onSelectFile(f);
              }}
            />
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            🔒 We strip location data from your photo in your browser before it’s ever uploaded.
          </p>

          {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {phase === 'ready' && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={startRender} variant="court" size="lg" className="font-bold">
                Generate my court preview →
              </Button>
              <button type="button" onClick={reset} className="text-sm font-semibold text-fg-muted hover:text-ink">
                Choose a different photo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rendering */}
      {phase === 'rendering' && (
        <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-brand-100 border-t-court-500" />
          </div>
          <p className="mt-5 text-lg font-semibold text-ink" aria-live="polite">{progressMsg}</p>
          <p className="mt-1 text-sm text-fg-muted">This usually takes about 10–20 seconds.</p>
        </div>
      )}

      {/* Done */}
      {phase === 'done' && beforeUrl && afterUrl && (
        <div className="space-y-8">
          <div>
            <BeforeAfter
              beforeSrc={beforeUrl}
              afterSrc={afterUrl}
              beforeAlt="Your yard before"
              afterAlt="Your yard with a GRIT court"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-fg-muted">Drag the slider to reveal your court.</p>
              <button type="button" onClick={reset} className="text-sm font-semibold text-brand-700 hover:underline">
                Try another photo
              </button>
            </div>
          </div>
          <QuickLeadForm
            renderId={renderId ?? undefined}
            courtType={courtType}
            source="previewer"
            heading="Love it? Let’s make it real."
            subheading="We’ll send this design and a tailored quote, and book your free on-site consult."
          />
        </div>
      )}

      {/* Failed — graceful degrade, still capture the lead */}
      {phase === 'failed' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <p className="font-semibold">Our AI got a little stuck on that one.</p>
            <p className="mt-1 text-sm">
              No problem — leave your details and one of our designers will hand-render your court
              and text it over. {error ? <span className="opacity-70">({error})</span> : null}
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm font-semibold underline">
              Or try another photo
            </button>
          </div>
          <QuickLeadForm
            courtType={courtType}
            source="previewer-fallback"
            heading="Get your hand-rendered design"
            subheading="Tell us where to send it — free, no obligation."
          />
        </div>
      )}
    </div>
  );
}
