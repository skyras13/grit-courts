import type { Metadata } from 'next';
import { Container, Section, SectionHeading } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About GRIT Courts — Utah’s Custom Court Builders',
  description:
    'GRIT Courts designs and installs custom pickleball, basketball, and multi-sport courts across the Wasatch Front. Local, licensed, and obsessed with a court that plays true.',
};

export default function AboutPage() {
  return (
    <Section className="bg-white">
      <Container className="max-w-3xl">
        <SectionHeading
          as="h1"
          centered={false}
          eyebrow="About us"
          title="Built in Utah, for the way Utah plays."
        />
        <div className="prose mt-8 space-y-5 text-lg leading-relaxed text-fg-muted">
          <p>
            {COMPANY.name} started in {COMPANY.foundingYear} in {COMPANY.city} with a simple
            idea: a backyard court should be built like the home it sits behind — engineered,
            level, and made to last decades, not seasons.
          </p>
          <p>
            We handle the whole project with one crew: design, excavation, the engineered
            concrete base, the acrylic surfacing, the lines, and the net and hoop systems. That
            means one point of contact, one schedule, and one warranty — no subcontractor
            finger-pointing.
          </p>
          <p>
            We build across the Wasatch Front — {COMPANY.areaServed.join(', ')} — from the valley
            floor to the foothills and up to the mountain valleys where courts have to survive a
            real winter. We’re a member of the local Home Builders Association and proud of our{' '}
            {COMPANY.rating.value}★ reputation.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/preview" variant="court" size="lg">
            Preview your court
          </ButtonLink>
          <ButtonLink href="/estimate" variant="secondary" size="lg">
            Get an estimate
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
