import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const NAVY = 'inline-flex items-center justify-center rounded-md bg-brand-600 px-[26px] py-4 text-[15.5px] font-bold text-white transition hover:bg-brand-700';
const WHITE = 'inline-flex items-center justify-center rounded-md bg-white px-7 py-4 text-[15.5px] font-bold text-ink transition hover:bg-cream';
const OUTLINE_LIGHT = 'inline-flex items-center justify-center rounded-md border-[1.5px] border-white/40 bg-white/10 px-[26px] py-4 text-[15.5px] font-bold text-white transition hover:bg-white/20';
const UNDERLINE = 'inline-flex items-center border-b-2 border-ink px-0.5 py-1 text-[15.5px] font-bold text-ink transition hover:border-brand-600 hover:text-brand-600';

export function NavyLink({ href, children, className, ...rest }: { href: string; children: ReactNode; className?: string } & Omit<ComponentProps<typeof Link>, 'href'>) {
  return <Link href={href} className={cn(NAVY, className)} {...rest}>{children}</Link>;
}
export function WhiteLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn(WHITE, className)}>{children}</Link>;
}
export function OutlineLightLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn(OUTLINE_LIGHT, className)}>{children}</Link>;
}
export function UnderlineLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn(UNDERLINE, className)}>{children}</Link>;
}

export const btn = { NAVY, WHITE, OUTLINE_LIGHT, UNDERLINE };
