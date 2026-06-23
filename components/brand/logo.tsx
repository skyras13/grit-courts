import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * The real GRIT Courts badge logo (downloaded from builtwithgrit.com) — a
 * circular emblem with the Wasatch mountains, a green court, and the wordmark.
 * Used in the header on the light background.
 */
export function Logo({ className, height = 46 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/brand/grit-logo.png"
      alt="GRIT Courts"
      height={height}
      width={Math.round(height * 0.93)}
      priority
      className={cn('block w-auto', className)}
      style={{ height }}
    />
  );
}

/** Text wordmark for dark backgrounds (footer) where the dark badge would vanish. */
export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('inline-flex items-baseline gap-1.5 font-display leading-none', className)} aria-label="GRIT Courts">
      <span className={cn('text-lg font-extrabold tracking-tight', inverted ? 'text-white' : 'text-ink')}>GRIT</span>
      <span className={cn('text-lg font-bold tracking-tight', inverted ? 'text-sky-accent' : 'text-brand-600')}>Courts</span>
    </span>
  );
}
