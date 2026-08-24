import { createElement, type ElementType, type ReactNode } from 'react';
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
  return createElement(
    As,
    { id, className: cn('py-16 sm:py-20 lg:py-24', className) },
    children,
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-600">{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  centered = true,
  as = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  centered?: boolean;
  /**
   * Heading level. Defaults to h2 because this usually labels a section, but a
   * page whose main title is a SectionHeading must pass "h1" — every page needs
   * exactly one h1, and hardcoding h2 here silently left /about and
   * /service-area with none.
   */
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {createElement(as, { className: 'text-3xl sm:text-4xl' }, title)}
      {intro && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{intro}</p>}
    </div>
  );
}
