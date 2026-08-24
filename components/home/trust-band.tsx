import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/reveal';
import { PROCESS } from '@/lib/samples';

/**
 * Trust section.
 *
 * The site previously asked for a five-figure commitment with nothing but
 * finished-court photos behind it. Every competitor shows finished courts;
 * almost none show the base prep, the pour, or the taping — which is the one
 * thing a homeowner can't judge from the driveway and the thing that actually
 * decides whether a court lasts.
 *
 * So this leads with process photography and concrete commitments rather than
 * adjectives. Nothing here is a claim we can't evidence: no star ratings, no
 * review counts, no memberships.
 */

const COMMITMENTS = [
  {
    title: 'One crew, start to finish',
    body: 'Excavation, base, concrete, surfacing and lines are all us. No subcontractor to chase when something needs fixing.',
  },
  {
    title: 'An engineered base, not just a slab',
    body: 'Post-tension or rebar-reinforced, drained and compacted. The base is what fails first on a cheap court, and it is the part you can never see.',
  },
  {
    title: 'A firm number after we walk it',
    body: 'We measure the grade and the access before quoting. No price guessed off a photo, and no change order for something we should have spotted.',
  },
  {
    title: 'Written warranty',
    body: 'What we stand behind is in plain language, in writing, before you sign anything.',
  },
];

const STAGES = [
  {
    src: PROCESS.pour,
    label: 'Stage 01',
    title: 'The pour',
    body: 'A dead-level, reinforced slab. Get this wrong and no surface on earth plays true.',
  },
  {
    src: PROCESS.surfacing,
    label: 'Stage 02',
    title: 'Acrylic build coats',
    body: 'Multiple colour coats over an acrylic resurfacer, built up for grip and UV stability.',
  },
  {
    src: PROCESS.lines,
    label: 'Stage 03',
    title: 'Hand-taped lines',
    body: 'Measured to regulation and taped by hand, because sprayed lines bleed and cost you the call.',
  },
];

export function TrustBand() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-7 sm:py-20">
        <Reveal>
          <div className="eyebrow mb-4">How we work</div>
          <h2 className="max-w-[19ch] font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
            The part of a court you never get to see.
          </h2>
          <p className="mt-3.5 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">
            Anyone can photograph a finished court. What decides whether yours is still level in
            fifteen years happens before the colour goes down.
          </p>
        </Reveal>

        {/* Process — the shots competitors don't publish */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STAGES.map((s, i) => (
            <Reveal key={s.title} as="article" delay={i * 80} className="overflow-hidden rounded-xl bg-paper shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/3]">
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[rgba(20,33,47,0.82)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur">
                  {s.label}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-[17px] font-extrabold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Commitments — specific, checkable, no adjectives */}
        <div className="mt-12 grid gap-x-10 gap-y-7 border-t border-muted-line pt-10 sm:grid-cols-2">
          {COMMITMENTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <h3 className="flex items-start gap-2.5 font-display text-[16.5px] font-extrabold text-ink">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-grit-500 text-[12px] font-bold text-white"
                >
                  ✓
                </span>
                {c.title}
              </h3>
              <p className="mt-1.5 pl-[32px] text-[14.5px] leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-9 text-[14.5px] text-muted">
            Read the{' '}
            <Link href="/warranty" className="border-b-[1.5px] border-brand-600 font-bold text-brand-600">
              warranty in full
            </Link>{' '}
            or the{' '}
            <Link href="/faqs" className="border-b-[1.5px] border-brand-600 font-bold text-brand-600">
              questions we get asked most
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
