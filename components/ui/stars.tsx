import { cn } from '@/lib/utils';

export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-brand-600', className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < value ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}
