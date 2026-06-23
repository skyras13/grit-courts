import Link from 'next/link';
import { Wordmark } from '@/components/brand/logo';
import { COMPANY } from '@/lib/site';

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Courts',
    links: [
      { label: 'Pickleball', href: '/services/pickleball' },
      { label: 'Basketball', href: '/design' },
      { label: 'Multi-sport', href: '/design' },
      { label: 'Resurfacing', href: '/#build' },
    ],
  },
  {
    title: 'Backyard',
    links: [
      { label: 'Pools', href: '/#build' },
      { label: 'Concrete', href: '/#build' },
      { label: 'Fencing', href: '/#build' },
      { label: 'Landscaping & turf', href: '/#build' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Gallery', href: '/gallery' },
      { label: 'Service area', href: '/service-area' },
      { label: 'About', href: '/about' },
      { label: 'Design in 3D', href: '/design' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 px-5 pb-9 pt-14 text-[#cfd8e0] sm:px-7">
      <div className="mx-auto grid max-w-content gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Wordmark inverted className="mb-4" />
          <p className="mb-4 max-w-[300px] text-[13.5px] leading-relaxed text-muted-faint">
            Utah’s custom court &amp; backyard builders. Provo and the Wasatch Front — designed,
            built, and warrantied by one crew.
          </p>
          <div className="text-[13.5px] text-[#aab4be]">
            <a href={COMPANY.phoneHref} className="hover:text-white">{COMPANY.phone}</a> ·{' '}
            <a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a>
          </div>
        </div>

        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6c7884]">{col.title}</div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="text-[13.5px] text-[#aab4be] transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-9 flex max-w-content flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-[12.5px] text-[#6c7884]">
        <span>© 2026 {COMPANY.legalName} · Home Builders Association member</span>
        <span>Prices shown are estimates, not quotes — confirmed on a free on-site visit.</span>
      </div>
    </footer>
  );
}
