import { Container, Section } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Section className="bg-white">
      <Container className="max-w-xl text-center">
        <p className="text-6xl font-extrabold text-brand-200">404</p>
        <h1 className="mt-4 text-3xl">This court doesn’t exist (yet).</h1>
        <p className="mt-3 text-fg-muted">
          The page you’re looking for moved or never got built. Let’s get you back in bounds.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">Back home</ButtonLink>
          <ButtonLink href="/service-area" variant="secondary" size="lg">Browse service areas</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
