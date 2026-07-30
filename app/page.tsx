import Link from 'next/link';
import Image from 'next/image';
import { HomeHero } from '@/components/home/home-hero';
import { WhiteLink, OutlineLightLink, UnderlineLink } from '@/components/ui/buttons';
import { FEATURED_SERVICES, INDEX_SERVICES, WORK, PROCESS, PULL_QUOTE, PHOTOS } from '@/lib/content';
import { JsonLd, faqJsonLd } from '@/lib/seo';
import { PICKLE_SERVICE } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(PICKLE_SERVICE.faqs)} />
      <HomeHero />

      {/* Credibility strip */}
      <section className="bg-slate-900 text-[#cfd8e0]">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-[clamp(18px,4vw,52px)] gap-y-2 px-5 py-4 text-[13px] font-semibold sm:px-7">
          <span>Serving Utah · Salt Lake · Wasatch · Summit counties</span>
          <span className="opacity-40">/</span>
          <span>Licensed &amp; insured</span>
          <span className="opacity-40">/</span>
          <span>Indoor &amp; outdoor courts</span>
          <span className="opacity-40">/</span>
          <span>One crew, start to finish</span>
        </div>
      </section>

      {/* What we build */}
      <section id="build" className="mx-auto max-w-content scroll-mt-24 px-5 py-[clamp(56px,7vw,100px)] sm:px-7">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-[16ch] font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.02]">
            Full-service athletic court installers.
          </h2>
          <p className="max-w-[360px] text-[15.5px] leading-relaxed text-muted">
            From pouring your slab to surfacing, painting lines, and installing hoops, lights, and
            nets — we do it all. Post-tension or rebar-reinforced slabs and professional-grade
            materials, from one crew that’s transparent and quick to respond.
          </p>
        </div>

        <div className="mb-[18px] grid gap-6 md:grid-cols-3">
          {FEATURED_SERVICES.map((s) => (
            <Link key={s.name} href={s.href} className="group flex flex-col text-left">
              <div className="mb-4 overflow-hidden rounded-md bg-[#e8eef3]" style={{ aspectRatio: '4 / 3' }}>
                <Image src={s.img} alt={`${s.name} court`} width={520} height={390} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[22px] font-extrabold">{s.name}</span>
                <span className="whitespace-nowrap text-[13.5px] font-bold text-brand-600">{s.price}</span>
              </div>
              <p className="mt-2 text-[14.5px] leading-snug text-muted">{s.hook}</p>
            </Link>
          ))}
        </div>

        <div className="border-t border-muted-line">
          {INDEX_SERVICES.map((s) => (
            <Link key={s.name} href={s.href} className="grid grid-cols-[42px_1.1fr_auto] items-center gap-3 border-b border-muted-line px-3.5 py-[18px] transition hover:bg-cream sm:grid-cols-[42px_1.1fr_1.6fr_auto_auto] sm:gap-[18px]">
              <span className="text-[13px] font-bold text-[#b0b8c0]">{s.num}</span>
              <span className="font-display text-[18px] font-bold">{s.name}</span>
              <span className="hidden text-[14px] text-muted sm:block">{s.hook}</span>
              <span className="whitespace-nowrap text-[13.5px] font-bold text-brand-600">{s.price}</span>
              <span className="font-display text-[15px] font-bold text-[#b0b8c0]">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature previewer */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-content items-center gap-8 px-5 py-[clamp(56px,7vw,100px)] sm:px-7 lg:grid-cols-[1fr_1.12fr] lg:gap-[60px]">
          <div>
            <div className="eyebrow mb-5 text-sky-accent">See it first</div>
            <h2 className="font-display text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.04] text-white">Your actual backyard. With a court in it.</h2>
            <p className="mt-5 max-w-[430px] text-[16.5px] leading-relaxed text-[#b9c4cf]">
              Upload a photo of your space and our previewer drops a finished court right where it would go — your size, your colors. The single best way to know before you spend a dollar.
            </p>
            <div className="mt-7"><WhiteLink href="/preview">Upload a photo →</WhiteLink></div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {[{ label: 'Before', img: PHOTOS.prevBefore, ring: 'border-white/10' }, { label: 'After', img: PHOTOS.prevAfter, ring: 'border-sky-accent/40' }].map((c) => (
              <div key={c.label}>
                <div className={`mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] ${c.label === 'After' ? 'text-sky-accent' : 'text-[#8b97a3]'}`}>{c.label}</div>
                <div className={`overflow-hidden rounded-md border bg-[#0e1a27] ${c.ring}`} style={{ aspectRatio: '4 / 5' }}>
                  <Image src={c.img} alt={`${c.label} — backyard court`} width={400} height={500} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work */}
      <section className="mx-auto max-w-content px-5 py-[clamp(56px,7vw,100px)] sm:px-7">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.02]">Recent work</h2>
          <UnderlineLink href="/gallery">Full gallery →</UnderlineLink>
        </div>
        <div className="grid gap-[18px] sm:grid-cols-2 md:grid-cols-3">
          {WORK.map((w) => (
            <div key={w.title}>
              <div className="overflow-hidden rounded-md bg-[#e8eef3]" style={{ aspectRatio: '1 / 1' }}>
                <Image src={w.img} alt={`${w.title} — ${w.city}`} width={420} height={420} className="h-full w-full object-cover" />
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2.5">
                <span className="text-[13.5px] font-bold text-ink">{w.title}</span>
                <span className="text-[12.5px] text-muted-faint">{w.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[900px] px-5 py-[clamp(56px,7vw,96px)] text-center sm:px-7">
          <div className="mb-6 text-[18px] tracking-[3px] text-gold">★★★★★</div>
          <p className="font-serif text-[clamp(22px,3.2vw,36px)] font-normal italic leading-[1.3] text-ink">“{PULL_QUOTE.quote}”</p>
          <div className="mt-6 text-[14.5px] font-bold text-ink">
            {PULL_QUOTE.name} <span className="font-semibold text-muted-faint">— {PULL_QUOTE.detail}</span>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-content px-5 py-[clamp(56px,7vw,100px)] sm:px-7">
        <h2 className="mb-11 max-w-[18ch] font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.02]">How a GRIT build comes together.</h2>
        <div className="grid gap-px overflow-hidden rounded-lg border border-muted-line bg-muted-line sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.n} className="flex min-h-[200px] flex-col bg-white px-6 py-7">
              <div className="mb-[18px] font-display text-[15px] font-extrabold text-brand-600">{p.n}</div>
              <div className="mb-2.5 font-display text-[19px] font-bold">{p.title}</div>
              <p className="text-[14px] leading-snug text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-[clamp(56px,8vw,108px)] text-center sm:px-7">
          <h2 className="font-display text-[clamp(30px,5vw,58px)] font-extrabold leading-[1.0] text-white">Let’s see it in your yard.</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-snug text-[#d2e0ee]">
            Start with a photo or a 3D design and get a real estimate in minutes — no salesperson, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <WhiteLink href="/preview">See it in your yard</WhiteLink>
            <OutlineLightLink href="/design">Design in 3D</OutlineLightLink>
          </div>
        </div>
      </section>
    </>
  );
}
