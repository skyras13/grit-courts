import type { Metadata } from 'next';
import Image from 'next/image';
import { NavyLink, UnderlineLink, WhiteLink, OutlineLightLink } from '@/components/ui/buttons';

export const metadata: Metadata = {
  title: 'Court Surfacing & Resurfacing in Utah | GRIT Courts',
  description:
    'Pro-grade acrylic court surfacing and resurfacing built for Utah weather. Crack repair, leveling, cushioned color coats, and regulation lines for any sport.',
  alternates: { canonical: '/court-surfacing' },
};

const INCLUDES: string[] = [
  'Pressure-wash & full crack repair',
  'Patch & level low spots for true bounce',
  'Acrylic resurfacer + multiple color build coats',
  'Cushioned option for joint-friendly play',
  'Hand-taped regulation lines (any sport)',
  'UV-stable color that holds up to sun & snow',
];

function Check() {
  return (
    <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
      ✓
    </span>
  );
}

const GALLERY: { src: string; caption: string }[] = [
  { src: '/photos/svc-surfacing.jpg', caption: 'Fresh acrylic color coats going down' },
  { src: '/photos/lines-2.jpg', caption: 'Crisp, hand-taped regulation lines' },
  { src: '/photos/drone-1.jpg', caption: 'A finished multi-sport surface from above' },
];

export default function CourtSurfacingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="eyebrow mb-4">Court Surfacing</div>
            <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink text-[clamp(30px,4.4vw,52px)]">
              Pro-grade court surfacing &amp; resurfacing
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              Resurface a tired, cracked court or finish a brand-new one with a cushioned,
              tournament-grade acrylic system — built to play true through Utah&rsquo;s freeze-thaw.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <NavyLink href="/design">Design your surface</NavyLink>
              <UnderlineLink href="/preview">See it in your yard →</UnderlineLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lift">
            <Image
              src="/photos/svc-surfacing.jpg"
              alt="GRIT crew applying acrylic court surfacing"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
          <div className="eyebrow mb-4">The system</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            What a GRIT surface includes
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3.5">
                <Check />
                <span className="text-[16px] leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Resurface vs rebuild */}
      <section className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">Which do you need?</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            Resurface vs. rebuild
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Not sure where to start? It comes down to the slab underneath. We&rsquo;ll tell you
            straight on a free site visit.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-muted-line bg-paper p-7 shadow-card">
            <div className="text-accent text-[12px] font-bold uppercase tracking-[0.12em]">
              Sound existing slab
            </div>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Resurface
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              If your concrete or asphalt base is structurally solid, we clean it, repair cracks,
              level the low spots, and rebuild the full acrylic color system on top. It&rsquo;s the
              fastest, most cost-effective way to bring a worn court back to tournament condition.
            </p>
          </div>
          <div className="rounded-xl border border-muted-line bg-paper p-7 shadow-card">
            <div className="text-accent text-[12px] font-bold uppercase tracking-[0.12em]">
              New or failing base
            </div>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Rebuild
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              Starting from dirt — or working with a slab that&rsquo;s heaved, sinking, or badly
              cracked — calls for a proper engineered base: excavation, drainage, compacted
              sub-base, and post-tensioned or reinforced concrete poured to play true for decades.
            </p>
          </div>
        </div>
      </section>

      {/* Mini gallery */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
          <div className="eyebrow mb-4">Recent work</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            Surfaces we&rsquo;re proud of
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((g) => (
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

      {/* CTA band */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-[clamp(26px,3.4vw,40px)]">
            Make your court play like new.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WhiteLink href="/preview">See it in your yard</WhiteLink>
            <OutlineLightLink href="/design">Design your surface</OutlineLightLink>
          </div>
        </div>
      </section>
    </main>
  );
}
