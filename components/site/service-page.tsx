import Image from 'next/image';
import { NavyLink, UnderlineLink, WhiteLink, OutlineLightLink } from '@/components/ui/buttons';
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { COMPANY } from '@/lib/site';

/**
 * Shared layout for a single service page.
 *
 * Every service page on the old Square site was hand-built, which is why four of
 * them ended up with no <title> and one inherited the name "About-1". Routing
 * them all through one template means a new service is a small data object, and
 * the SEO scaffolding (canonical, Service + Breadcrumb schema, one h1) can't be
 * forgotten.
 */

export interface ServicePageData {
  /** Small label above the h1. */
  eyebrow: string;
  h1: string;
  intro: string;
  hero: { src: string; alt: string };
  /** "What's included" checklist. */
  includes: string[];
  includesTitle?: string;
  /** Two explanatory cards — the "which do I need?" decision. */
  choices?: { label: string; title: string; body: string }[];
  /** Free-form prose section. */
  detail?: { title: string; paragraphs: string[] };
  /** Q&A rendered as real text so it's indexable. */
  gallery?: { src: string; caption: string }[];
  galleryTitle?: string;
  ctaTitle: string;
  path: string;
  breadcrumb: string;
}

function Check() {
  return (
    <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
      ✓
    </span>
  );
}

export function ServicePage({ data }: { data: ServicePageData }) {
  return (
    <main>
      <JsonLd data={serviceJsonLd(data.h1, COMPANY.regionName)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Our Services', path: '/services' },
          { name: data.breadcrumb, path: data.path },
        ])}
      />

      {/* Hero */}
      <section className="mx-auto max-w-content px-5 pb-14 pt-16 sm:px-7 sm:pb-16 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow mb-4">{data.eyebrow}</div>
            <h1 className="font-display text-[clamp(30px,4.4vw,52px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-ink">
              {data.h1}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{data.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <NavyLink href="/contact">Get a free estimate</NavyLink>
              <UnderlineLink href="/gallery">See our work →</UnderlineLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lift">
            <Image
              src={data.hero.src}
              alt={data.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Includes */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 py-16 sm:px-7 sm:py-20">
          <div className="eyebrow mb-4">What you get</div>
          <h2 className="font-display text-[clamp(26px,3.2vw,38px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
            {data.includesTitle ?? 'What the job includes'}
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {data.includes.map((item) => (
              <li key={item} className="flex items-start gap-3.5">
                <Check />
                <span className="text-[16px] leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Choices */}
      {data.choices && data.choices.length > 0 && (
        <section className="mx-auto max-w-content px-5 py-16 sm:px-7 sm:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {data.choices.map((c) => (
              <div key={c.title} className="rounded-xl border border-muted-line bg-paper p-7 shadow-card">
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">{c.label}</div>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detail prose */}
      {data.detail && (
        <section className="mx-auto max-w-content px-5 pb-16 sm:px-7 sm:pb-20">
          <div className="max-w-[68ch]">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              {data.detail.title}
            </h2>
            {data.detail.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 text-[16.5px] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-content px-5 py-16 sm:px-7 sm:py-20">
            <div className="eyebrow mb-4">Recent work</div>
            <h2 className="font-display text-[clamp(26px,3.2vw,38px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              {data.galleryTitle ?? 'Jobs we’re proud of'}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.gallery.map((g) => (
                <figure key={g.src} className="overflow-hidden rounded-xl bg-paper shadow-card">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={g.src}
                      alt={g.caption}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-4 py-3.5 text-[14px] text-muted">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-content px-5 py-16 text-center sm:px-7 sm:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {data.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WhiteLink href="/contact">Get a free estimate</WhiteLink>
            <OutlineLightLink href="/gallery">See our work</OutlineLightLink>
          </div>
        </div>
      </section>
    </main>
  );
}
