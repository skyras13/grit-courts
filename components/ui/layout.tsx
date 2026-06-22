import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('mx-auto w-full max-w-content px-5 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function Section({
  className,
  children,
  as: As = 'section',
  id,
}: {
  className?: string;
  children: ReactNode;
  as?: ElementType;
  id?: string;
}) {
  return (
    <As id={id} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      {children}
    </As>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-court-600">{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  centered = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{intro}</p>}
    </div>
  );
}
