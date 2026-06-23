import type { Metadata } from 'next';
import { NavyLink, WhiteLink } from '@/components/ui/buttons';

export const metadata: Metadata = {
  title: 'Trade Partners | Build with GRIT Courts',
  description:
    'GRIT Courts partners with home builders, GCs, landscapers, and designers across Utah to deliver the court scope — surfacing, lines, hoops, nets, and fencing — on schedule.',
  alternates: { canonical: '/trade-partners' },
};

const REASONS: { title: string; body: string }[] = [
  {
    title: 'One scope, handled',
    body: 'We own the court from base to final coat so you don’t have to juggle subs, materials, or surfacing know-how. One point of contact, one warranty.',
  },
  {
    title: 'On your timeline',
    body: 'We sequence our work around your build schedule, show up when we said we would, and keep you posted at every milestone so nothing surprises the GC.',
  },
  {
    title: 'A finish that sells',
    body: 'A premium GRIT court is a model-home showpiece — the kind of detail that closes buyers and earns referrals long after the keys are handed over.',
  },
];

const PARTNERS: string[] = [
  'Custom home builders',
  'General contractors',
  'Landscape contractors',
  'Pool builders',
  'Architects & designers',
  'HOAs & developers',
];

export default function TradePartnersPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">Trade Partners</div>
          <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink text-[clamp(30px,4.4vw,52px)]">
            Build with GRIT on your next project
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-muted">
            We partner with home builders, general contractors, landscapers, and designers across
            Utah to deliver the court scope — surfacing, lines, hoops, nets, fencing — done right and
            on schedule.
          </p>
          <div className="mt-8">
            <NavyLink href="/contact">Become a partner</NavyLink>
          </div>
        </div>
      </section>

      {/* Why builders choose GRIT */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
          <div className="eyebrow mb-4">The partnership</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            Why builders choose GRIT
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-muted-line bg-paper p-7 shadow-card"
              >
                <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">
                  {r.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">Our network</div>
          <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(26px,3.2vw,38px)]">
            Who we work with
          </h2>
        </div>
        <ul className="mt-8 flex flex-wrap gap-3">
          {PARTNERS.map((p) => (
            <li
              key={p}
              className="rounded-full border border-muted-line bg-cream px-5 py-2.5 text-[15px] font-semibold text-ink"
            >
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA band */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-[clamp(26px,3.4vw,40px)]">
            Let&rsquo;s talk about your project.
          </h2>
          <div className="mt-8 flex justify-center">
            <WhiteLink href="/contact">Get in touch</WhiteLink>
          </div>
        </div>
      </section>
    </main>
  );
}
