import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Warranty Agreement | GRIT Courts',
  description:
    'GRIT Courts stands behind every project with premium materials, proven methods, and a clear, transparent warranty agreement. If something isn’t right, we make it right.',
  alternates: { canonical: '/warranty' },
  robots: { index: true, follow: true },
};

export default function WarrantyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pt-16 pb-12 sm:pt-20 sm:pb-14">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">Warranty Agreement</div>
          <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink text-[clamp(30px,4.4vw,52px)]">
            We stand behind our work
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-muted">
            Every project we build is done with premium materials, proven installation methods, and
            attention to detail we&rsquo;re proud of. If something isn&rsquo;t right due to our
            workmanship, we take responsibility and make it right.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream">
        <div className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
          <div className="max-w-3xl space-y-6 text-[17px] leading-relaxed text-ink">
            <p>
              Our warranty exists for one reason: to give you confidence. Confidence that
              you&rsquo;re not being left on your own after the project is complete. Confidence that
              we&rsquo;ll answer the phone. And confidence that we&rsquo;ll handle any legitimate
              warranty issues fairly and professionally.
            </p>
            <p>
              We believe trust is earned through transparency, which is why our full warranty
              agreement is clearly outlined for every project. No hidden language. No fine-print
              games.
            </p>
            <p>
              If you ever have a concern, reach out below. We&rsquo;ll walk you through the process
              and take care of you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="mx-auto max-w-content px-5 sm:px-7 py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <ContactForm
            source="warranty"
            heading="Have a warranty question?"
            subheading="Reach out and let us know how we can help — we'll walk you through it."
          />
        </div>
      </section>
    </main>
  );
}
