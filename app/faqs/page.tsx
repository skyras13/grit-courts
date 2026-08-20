import { readContent } from '@/lib/cms/read';
import { buildMetadata, faqJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { Container } from '@/components/ui/layout';
import { FaqAccordion } from '@/components/ui/faq-accordion';

export const metadata = buildMetadata({
  title: 'Court Building FAQs — Cost, Size, Timeline | GRIT Courts',
  description:
    'Straight answers on what a backyard court costs in Utah, what size pad you need, how long a build takes, and whether pickleball and basketball can share one surface.',
  path: '/faqs',
});

const GROUPS = [
  { key: 'court' as const, title: 'Building a court' },
  { key: 'coatings' as const, title: 'Coatings & surfacing' },
  { key: 'general' as const, title: 'General' },
];

/**
 * Owner-editable FAQs, published with FAQPage structured data so Google can
 * surface the answers directly in search results. Every question the owner adds
 * in the dashboard becomes eligible for a rich result — content the competition
 * has to pay a copywriter for.
 */
export default async function FaqsPage() {
  const content = await readContent();
  const faqs = content.faqs.filter((f) => f.question.trim() && f.answer.trim());

  return (
    <Container className="py-[clamp(28px,4vw,56px)]">
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ q: f.question, a: f.answer })))} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'FAQs', path: '/faqs' },
        ])}
      />

      <div className="mb-8 max-w-[680px]">
        <div className="eyebrow mb-4">Questions</div>
        <h1 className="font-display text-[clamp(30px,4.4vw,52px)] font-extrabold leading-none tracking-[-0.03em]">
          The questions we get asked most.
        </h1>
        <p className="mt-3.5 text-[16px] leading-relaxed text-[#4a5560]">
          If the answer you need isn&rsquo;t here, call us — we&rsquo;d rather talk it through than have you
          guess.
        </p>
      </div>

      <div className="max-w-[820px] space-y-10">
        {GROUPS.map((g) => {
          const items = faqs.filter((f) => f.group === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key}>
              <h2 className="mb-4 font-display text-[20px] font-extrabold">{g.title}</h2>
              <FaqAccordion faqs={items.map((f) => ({ q: f.question, a: f.answer }))} />
            </section>
          );
        })}
      </div>
    </Container>
  );
}
