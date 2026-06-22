'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/brand/logo';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/layout';
import { COMPANY, NAV_LINKS } from '@/lib/site';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="GRIT Courts home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-fg-muted transition hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={COMPANY.phoneHref}
            className="text-sm font-bold text-brand-700"
            onClick={() => track('cta_click', { location: 'header_phone' })}
          >
            {COMPANY.phone}
          </a>
          <ButtonLink href="/estimate" size="sm" onClick={() => track('cta_click', { location: 'header' })}>
            Get an Estimate
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <div
        id="mobile-menu"
        className={cn('md:hidden', open ? 'block border-t border-border' : 'hidden')}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink hover:bg-brand-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <ButtonLink href="/estimate" size="lg" onClick={() => setOpen(false)}>
              Get an Estimate
            </ButtonLink>
            <a href={COMPANY.phoneHref} className="py-2 text-center font-bold text-brand-700">
              Call {COMPANY.phone}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
