import { cn } from '@/lib/utils';

/**
 * GRIT Courts wordmark + court mark. Generated SVG placeholder in the brand navy
 * (#2b598a) — swap for the owner's official logo by replacing this component or
 * dropping an SVG in /public and rendering it here. Uses `currentColor` for the
 * mark so it inverts cleanly on dark backgrounds.
 */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2.5 font-display font-extrabold', className)}
      aria-label="GRIT Courts"
    >
      <CourtMark className={cn('h-7 w-7 shrink-0', inverted ? 'text-white' : 'text-brand-600')} />
      <span className="flex items-baseline gap-1 leading-none">
        <span className={cn('text-xl tracking-tight', inverted ? 'text-white' : 'text-ink')}>
          GRIT
        </span>
        <span className={cn('text-xl font-semibold tracking-tight', inverted ? 'text-court-200' : 'text-court-600')}>
          Courts
        </span>
      </span>
    </span>
  );
}

export function CourtMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="9" fill="currentColor" />
      {/* court outline + center line + kitchen, drawn in white */}
      <rect x="11" y="9" width="26" height="30" rx="2.5" stroke="#fff" strokeWidth="2" />
      <line x1="11" y1="24" x2="37" y2="24" stroke="#fff" strokeWidth="2" />
      <line x1="11" y1="18" x2="37" y2="18" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
      <line x1="11" y1="30" x2="37" y2="30" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
      <line x1="24" y1="9" x2="24" y2="18" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
      <line x1="24" y1="30" x2="24" y2="39" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}
