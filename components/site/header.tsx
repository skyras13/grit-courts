'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/brand/logo';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/services', label: 'Our Services', match: (p: string) => p.startsWith('/services') },
  { href: '/court-surfacing', label: 'Court Surfacing', match: (p: string) => p.startsWith('/court-surfacing') },
  { href: '/design', label: 'Court Designer', match: (p: string) => p.startsWith('/design') },
  { href: '/preview', label: 'See Your Yard', match: (p: string) => p.startsWith('/preview') },
  { href: '/gallery', label: 'Gallery', match: (p: string) => p.startsWith('/gallery') },
  { href: '/coatings', label: 'Coatings', match: (p: string) => p.startsWith('/coatings') },
];

// Secondary links surfaced in the mobile menu + footer for full parity.
const NAV_MORE = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/trade-partners', label: 'Trade Partners' },
  { href: '/warranty', label: 'Warranty Agreement' },
];

export function Header() {
  const pathname = usePathname() ?? '/';
  const { open } = useEstimate();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-[60] border-b border-muted-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-content items-center justify-between gap-6 px-5 sm:px-7">
        <Link href="/" aria-label="GRIT Courts home" className="flex-none" onClick={() => setMenu(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV.map((n) => {
            const active = n.match(pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'whitespace-nowrap rounded-md px-2.5 py-2 text-[13.5px] transition',
                  active ? 'font-bold text-brand-600' : 'font-semibold text-[#46525d] hover:text-brand-600',
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => { track('cta_click', { location: 'header' }); open({ source: 'header' }); }}
            className="whitespace-nowrap rounded-[5px] bg-brand-600 px-[18px] py-3 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Get a Quote Here!
          </button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-muted-line md:hidden"
          aria-expanded={menu}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menu
              ? <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {menu && (
        <div className="border-t border-muted-line md:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
            {[...NAV, ...NAV_MORE].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-cream">
                {n.label}
              </Link>
            ))}
            <button onClick={() => { setMenu(false); open({ source: 'header-mobile' }); }} className="mt-2 rounded-md bg-brand-600 px-5 py-3 font-bold text-white">
              Get a Quote Here!
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
