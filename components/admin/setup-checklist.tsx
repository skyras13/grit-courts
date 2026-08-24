import type { SiteContent } from '@/lib/cms/types';
import type { SecretStatus } from '@/lib/cms/secrets';
import { VERIFIED } from '@/lib/verified';
import { cn } from '@/lib/utils';

/**
 * First-run checklist.
 *
 * A handed-over site usually dies because the owner doesn't know what's left to
 * do. This reads the actual content document and reports what's still missing in
 * their language, not ours — and it disappears once everything is done.
 *
 * Each item is derived from real state, so it can't drift out of date.
 */

interface Item {
  label: string;
  done: boolean;
  why: string;
  tab: string;
}

function buildItems(content: SiteContent, secrets: SecretStatus[]): Item[] {
  const has = (k: string) => secrets.find((s) => s.key === k)?.isSet ?? false;
  return [
    {
      label: 'Add your phone number',
      done: Boolean(content.business.phone.trim()),
      why: 'Right now the site shows no phone at all. Google needs one to rank you locally.',
      tab: 'Business info',
    },
    {
      label: 'Link your Google Business Profile',
      done: Boolean(content.social.googleBusiness.trim()),
      why: 'The map listing drives more calls for a local contractor than search results do.',
      tab: 'Business info',
    },
    {
      label: 'Upload at least 6 job photos',
      done: content.gallery.length >= 6,
      why: `You have ${content.gallery.length}. Tag each with a city and they fill your city pages too.`,
      tab: 'Photos',
    },
    {
      label: 'Turn on the AI backyard previewer',
      done: has('FAL_KEY') || has('REPLICATE_API_TOKEN'),
      why: 'Until a key is added it shows sample images instead of the customer’s real yard.',
      tab: 'Integrations',
    },
    {
      label: 'Get emailed when a lead comes in',
      done: has('RESEND_API_KEY'),
      why: 'Without this you have to remember to check the dashboard.',
      tab: 'Integrations',
    },
    {
      label: 'Confirm your starting prices',
      done: VERIFIED.prices,
      why: 'Prices are hidden until you confirm real numbers, so nothing invented is published.',
      tab: 'Services',
    },
    {
      label: 'Add real customer reviews',
      done: VERIFIED.testimonials,
      why: 'Review sections stay hidden until you supply genuine ones we can attribute.',
      tab: 'Business info',
    },
  ];
}

export function SetupChecklist({
  content,
  secrets,
}: {
  content: SiteContent;
  secrets: SecretStatus[];
}) {
  const items = buildItems(content, secrets);
  const remaining = items.filter((i) => !i.done);
  if (remaining.length === 0) return null;

  const done = items.length - remaining.length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <section className="mb-6 rounded-xl border border-muted-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-[17px] font-extrabold">Finish setting up your site</h2>
        <span className="text-[13px] font-semibold text-muted-faint">
          {done} of {items.length} done
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Setup progress"
        />
      </div>

      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 grid h-[20px] w-[20px] flex-none place-items-center rounded-full text-[11px] font-bold',
                i.done ? 'bg-emerald-100 text-emerald-700' : 'border-[1.5px] border-muted-input text-transparent',
              )}
            >
              ✓
            </span>
            <span className="min-w-0">
              <span className={cn('block text-[14px] font-bold', i.done ? 'text-muted-faint line-through' : 'text-ink')}>
                {i.label}
              </span>
              {!i.done && (
                <span className="block text-[12.5px] leading-relaxed text-muted">
                  {i.why} <span className="font-semibold text-brand-600">→ {i.tab}</span>
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
