import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { NavyLink } from '@/components/ui/buttons';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact GRIT Courts | Free Court Estimate in Utah',
  description:
    'Tell us about your space and what you want to play. GRIT Courts is quick to respond and happy to give a free, no-pressure estimate across the Wasatch Front.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">Contact</div>
          <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink text-[clamp(30px,4.4vw,52px)]">
            Let&rsquo;s build your court.
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-muted">
            Tell us about your space and what you want to play. We&rsquo;re quick to respond and
            happy to give a free, no-pressure estimate.
          </p>
        </div>
      </section>

      {/* Two-column */}
      <section className="mx-auto max-w-content px-5 sm:px-7 pb-20 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <ContactForm
            source="contact"
            heading="Send us a message"
            subheading="We'll get back to you within one business day."
          />

          {/* Contact details card */}
          <aside className="rounded-xl border border-muted-line bg-cream p-7 shadow-card">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Reach us directly
            </h2>

            <div className="mt-7 space-y-7 text-[15px]">
              <div>
                <div className="text-accent text-[12px] font-bold uppercase tracking-[0.12em]">
                  Email
                </div>
                <div className="mt-2 space-y-1.5">
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="block font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {COMPANY.email}
                  </a>
                  <a
                    href={`mailto:${COMPANY.salesEmail}`}
                    className="block font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {COMPANY.salesEmail}
                  </a>
                </div>
              </div>

              <div>
                <div className="text-accent text-[12px] font-bold uppercase tracking-[0.12em]">
                  Service area
                </div>
                <p className="mt-2 leading-relaxed text-muted">
                  {COMPANY.areaServed.join(' · ')}
                </p>
              </div>

              <div>
                <div className="text-accent text-[12px] font-bold uppercase tracking-[0.12em]">
                  Follow along
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                  <a
                    href={COMPANY.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Facebook
                  </a>
                  <a
                    href={COMPANY.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-muted-line pt-7">
              <p className="mb-4 text-[15px] leading-relaxed text-muted">
                Prefer to design first?{' '}
              </p>
              <NavyLink href="/design">Open the Court Designer</NavyLink>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
