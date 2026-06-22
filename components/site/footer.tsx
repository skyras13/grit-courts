import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { Container } from '@/components/ui/layout';
import { COMPANY, SERVICES } from '@/lib/site';
import { publishedCities } from '@/lib/cities-data';

export function Footer() {
  const cities = publishedCities();
  const year = 2026; // build-time constant; avoids hydration drift

  return (
    <footer className="court-gradient mt-8 text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-100">
            {COMPANY.tagline}. Designing and installing custom basketball, pickleball, and
            multi-sport courts across the Wasatch Front.
          </p>
          <p className="mt-4 text-sm text-brand-100">
            <a href={COMPANY.phoneHref} className="font-bold text-white hover:underline">
              {COMPANY.phone}
            </a>
            <br />
            {COMPANY.city}, {COMPANY.region}
          </p>
        </div>

        <nav aria-label="Services">
          <h3 className="text-sm font-bold uppercase tracking-wider text-court-200">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/#services`} className="text-brand-100 hover:text-white hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Service area">
          <h3 className="text-sm font-bold uppercase tracking-wider text-court-200">Service Area</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {cities.slice(0, 10).map((c) => (
              <li key={c.slug}>
                <Link href={`/utah/${c.slug}`} className="text-brand-100 hover:text-white hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="col-span-2 mt-1">
              <Link href="/service-area" className="font-semibold text-white hover:underline">
                All cities →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-bold uppercase tracking-wider text-court-200">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/estimate" className="text-brand-100 hover:text-white hover:underline">Get an Estimate</Link></li>
            <li><Link href="/preview" className="text-brand-100 hover:text-white hover:underline">AI Backyard Preview</Link></li>
            <li><Link href="/about" className="text-brand-100 hover:text-white hover:underline">About</Link></li>
            <li><Link href="/privacy" className="text-brand-100 hover:text-white hover:underline">Privacy Policy</Link></li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-100 sm:flex-row">
          <p>© {year} {COMPANY.legalName}. All rights reserved.</p>
          <p>Member, local Home Builders Association · {COMPANY.rating.value}★ on HomeAdvisor</p>
        </Container>
      </div>
    </footer>
  );
}
