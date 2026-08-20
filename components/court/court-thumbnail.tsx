'use client';

import { useEffect, useRef, useState } from 'react';
import { drawCourt, courtPixelSize } from '@/lib/court-canvas';
import { LOGO_SRC, type DesignConfig } from '@/lib/court-designer';
import { cn } from '@/lib/utils';

/** Flat 2D render of the current design (used as a reference chip / summary). */
export function CourtThumbnail({ config, className }: { config: DesignConfig; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (config.logo === 'none') { setLogo(null); return; }
    const src = config.logo === 'custom' ? config.customLogoUrl : LOGO_SRC[config.logo as keyof typeof LOGO_SRC];
    if (!src) { setLogo(null); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLogo(img);
    img.onerror = () => setLogo(null);
    img.src = src;
  }, [config.logo, config.customLogoUrl]);

  const { w, h } = courtPixelSize(config.pad);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawCourt(ctx, config, logo);
  }, [config, logo, w, h]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      className={cn('h-auto w-full rounded-lg', className)}
      aria-label={`${config.sport} court design`}
    />
  );
}
