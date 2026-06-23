'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Accessible before/after image comparison slider.
 * - Drag anywhere (pointer) or use the focusable range input / arrow keys.
 * - The "before" layer fills the container and is revealed with `clip-path`, so
 *   no width math is needed and it renders correctly without JS measurement.
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  className,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // blob:/data: URLs (e.g. a client-uploaded photo) can't be optimized
  // server-side — serve them as-is.
  const ephemeral = (s: string) => s.startsWith('blob:') || s.startsWith('data:');

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl bg-brand-50 shadow-card',
        className,
      )}
      onPointerDown={(e) => setFromClientX(e.clientX)}
      onPointerMove={(e) => {
        if (e.buttons === 1) setFromClientX(e.clientX);
      }}
    >
      {/* After (full) */}
      <Image src={afterSrc} alt={afterAlt} fill sizes="(max-width:768px) 100vw, 640px" className="object-cover" priority unoptimized={ephemeral(afterSrc)} />
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-court-600/90 px-2.5 py-1 text-xs font-bold text-white">
        After
      </span>

      {/* Before (revealed via clip-path) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="(max-width:768px) 100vw, 640px" className="object-cover" unoptimized={ephemeral(beforeSrc)} />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-bold text-white">
          Before
        </span>
      </div>

      {/* Handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
        <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lift">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 7l-4 5 4 5M15 7l4 5-4 5" stroke="#27704a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <label className="sr-only" htmlFor="ba-range">
        Drag to compare before and after
      </label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-2 z-10 mx-auto h-8 w-[92%] cursor-ew-resize opacity-0"
        aria-label="Reveal amount"
      />
    </div>
  );
}
