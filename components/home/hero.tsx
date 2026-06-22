import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/layout';
import { BeforeAfter } from '@/components/ui/before-after';
import { Stars } from '@/components/ui/stars';
import { COMPANY } from '@/lib/site';
import { HERO_PAIR } from '@/lib/samples';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="court-gradient absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:42px_42px]" />
      <Container className="grid items-center gap-10 py-16 text-white sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-semibold backdrop-blur">
            <Stars value={5} className="text-court-200" />
            <span>{COMPANY.rating.value}★ · {COMPANY.rating.count}+ Utah courts built</span>
          </div>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            See your court <span className="text-court-200">before we pour.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
            Utah’s custom builders of backyard pickleball, basketball, and multi-sport courts.
            Upload a photo of your yard and watch our AI drop a finished court right into it —
            then get an honest price range in 60 seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/preview" variant="court" size="lg" className="font-bold">
              Preview my backyard →
            </ButtonLink>
            <ButtonLink
              href="/estimate"
              size="lg"
              className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Get an instant estimate
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-brand-100">
            Free design consult · No obligation · Serving the Wasatch Front
          </p>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <BeforeAfter
            beforeSrc={HERO_PAIR.before}
            afterSrc={HERO_PAIR.after}
            beforeAlt="A backyard before a court was built"
            afterAlt="The same backyard with a finished pickleball court"
          />
          <p className="mt-3 text-center text-sm text-brand-100">
            Drag the slider — real AI preview, {HERO_PAIR.city}, UT
          </p>
        </div>
      </Container>
    </section>
  );
}
