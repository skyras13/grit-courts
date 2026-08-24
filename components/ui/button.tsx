import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'court';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ' +
  'focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-card',
  secondary: 'bg-white text-brand-700 border border-brand-200 hover:border-brand-400 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
  court: 'bg-brand-600 text-white hover:bg-brand-600 shadow-card',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base min-h-[3.25rem]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CommonProps & ComponentProps<'button'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {props.children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
