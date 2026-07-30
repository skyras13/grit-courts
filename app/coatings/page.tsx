import type { Metadata } from 'next';
import Image from 'next/image';
import { NavyLink, UnderlineLink, WhiteLink, OutlineLightLink } from '@/components/ui/buttons';
import { SURFACE_COLORS } from '@/lib/court-designer';

export const metadata: Metadata = {
  title: 'Coatings Products | Pro Court & Epoxy Systems | GRIT Courts',
  description:
    'GRIT Courts installs and supplies professional-grade acrylic court coatings and flake-epoxy systems — UV-stable, cushioned, and built to last in Utah weather.',
  alternates: { canonical: '/coatings' },
};

const SYSTEMS: { title: string; body: string; src: string; alt: string }[] = [
  {
    title: 'Acrylic court surfacing',
    body: 'Multi-coat cushioned color systems engineered for courts — true bounce, joint-friendly feel, and UV-stable color that holds up to sun and snow.',
    src: '/photos/lines-2.jpg',
    alt: 'Acrylic court surface with crisp painted lines',
  },
  {
    title: 'Flake epoxy floors',
    body: 'Decorative flake-epoxy systems for garages, shops, and patios — hot-tire and chemical resistant, easy to clean, and finished with a tough clear topcoat.',
    src: '/photos/epoxy-1.jpg',
    alt: 'Flake epoxy garage floor',
  },
  {
    title: 'Line & logo coatings',
    body: 'Durable striping and color-matched logos applied by hand — regulation-accurate lines for any sport and custom center-court branding that lasts.',
    src: '/photos/garage-1.jpg',
    alt: 'Coated floor with custom finish',
  },
];

export default function CoatingsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow mb-4">Coatings Products</div>
            <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink text-[clamp(30px,4.4vw,52px)]">
              Pro coatings &amp; surfacing systems
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              We install — and can supply — the same professional-grade acrylic court coatings and
              flake-epoxy systems we trust on our own builds: UV-stable, cushioned, and made to last
              in Utah weather.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <NavyLink href="/contact">Ask about products</NavyLink>
              <UnderlineLink href="/services">See all services →</UnderlineLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lift">
            <Image
              src="/photos/coatings-cars.jpg"
              alt="High-gloss coated floor finish"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Systems we work with */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
          <div className="eyebrow mb-4">Product systems</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            Systems we work with
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SYSTEMS.map((s) => (
              <div
                key={s.title}
                className="overflow-hidden rounded-xl border border-muted-line bg-paper shadow-card"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acrylic color chart — the exact surface colors we offer */}
      <section className="mx-auto max-w-content px-5 py-16 sm:px-7 sm:py-20">
        <div className="eyebrow mb-4">Surface colors</div>
        <h2 className="max-w-2xl font-display text-[clamp(26px,3.2vw,38px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
          Our acrylic court color chart
        </h2>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-muted">
          Every court is finished in UV-stable acrylic color. Mix and match any of these on your
          border, court, and key — or preview them live in the 3D Court Designer.
        </p>
        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SURFACE_COLORS.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-lg border border-muted-line bg-paper shadow-card">
              <div className="h-20 w-full" style={{ background: c.hex }} />
              <div className="px-3 py-2.5">
                <div className="text-[13.5px] font-bold text-ink">{c.name}</div>
                <div className="text-[11.5px] uppercase tracking-wide text-muted-faint">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <NavyLink href="/design">Try colors in the 3D designer →</NavyLink>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-[clamp(26px,3.4vw,40px)]">
            Want the same finish on your project?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WhiteLink href="/contact">Ask about products</WhiteLink>
            <OutlineLightLink href="/design">Design your court</OutlineLightLink>
          </div>
        </div>
      </section>
    </main>
  );
}
