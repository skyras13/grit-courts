'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { drawCourt, courtPixelSize } from '@/lib/court-canvas';
import { PADS, PAD_ORDER } from '@/lib/court-geometry';
import { LOGO_SRC, type DesignConfig } from '@/lib/court-designer';
import { FilePicker } from '@/components/ui/file-picker';
import { cn } from '@/lib/utils';

/**
 * True-scale bird's-eye yard planner.
 *
 * A top-down photo is an orthographic projection, so a court placed on it needs
 * only translation + rotation + a single scale factor to be geometrically
 * honest. That's why this works on a drone/satellite shot and would NOT work on
 * an eye-level photo: once the visitor calibrates a known distance, every pixel
 * has a real-world length and the pad we draw is genuinely the pad GRIT pours.
 *
 * The payoff is the question every buyer asks first — "will it actually fit?" —
 * answered before anyone drives out to the property.
 */

type Mode = 'upload' | 'calibrate' | 'place';

interface Pt {
  x: number;
  y: number;
}

const CANVAS_W = 1400;

export function YardPlanner({
  design,
  onDesignChange,
  onExport,
}: {
  design: DesignConfig;
  onDesignChange?: (d: DesignConfig) => void;
  onExport?: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const courtRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<Mode>('upload');
  const [canvasH, setCanvasH] = useState(900);
  const [ruler, setRuler] = useState<{ a: Pt | null; b: Pt | null }>({ a: null, b: null });
  const [knownFt, setKnownFt] = useState(40);
  const [pxPerFt, setPxPerFt] = useState<number | null>(null);
  const [pos, setPos] = useState<Pt>({ x: CANVAS_W / 2, y: 450 });
  const [rot, setRot] = useState(0);
  /**
   * Gesture state lives in a ref, not React state. A pointermove can arrive
   * before React has re-rendered from the pointerdown, and a state-based flag
   * would still read false at that moment — dropping the first part of every
   * drag. The `dragging` state below exists only to drive the cursor.
   */
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [overCourt, setOverCourt] = useState(false);
  /** Offset from the pointer to the court centre at grab time, so the court
   *  doesn't jump its centre to the cursor the moment you press. */
  const grabRef = useRef<Pt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pad = PADS[design.pad];

  // ── Load the court texture whenever the design changes ────────────────────
  useEffect(() => {
    const { w, h } = courtPixelSize(design.pad);
    const cv = courtRef.current ?? document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const cx = cv.getContext('2d');
    if (cx) drawCourt(cx, design, logoRef.current);
    courtRef.current = cv;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, pxPerFt, pos, rot, mode, ruler]);

  // Load logo art for the overlay.
  useEffect(() => {
    if (design.logo === 'none') {
      logoRef.current = null;
      return;
    }
    const src = design.logo === 'custom' ? design.customLogoUrl : LOGO_SRC[design.logo as keyof typeof LOGO_SRC];
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoRef.current = img;
      const { w, h } = courtPixelSize(design.pad);
      const cv = courtRef.current;
      if (cv) {
        const cx = cv.getContext('2d');
        if (cx) drawCourt(cx, design, img);
      }
      void w;
      void h;
      draw();
    };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design.logo, design.customLogoUrl]);

  // ── Painting ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);

    const img = imgRef.current;
    if (img) ctx.drawImage(img, 0, 0, cv.width, cv.height);
    else {
      ctx.fillStyle = '#16293c';
      ctx.fillRect(0, 0, cv.width, cv.height);
    }

    // Ruler
    if (ruler.a) {
      const { a, b } = ruler;
      ctx.strokeStyle = '#fdb714';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo((b ?? a).x, (b ?? a).y);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const p of [a, b]) {
        if (!p) continue;
        ctx.fillStyle = '#fdb714';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Court at true scale
    const court = courtRef.current;
    if (court && pxPerFt && mode === 'place') {
      const w = pad.lengthFt * pxPerFt;
      const h = pad.widthFt * pxPerFt;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.globalAlpha = 0.94;
      ctx.drawImage(court, -w / 2, -h / 2, w, h);
      ctx.globalAlpha = 1;
      // Selection outline + corner handles
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 7]);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.setLineDash([]);
      ctx.restore();

      // Dimension label, drawn unrotated so it stays readable
      ctx.font = '700 26px Archivo, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(8,16,24,0.8)';
      ctx.fillStyle = '#fff';
      const label = `${pad.widthFt}′ × ${pad.lengthFt}′`;
      ctx.strokeText(label, pos.x, pos.y - h / 2 - 18);
      ctx.fillText(label, pos.x, pos.y - h / 2 - 18);
    }
  }, [mode, pad, pos, pxPerFt, rot, ruler]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ── Input handling ────────────────────────────────────────────────────────
  function toCanvas(e: React.PointerEvent<HTMLCanvasElement>): Pt {
    const cv = canvasRef.current!;
    const r = cv.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * cv.width,
      y: ((e.clientY - r.top) / r.height) * cv.height,
    };
  }

  /**
   * Is the pointer inside the court? The court can be rotated, so the point is
   * transformed into the court's own frame before the bounds check.
   */
  function hitCourt(p: Pt): boolean {
    if (!pxPerFt) return false;
    const w = pad.lengthFt * pxPerFt;
    const h = pad.widthFt * pxPerFt;
    const a = (-rot * Math.PI) / 180;
    const dx = p.x - pos.x;
    const dy = p.y - pos.y;
    const lx = dx * Math.cos(a) - dy * Math.sin(a);
    const ly = dx * Math.sin(a) + dy * Math.cos(a);
    return Math.abs(lx) <= w / 2 && Math.abs(ly) <= h / 2;
  }

  /** Keep at least a corner of the court on screen so it can't be lost. */
  function clamp(p: Pt): Pt {
    const margin = 40;
    return {
      x: Math.min(Math.max(p.x, margin), CANVAS_W - margin),
      y: Math.min(Math.max(p.y, margin), canvasH - margin),
    };
  }

  /** Pointer capture is an enhancement; a failure must not abort the gesture. */
  function capture(e: React.PointerEvent<HTMLCanvasElement>) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer not active (synthetic event, or already captured) */
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = toCanvas(e);

    // Calibrate is press-drag-release. It used to be click-then-click, but the
    // move handler set the end point as soon as the mouse travelled, so the
    // second click matched "already has both ends" and reset the line — the
    // ruler could never be completed with a real mouse.
    if (mode === 'calibrate') {
      capture(e);
      setRuler({ a: p, b: p });
      draggingRef.current = true;
      setDragging(true);
      return;
    }

    if (mode === 'place') {
      // Only grab the court itself; clicking bare ground shouldn't teleport it.
      if (!hitCourt(p)) return;
      capture(e);
      grabRef.current = { x: pos.x - p.x, y: pos.y - p.y };
      draggingRef.current = true;
      setDragging(true);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = toCanvas(e);

    if (mode === 'calibrate') {
      if (draggingRef.current) setRuler((r) => ({ ...r, b: p }));
      return;
    }

    if (mode === 'place') {
      if (draggingRef.current && grabRef.current) {
        setPos(clamp({ x: p.x + grabRef.current.x, y: p.y + grabRef.current.y }));
      } else {
        setOverCourt(hitCourt(p));
      }
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    grabRef.current = null;
    setDragging(false);
  }

  // ── Image loading ─────────────────────────────────────────────────────────
  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      const h = Math.round((CANVAS_W * img.naturalHeight) / img.naturalWidth);
      setCanvasH(h);
      setPos({ x: CANVAS_W / 2, y: h / 2 });
      setMode('calibrate');
      setRuler({ a: null, b: null });
      setPxPerFt(null);
      setError(null);
    };
    img.onerror = () => setError('That image could not be read. Try a JPG or PNG.');
    img.src = src;
  }, []);

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) return setError('Please choose an image file.');
    const rd = new FileReader();
    rd.onload = () => loadImage(String(rd.result));
    rd.readAsDataURL(f);
  }

  function applyCalibration() {
    if (!ruler.a || !ruler.b) return;
    const dx = ruler.b.x - ruler.a.x;
    const dy = ruler.b.y - ruler.a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 20 || knownFt <= 0) return setError('Draw a longer reference line, then set its length.');
    setPxPerFt(dist / knownFt);
    setMode('place');
    setError(null);
  }

  const fitsOnScreen = (() => {
    if (!pxPerFt) return null;
    const w = pad.lengthFt * pxPerFt;
    const h = pad.widthFt * pxPerFt;
    return w < CANVAS_W * 1.02 && h < canvasH * 1.02;
  })();

  function exportImage() {
    const cv = canvasRef.current;
    if (!cv) return;
    const url = cv.toDataURL('image/jpeg', 0.92);
    onExport?.(url);
  }

  return (
    <div>

      {/* Step rail */}
      <ol className="mb-4 flex flex-wrap items-center gap-2 text-[13px] font-bold">
        {(['upload', 'calibrate', 'place'] as Mode[]).map((m, i) => (
          <li
            key={m}
            className={cn(
              'flex items-center gap-2 rounded-full px-3.5 py-1.5',
              mode === m ? 'bg-brand-600 text-white' : 'bg-cream text-muted-faint',
            )}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-[11px]">{i + 1}</span>
            {m === 'upload' ? 'Aerial photo' : m === 'calibrate' ? 'Set the scale' : 'Position the court'}
          </li>
        ))}
      </ol>

      <div className="relative overflow-hidden rounded-xl border border-muted-line bg-slate-900 shadow-lift">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={canvasH}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="block h-auto w-full touch-none"
          style={{
            cursor:
              mode === 'calibrate'
                ? 'crosshair'
                : mode === 'place'
                  ? dragging
                    ? 'grabbing'
                    : overCourt
                      ? 'grab'
                      : 'default'
                  : 'default',
          }}
        />

        {mode === 'upload' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="font-display text-[22px] font-bold text-white">Start with a bird&rsquo;s-eye photo</div>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-[#9fb0bf]">
              A drone shot works best. A screenshot of your property from Google Maps satellite view
              works just as well — zoom in until the yard fills the screen.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <FilePicker
                onFiles={(files) => handleFile(files[0]!)}
                className="cursor-pointer rounded-full bg-brand-600 px-6 py-3 text-[14px] font-bold text-white hover:bg-brand-700"
              >
                Upload aerial photo
              </FilePicker>
              <button
                onClick={() => loadImage('/samples/yard-aerial.jpg')}
                className="rounded-full border border-white/25 px-6 py-3 text-[14px] font-bold text-white/90 hover:bg-white/10"
              >
                Try a sample yard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {mode === 'calibrate' && (
        <div className="mt-4 rounded-xl border border-muted-line bg-cream p-4">
          <div className="font-display text-[15px] font-extrabold uppercase tracking-wide text-accent">
            Set the scale
          </div>
          <p className="mt-1.5 max-w-[640px] text-[14px] leading-relaxed text-muted">
            Drag a line across something you know the length of — a fence run, the back of the house,
            a driveway. Then type that length. Everything after this is measured in real feet.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[14px] font-bold">
              That line is
              <input
                type="number"
                min={1}
                value={knownFt}
                onChange={(e) => setKnownFt(Number(e.target.value))}
                className="h-10 w-24 rounded-md border border-muted-input px-3 text-center"
              />
              feet
            </label>
            <button
              onClick={applyCalibration}
              disabled={!ruler.a || !ruler.b}
              className="rounded-md bg-brand-600 px-5 py-2.5 text-[14px] font-bold text-white disabled:opacity-40"
            >
              Use this scale →
            </button>
            <button onClick={() => setRuler({ a: null, b: null })} className="text-[13px] font-bold text-muted-faint hover:text-ink">
              Redraw line
            </button>
          </div>
        </div>
      )}

      {mode === 'place' && pxPerFt && (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <div className="font-display text-[15px] font-extrabold uppercase tracking-wide text-accent">Pad size</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PAD_ORDER.filter((p) => p !== 'tennis' && p !== 'full-court').map((p) => (
                <button
                  key={p}
                  onClick={() => onDesignChange?.({ ...design, pad: p })}
                  aria-pressed={design.pad === p}
                  className={cn(
                    'rounded-md border-[1.5px] px-3.5 py-2 text-[13px] font-bold transition',
                    design.pad === p
                      ? 'border-brand-600 bg-brand-50 text-brand-600'
                      : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
                  )}
                >
                  {PADS[p].label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-muted-faint">{pad.note}</p>
          </div>

          <div>
            <div className="font-display text-[15px] font-extrabold uppercase tracking-wide text-accent">Rotate</div>
            <input
              type="range"
              min={-90}
              max={90}
              value={rot}
              onChange={(e) => setRot(Number(e.target.value))}
              className="mt-3 w-full accent-brand-600"
              aria-label="Rotate the court"
            />
            <div className="mt-1 flex items-center justify-between text-[12.5px] text-muted-faint">
              <span>{rot}°</span>
              <button onClick={() => setRot(0)} className="font-bold hover:text-ink">Reset</button>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 border-t border-muted-line pt-4">
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-[12.5px] font-bold',
                fitsOnScreen ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800',
              )}
            >
              {fitsOnScreen
                ? `✓ A ${pad.widthFt}′ × ${pad.lengthFt}′ pad fits in this view`
                : `⚠ This pad is larger than the visible area — zoom out and re-upload`}
            </span>
            <button onClick={exportImage} className="rounded-md bg-brand-600 px-5 py-2.5 text-[14px] font-bold text-white hover:bg-brand-700">
              Send this plan to GRIT →
            </button>
            <button onClick={() => setMode('calibrate')} className="text-[13px] font-bold text-muted-faint hover:text-ink">
              Re-set the scale
            </button>
            <button onClick={() => { imgRef.current = null; setMode('upload'); }} className="text-[13px] font-bold text-muted-faint hover:text-ink">
              New photo
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
