'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/logo';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Primary navigation.
 *
 * The old nav carried nine flat top-level items. Nine items only fit above
 * 1280px, so everything — including the "Get a Quote" button — collapsed into a
 * hamburger on any 1152px laptop, which is a very large share of desktop
 * traffic. Hiding the primary CTA from that many visitors is a conversion bug,
 * not a styling preference.
 *
 * Five grouped items fit comfortably at 1024px, so the CTA now survives down to
 * tablet width, and the revenue lines that were previously buried in a
 * mobile-only list (epoxy, sports lines, golf simulators) are reachable on
 * desktop for the first time.
 */

interface NavChild {
  href: string;
  label: string;
  desc?: string;
}
interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
  /** Highlighted because it's the thing no competitor has. */
  feature?: boolean;
}

const NAV: NavItem[] = [
  {
    label: 'Courts',
    children: [
      { href: '/services', label: 'All Services', desc: 'Everything we build' },
      { href: '/court-surfacing', label: 'Court Surfacing', desc: 'Resurface a tired court' },
      { href: '/sports-lines', label: 'Sports Line Painting', desc: 'Lines on existing concrete' },
      { href: '/golf-simulators', label: 'Golf Simulators', desc: 'What a bay really costs' },
    ],
  },
  {
    label: 'Coatings',
    children: [
      { href: '/coatings', label: 'Concrete Coatings', desc: 'Garages, patios, shops' },
      { href: '/epoxy', label: 'Epoxy Flooring', desc: 'Flake and polyaspartic' },
    ],
  },
  { label: 'Our Work', href: '/gallery' },
  {
    label: 'Design Your Court',
    feature: true,
    children: [
      { href: '/design', label: '3D Court Designer', desc: 'Pick your colours and layout' },
      { href: '/planner', label: 'Will It Fit?', desc: 'Drop a real court on your yard' },
      { href: '/preview', label: 'See It In Your Yard', desc: 'AI preview from your photo' },
    ],
  },
  {
    label: 'Company',
    children: [
      { href: '/about', label: 'About GRIT', desc: 'Who does the work' },
      { href: '/faqs', label: 'FAQs', desc: 'Cost, size, timeline' },
      { href: '/trade-partners', label: 'Trade Partners', desc: 'Builders and landscapers' },
      { href: '/referrals', label: 'Referrals', desc: 'Send someone our way' },
      { href: '/warranty', label: 'Warranty', desc: 'What we stand behind' },
    ],
  },
];

function isActive(item: NavItem, path: string): boolean {
  if (item.href) return item.href === '/' ? path === '/' : path.startsWith(item.href);
  return (item.children ?? []).some((c) => path.startsWith(c.href));
}

export function Header() {
  const pathname = usePathname() ?? '/';
  const { open } = useEstimate();
  const [menu, setMenu] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close any dropdown on route change, outside click, or Escape.
  useEffect(() => {
    setOpenIdx(null);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (openIdx === null) return;
    function onDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenIdx(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIdx(null);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openIdx]);

  return (
    <header className="sticky top-0 z-[60] border-b border-muted-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-content items-center justify-between gap-4 px-5 sm:px-7">
        <Link href="/" aria-label="GRIT Courts home" className="flex-none" onClick={() => setMenu(false)}>
          <Logo />
        </Link>

        {/* Desktop nav — fits from 1024px so the CTA never disappears */}
        <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.map((item, i) => {
            const active = isActive(item, pathname);
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    'whitespace-nowrap rounded-md px-2.5 py-2 text-[13.5px] transition',
                    active ? 'font-bold text-brand-600' : 'font-semibold text-[#46525d] hover:text-brand-600',
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = openIdx === i;
            return (
              <div key={item.label} className="relative">
                <button
                  // Click-only. Hover-to-open fought the click handler (mouseenter
                  // opened the menu, then the click read it as open and closed it
                  // again) and hover menus are hostile on touch and hybrid devices.
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={cn(
                    'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[13.5px] transition',
                    active || isOpen
                      ? 'font-bold text-brand-600'
                      : 'font-semibold text-[#46525d] hover:text-brand-600',
                    item.feature && !active && 'text-brand-600',
                  )}
                >
                  {item.label}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    className="absolute left-0 top-[calc(100%+6px)] z-10 w-[268px] animate-fade-in-down rounded-xl border border-muted-line bg-white p-1.5 shadow-lift"
                  >
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3 py-2.5 transition hover:bg-cream"
                      >
                        <span className="block text-[13.5px] font-bold text-ink">{c.label}</span>
                        {c.desc && <span className="mt-0.5 block text-[12px] text-muted-faint">{c.desc}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA — visible from 1024px up, and always on mobile via the menu */}
        <div className="hidden flex-none items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="whitespace-nowrap text-[13.5px] font-semibold text-[#46525d] transition hover:text-brand-600"
          >
            Contact
          </Link>
          <button
            onClick={() => {
              track('cta_click', { location: 'header' });
              open({ source: 'header' });
            }}
            className="whitespace-nowrap rounded-[5px] bg-brand-600 px-[16px] py-2.5 text-[13.5px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-700 hover:shadow-md"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile: keep the CTA reachable without opening the menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => {
              track('cta_click', { location: 'header-compact' });
              open({ source: 'header-compact' });
            }}
            className="whitespace-nowrap rounded-[5px] bg-brand-600 px-3.5 py-2.5 text-[13px] font-bold text-white sm:px-4"
          >
            Get a Quote
          </button>
          <button
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-muted-line"
            aria-expanded={menu}
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menu ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <div className="max-h-[calc(100vh-74px)] overflow-y-auto border-t border-muted-line lg:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-0.5 px-5 py-4">
            {NAV.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMenu(false)}
                    className="block rounded-lg px-3 py-2.5 text-[15px] font-bold text-ink hover:bg-cream"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <p className="px-3 pb-1 pt-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-muted-faint">
                      {item.label}
                    </p>
                    {item.children!.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setMenu(false)}
                        className="block rounded-lg px-3 py-2 text-[15px] font-semibold text-ink hover:bg-cream"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenu(false)}
              className="mt-3 rounded-lg px-3 py-2.5 text-[15px] font-bold text-ink hover:bg-cream"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
