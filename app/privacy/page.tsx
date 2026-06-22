import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/layout';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How GRIT Courts collects and uses the information you share, including photos and contact details.',
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <Section className="bg-white">
      <Container className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-fg-muted">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 leading-relaxed text-fg-muted">
          <section>
            <h2 className="text-xl text-ink">What we collect</h2>
            <p className="mt-2">
              When you use our estimator or AI Backyard Previewer, we collect the information you
              provide: your name, phone number, optional email and property address, your court
              preferences, and any photo you upload of your space.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink">Photos &amp; your privacy</h2>
            <p className="mt-2">
              Photos you upload are processed in your browser to remove location (EXIF/GPS)
              metadata before they ever leave your device. We use them only to generate your
              court preview and to help our designers quote your project. We never publish your
              photos without your explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink">Text messages (SMS)</h2>
            <p className="mt-2">
              If you check the SMS consent box, you agree to receive text messages from{' '}
              {COMPANY.name} about your project at the number you provide. Message and data rates
              may apply; message frequency varies. Reply STOP to opt out at any time, or HELP for
              help. Consent is not a condition of purchase. We record the date and time you
              consented.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink">How we use your information</h2>
            <p className="mt-2">
              To contact you about your project, prepare your estimate, and improve our services.
              We send aggregate, privacy-safe conversion signals to advertising platforms (e.g.
              Meta) to measure and improve our ads; personal identifiers are hashed before they
              leave our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink">Your choices</h2>
            <p className="mt-2">
              You can ask us to delete your information or photos at any time by emailing{' '}
              <a className="text-brand-700 underline" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
