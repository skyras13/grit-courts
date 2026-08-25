'use client';

import { useCallback, useState } from 'react';
import { SECRET_LABELS, SECRET_KEYS, type SecretKey, type SiteContent } from '@/lib/cms/types';
import type { SecretStatus } from '@/lib/cms/secrets';
import { FilePicker } from '@/components/ui/file-picker';
import { cn } from '@/lib/utils';

type Tab = 'business' | 'home' | 'special' | 'pages' | 'services' | 'gallery' | 'faqs' | 'seo' | 'keys';

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: 'business', label: 'Business info', hint: 'Name, phone, email, service area' },
  { id: 'home', label: 'Home page', hint: 'Headline and intro copy' },
  { id: 'special', label: 'Specials', hint: 'Site-wide promo banner' },
  { id: 'pages', label: 'Pages', hint: 'Page copy and search titles' },
  { id: 'services', label: 'Services', hint: 'What you offer' },
  { id: 'gallery', label: 'Photos', hint: 'Upload and tag project photos' },
  { id: 'faqs', label: 'FAQs', hint: 'Questions customers ask' },
  { id: 'seo', label: 'SEO & cities', hint: 'Search settings, city pages' },
  { id: 'keys', label: 'Integrations', hint: 'API keys for AI and email' },
];

export function CmsEditor({
  initialContent,
  initialSecrets,
  demoMode,
}: {
  initialContent: SiteContent;
  initialSecrets: SecretStatus[];
  demoMode: boolean;
}) {
  const [tab, setTab] = useState<Tab>('business');
  const [c, setC] = useState<SiteContent>(initialContent);
  const [secrets, setSecrets] = useState<SecretStatus[]>(initialSecrets);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const update = useCallback((fn: (draft: SiteContent) => SiteContent) => {
    setC((prev) => fn(structuredClone(prev)));
    setDirty(true);
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Save failed.');
      setC(data.content);
      setDirty(false);
      setMsg({ kind: 'ok', text: 'Saved. Your site is updated.' });
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <nav className="lg:sticky lg:top-24 lg:self-start">
        <ul className="flex flex-wrap gap-1.5 lg:flex-col">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id}
                className={cn(
                  'w-full rounded-lg px-3.5 py-2.5 text-left transition',
                  tab === t.id ? 'bg-brand-600 text-white' : 'hover:bg-cream',
                )}
              >
                <span className="block text-[14px] font-bold">{t.label}</span>
                <span className={cn('block text-[11.5px]', tab === t.id ? 'text-white/75' : 'text-muted-faint')}>
                  {t.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {/* Save bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-muted-line bg-white p-3.5">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-md bg-brand-600 px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-brand-700 disabled:opacity-40"
          >
            {saving ? 'Saving…' : dirty ? 'Publish changes' : 'All changes saved'}
          </button>
          {msg && (
            <span
              role="status"
              className={cn(
                'rounded-md px-3 py-1.5 text-[13px] font-semibold',
                msg.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
              )}
            >
              {msg.text}
            </span>
          )}
          <span className="ml-auto text-[12px] text-muted-faint">
            Last published {new Date(c.updatedAt).toLocaleString()}
          </span>
        </div>

        {demoMode && (
          <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            <strong>Demo mode.</strong> Changes are live for this session but reset when the server
            restarts. Connecting a database makes everything here permanent.
          </p>
        )}

        <div className="rounded-xl border border-muted-line bg-white p-5">
          {tab === 'business' && <BusinessTab c={c} update={update} />}
          {tab === 'home' && <HomeTab c={c} update={update} />}
          {tab === 'special' && <SpecialTab c={c} update={update} />}
          {tab === 'pages' && <PagesTab c={c} update={update} />}
          {tab === 'services' && <ServicesTab c={c} update={update} />}
          {tab === 'gallery' && <GalleryTab c={c} setC={setC} />}
          {tab === 'faqs' && <FaqsTab c={c} update={update} />}
          {tab === 'seo' && <SeoTab c={c} update={update} />}
          {tab === 'keys' && <KeysTab secrets={secrets} setSecrets={setSecrets} c={c} update={update} />}
        </div>
      </div>
    </div>
  );
}

// ── shared field primitives ─────────────────────────────────────────────────
type Upd = (fn: (d: SiteContent) => SiteContent) => void;

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-bold text-ink">{label}</span>
      {help && <span className="mb-1.5 block text-[12px] text-muted-faint">{help}</span>}
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-md border border-muted-input px-3 py-2.5 text-[14px] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

function Text({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function Area({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className={inputCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 last:mb-0">
      <h2 className="mb-3.5 font-display text-[17px] font-extrabold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/** Live character counter — search engines truncate, so the owner should see it. */
function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={cn('mt-1 block text-[11.5px]', over ? 'text-red-600' : 'text-muted-faint')}>
      {value.length}/{max} characters {over && '— Google will cut this off'}
    </span>
  );
}

// ── tabs ────────────────────────────────────────────────────────────────────
function BusinessTab({ c, update }: { c: SiteContent; update: Upd }) {
  const b = c.business;
  const set = (k: keyof typeof b, v: string | number | string[]) =>
    update((d) => ({ ...d, business: { ...d.business, [k]: v } }));
  return (
    <>
      <Section title="Business details">
        <Field label="Business name"><Text value={b.name} onChange={(v) => set('name', v)} /></Field>
        <Field label="Tagline"><Text value={b.tagline} onChange={(v) => set('tagline', v)} /></Field>
        <Field label="Phone" help="Shown site-wide and used in your Google listing."><Text value={b.phone} onChange={(v) => set('phone', v)} placeholder="(801) 555-0142" /></Field>
        <Field label="Main email"><Text value={b.email} onChange={(v) => set('email', v)} /></Field>
        <Field label="Sales email"><Text value={b.salesEmail} onChange={(v) => set('salesEmail', v)} /></Field>
        <Field label="Hours"><Text value={b.hours} onChange={(v) => set('hours', v)} /></Field>
        <Field label="City"><Text value={b.city} onChange={(v) => set('city', v)} /></Field>
        <Field label="Courts built" help="Shown as social proof on the home page."><Text value={b.courtsBuilt} onChange={(v) => set('courtsBuilt', v)} /></Field>
      </Section>
      <Section title="Service area">
        <div className="sm:col-span-2">
          <Field label="Counties and regions you serve" help="One per line. These feed your local search results.">
            <Area rows={5} value={b.areaServed.join('\n')} onChange={(v) => set('areaServed', v.split('\n').filter(Boolean))} />
          </Field>
        </div>
      </Section>
      <Section title="Social profiles">
        {(['facebook', 'instagram', 'youtube', 'googleBusiness'] as const).map((k) => (
          <Field key={k} label={k === 'googleBusiness' ? 'Google Business Profile' : k.charAt(0).toUpperCase() + k.slice(1)}>
            <Text value={c.social[k]} onChange={(v) => update((d) => ({ ...d, social: { ...d.social, [k]: v } }))} />
          </Field>
        ))}
      </Section>
    </>
  );
}

function HomeTab({ c, update }: { c: SiteContent; update: Upd }) {
  const set = (k: keyof SiteContent['home'], v: string) =>
    update((d) => ({ ...d, home: { ...d.home, [k]: v } }));
  const h = c.home;
  return (
    <Section title="Home page copy">
      <Field label="Eyebrow" help="Small line above the headline."><Text value={h.heroEyebrow} onChange={(v) => set('heroEyebrow', v)} /></Field>
      <Field label="Headline"><Text value={h.heroTitle} onChange={(v) => set('heroTitle', v)} /></Field>
      <div className="sm:col-span-2">
        <Field label="Intro paragraph"><Area value={h.heroBody} onChange={(v) => set('heroBody', v)} /></Field>
      </div>
      <Field label="Main button"><Text value={h.heroCtaPrimary} onChange={(v) => set('heroCtaPrimary', v)} /></Field>
      <Field label="Second button"><Text value={h.heroCtaSecondary} onChange={(v) => set('heroCtaSecondary', v)} /></Field>
      <Field label="Section heading"><Text value={h.sectionTitle} onChange={(v) => set('sectionTitle', v)} /></Field>
      <div className="sm:col-span-2">
        <Field label="Section body"><Area value={h.sectionBody} onChange={(v) => set('sectionBody', v)} /></Field>
      </div>
    </Section>
  );
}

function SpecialTab({ c, update }: { c: SiteContent; update: Upd }) {
  const s = c.special;
  const set = (k: keyof typeof s, v: string | boolean | null) =>
    update((d) => ({ ...d, special: { ...d.special, [k]: v } }));
  return (
    <>
      <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
        Turn this on to run a banner across the top of every page. Set an end date and it takes
        itself down — no more expired promos sitting live for six months.
      </p>
      <Section title="Promo banner">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={s.enabled} onChange={(e) => set('enabled', e.target.checked)} className="h-4 w-4 accent-brand-600" />
            <span className="text-[14px] font-bold">Show the banner</span>
          </label>
        </div>
        <Field label="Headline"><Text value={s.headline} onChange={(v) => set('headline', v)} /></Field>
        <Field label="Button label"><Text value={s.ctaLabel} onChange={(v) => set('ctaLabel', v)} /></Field>
        <div className="sm:col-span-2">
          <Field label="Body"><Area rows={2} value={s.body} onChange={(v) => set('body', v)} /></Field>
        </div>
        <Field label="Button link"><Text value={s.ctaHref} onChange={(v) => set('ctaHref', v)} /></Field>
        <Field label="Hide after" help="Leave blank to run until you turn it off.">
          <input type="date" className={inputCls} value={s.expiresAt?.slice(0, 10) ?? ''} onChange={(e) => set('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : null)} />
        </Field>
      </Section>
    </>
  );
}

function PagesTab({ c, update }: { c: SiteContent; update: Upd }) {
  const [open, setOpen] = useState<string>(c.pages[0]?.slug ?? '');
  const setPage = (slug: string, k: string, v: string) =>
    update((d) => ({ ...d, pages: d.pages.map((p) => (p.slug === slug ? { ...p, [k]: v } : p)) }));
  return (
    <div className="space-y-2.5">
      <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
        The <strong>search title</strong> and <strong>search description</strong> are what people see
        on Google before they ever reach your site. They matter more than anything else on the page.
      </p>
      {c.pages.map((p) => (
        <div key={p.slug} className="rounded-lg border border-muted-line">
          <button
            onClick={() => setOpen(open === p.slug ? '' : p.slug)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-[14px] font-bold">{p.label}</span>
            <span className="font-mono text-[12px] text-muted-faint">/{p.slug}</span>
          </button>
          {open === p.slug && (
            <div className="grid gap-4 border-t border-muted-line p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Search title" help="Shows as the blue link on Google.">
                  <Text value={p.metaTitle} onChange={(v) => setPage(p.slug, 'metaTitle', v)} />
                </Field>
                <Counter value={p.metaTitle} max={60} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Search description">
                  <Area rows={2} value={p.metaDescription} onChange={(v) => setPage(p.slug, 'metaDescription', v)} />
                </Field>
                <Counter value={p.metaDescription} max={155} />
              </div>
              <Field label="Page heading"><Text value={p.heading} onChange={(v) => setPage(p.slug, 'heading', v)} /></Field>
              <Field label="Nav label"><Text value={p.label} onChange={(v) => setPage(p.slug, 'label', v)} /></Field>
              <div className="sm:col-span-2">
                <Field label="Intro"><Area rows={2} value={p.intro} onChange={(v) => setPage(p.slug, 'intro', v)} /></Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Body" help="Blank lines start a new paragraph.">
                  <Area rows={7} value={p.body} onChange={(v) => setPage(p.slug, 'body', v)} />
                </Field>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ServicesTab({ c, update }: { c: SiteContent; update: Upd }) {
  const set = (id: string, k: string, v: string | boolean) =>
    update((d) => ({ ...d, services: d.services.map((s) => (s.id === id ? { ...s, [k]: v } : s)) }));
  const remove = (id: string) => update((d) => ({ ...d, services: d.services.filter((s) => s.id !== id) }));
  const add = () =>
    update((d) => ({
      ...d,
      services: [...d.services, { id: crypto.randomUUID(), name: 'New service', hook: '', body: '', image: null, featured: false, order: d.services.length + 1 }],
    }));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13.5px] text-muted">Featured services appear on the home page.</p>
        <button onClick={add} className="rounded-md border-[1.5px] border-brand-300 px-3.5 py-2 text-[13px] font-bold text-brand-600 hover:bg-brand-50">+ Add service</button>
      </div>
      <div className="space-y-3">
        {[...c.services].sort((a, b) => a.order - b.order).map((s) => (
          <div key={s.id} className="grid gap-3 rounded-lg border border-muted-line p-4 sm:grid-cols-2">
            <Field label="Name"><Text value={s.name} onChange={(v) => set(s.id, 'name', v)} /></Field>
            <Field label="Photo path"><Text value={s.image ?? ''} onChange={(v) => set(s.id, 'image', v)} placeholder="/photos/court-05.jpg" /></Field>
            <div className="sm:col-span-2">
              <Field label="One-line hook"><Text value={s.hook} onChange={(v) => set(s.id, 'hook', v)} /></Field>
            </div>
            <div className="sm:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-[13px] font-bold">
                <input type="checkbox" checked={s.featured} onChange={(e) => set(s.id, 'featured', e.target.checked)} className="h-4 w-4 accent-brand-600" />
                Feature on home page
              </label>
              <button onClick={() => remove(s.id)} className="ml-auto text-[13px] font-bold text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ c, setC }: { c: SiteContent; setC: (s: SiteContent) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [meta, setMeta] = useState({ city: '', sport: 'pickleball', colors: '', alt: '' });

  async function upload(files: FileList) {
    setBusy(true);
    setErr(null);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', f);
        fd.append('city', meta.city);
        fd.append('sport', meta.sport);
        fd.append('colors', meta.colors);
        fd.append('alt', meta.alt || `${meta.sport} court in ${meta.city || 'Utah'}`);
        const res = await fetch('/api/admin/photos', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? 'Upload failed.');
        setC({ ...c, gallery: data.gallery });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.ok) setC({ ...c, gallery: data.gallery });
  }

  return (
    <div>
      <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
        Tag each photo with the city and sport. A photo tagged <em>Lehi</em> automatically shows up on
        your Lehi page — that&rsquo;s how new work turns into new search traffic without writing anything.
      </p>

      <div className="mb-5 grid gap-3 rounded-lg border border-muted-line bg-cream p-4 sm:grid-cols-4">
        <Field label="City"><Text value={meta.city} onChange={(v) => setMeta({ ...meta, city: v })} placeholder="Lehi" /></Field>
        <Field label="Sport">
          <select className={inputCls} value={meta.sport} onChange={(e) => setMeta({ ...meta, sport: e.target.value })}>
            {['pickleball', 'basketball', 'tennis', 'multi-sport', 'epoxy', 'other'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Colours"><Text value={meta.colors} onChange={(v) => setMeta({ ...meta, colors: v })} placeholder="Competition Blue / Green" /></Field>
        <div className="flex items-end">
          <FilePicker
            multiple
            disabled={busy}
            onFiles={(files) => upload(files)}
            className={cn(
              'block w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2.5 text-center text-[14px] font-bold text-white hover:bg-brand-700',
              busy && 'pointer-events-none opacity-40',
            )}
          >
            {busy ? 'Uploading…' : 'Upload photos'}
          </FilePicker>
        </div>
      </div>

      {err && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{err}</p>}

      {c.gallery.length === 0 ? (
        <p className="rounded-lg border border-dashed border-muted-line py-10 text-center text-[13.5px] text-muted-faint">
          No photos yet. Upload a few from your last job.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.gallery.map((g) => (
            <figure key={g.id} className="overflow-hidden rounded-lg border border-muted-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.alt} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="p-2">
                <div className="truncate text-[12px] font-bold">{g.city || 'Untagged'}</div>
                <div className="truncate text-[11px] text-muted-faint">{g.sport}</div>
                <button onClick={() => remove(g.id)} className="mt-1 text-[11px] font-bold text-red-600 hover:underline">Delete</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqsTab({ c, update }: { c: SiteContent; update: Upd }) {
  const set = (id: string, k: string, v: string) =>
    update((d) => ({ ...d, faqs: d.faqs.map((f) => (f.id === id ? { ...f, [k]: v } : f)) }));
  const add = () =>
    update((d) => ({ ...d, faqs: [...d.faqs, { id: crypto.randomUUID(), question: '', answer: '', group: 'court' as const }] }));
  const remove = (id: string) => update((d) => ({ ...d, faqs: d.faqs.filter((f) => f.id !== id) }));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[13.5px] leading-relaxed text-muted">
          These are published as structured data, so Google can show them directly in search results.
          Answer the questions you get on the phone.
        </p>
        <button onClick={add} className="shrink-0 rounded-md border-[1.5px] border-brand-300 px-3.5 py-2 text-[13px] font-bold text-brand-600 hover:bg-brand-50">+ Add</button>
      </div>
      <div className="space-y-3">
        {c.faqs.map((f) => (
          <div key={f.id} className="rounded-lg border border-muted-line p-4">
            <Field label="Question"><Text value={f.question} onChange={(v) => set(f.id, 'question', v)} /></Field>
            <div className="mt-3">
              <Field label="Answer"><Area rows={3} value={f.answer} onChange={(v) => set(f.id, 'answer', v)} /></Field>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <select className={cn(inputCls, 'w-auto')} value={f.group} onChange={(e) => set(f.id, 'group', e.target.value)}>
                <option value="court">Courts</option>
                <option value="coatings">Coatings</option>
                <option value="general">General</option>
              </select>
              <button onClick={() => remove(f.id)} className="ml-auto text-[13px] font-bold text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeoTab({ c, update }: { c: SiteContent; update: Upd }) {
  const set = (k: keyof SiteContent['seo'], v: string | string[]) =>
    update((d) => ({ ...d, seo: { ...d.seo, [k]: v } }));
  return (
    <>
      <Section title="Search defaults">
        <div className="sm:col-span-2">
          <Field label="Default site title"><Text value={c.seo.defaultTitle} onChange={(v) => set('defaultTitle', v)} /></Field>
          <Counter value={c.seo.defaultTitle} max={60} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Default description"><Area rows={2} value={c.seo.defaultDescription} onChange={(v) => set('defaultDescription', v)} /></Field>
          <Counter value={c.seo.defaultDescription} max={155} />
        </div>
        <Field label="Share image" help="Shown when your link is posted to Facebook."><Text value={c.seo.ogImage} onChange={(v) => set('ogImage', v)} /></Field>
      </Section>
      <Section title="City pages">
        <div className="sm:col-span-2">
          <Field
            label="Cities you want to rank in"
            help="One per line. Each one becomes its own page — that's how you show up for 'pickleball court builder Lehi'."
          >
            <Area rows={9} value={c.seo.cities.join('\n')} onChange={(v) => set('cities', v.split('\n').map((s) => s.trim()).filter(Boolean))} />
          </Field>
          <span className="mt-1 block text-[12px] font-semibold text-brand-600">
            {c.seo.cities.length} city pages will be generated
          </span>
        </div>
      </Section>
    </>
  );
}

function KeysTab({
  secrets,
  setSecrets,
  c,
  update,
}: {
  secrets: SecretStatus[];
  setSecrets: (s: SecretStatus[]) => void;
  c: SiteContent;
  update: Upd;
}) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(key: SecretKey, method: 'POST' | 'DELETE') {
    setBusy(key);
    setErr(null);
    try {
      const res = await fetch('/api/admin/secrets', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method === 'POST' ? { key, value: draft[key] ?? '' } : { key }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not save.');
      setSecrets(data.secrets);
      setDraft((d) => ({ ...d, [key]: '' }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
        Connect your own accounts. Keys are stored encrypted and are never shown again after you save
        them — you&rsquo;ll only ever see the last four characters.
      </p>
      {err && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{err}</p>}

      <div className="mb-7 space-y-3">
        {SECRET_KEYS.map((key) => {
          const s = secrets.find((x) => x.key === key);
          const info = SECRET_LABELS[key];
          return (
            <div key={key} className="rounded-lg border border-muted-line p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-bold">{info.label}</span>
                {s?.isSet ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-bold text-emerald-700">
                    Connected {s.hint}
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11.5px] font-bold text-slate-500">Not connected</span>
                )}
                {s?.managedByEnv && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11.5px] font-bold text-blue-700">Set by your developer</span>
                )}
              </div>
              <p className="mt-1.5 text-[12.5px] text-muted-faint">{info.help}</p>
              {!s?.managedByEnv && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="password"
                    className={cn(inputCls, 'max-w-sm flex-1')}
                    placeholder={s?.isSet ? 'Enter a new key to replace' : 'Paste your key'}
                    value={draft[key] ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  />
                  <button
                    onClick={() => submit(key, 'POST')}
                    disabled={busy === key || !(draft[key] ?? '').trim()}
                    className="rounded-md bg-brand-600 px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-40"
                  >
                    Save
                  </button>
                  {s?.isSet && (
                    <button onClick={() => submit(key, 'DELETE')} className="rounded-md px-3 py-2.5 text-[13px] font-bold text-red-600 hover:underline">
                      Disconnect
                    </button>
                  )}
                  <a href={info.url} target="_blank" rel="noopener noreferrer" className="self-center text-[12.5px] font-bold text-brand-600 hover:underline">
                    Where do I get this? ↗
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Section title="Settings">
        <Field label="AI image provider" help="Which service renders the backyard previews.">
          <select
            className={inputCls}
            value={c.integrations.renderProvider}
            onChange={(e) => update((d) => ({ ...d, integrations: { ...d.integrations, renderProvider: e.target.value as 'mock' | 'fal' | 'replicate' } }))}
          >
            <option value="mock">Demo (no key needed)</option>
            <option value="fal">fal.ai</option>
            <option value="replicate">Replicate</option>
          </select>
        </Field>
        <Field label="Send new leads to">
          <Text value={c.integrations.ownerNotifyEmail} onChange={(v) => update((d) => ({ ...d, integrations: { ...d.integrations, ownerNotifyEmail: v } }))} />
        </Field>
        <Field label="Google Analytics ID">
          <Text value={c.integrations.gaMeasurementId} onChange={(v) => update((d) => ({ ...d, integrations: { ...d.integrations, gaMeasurementId: v } }))} placeholder="G-XXXXXXX" />
        </Field>
        <Field label="Meta Pixel ID">
          <Text value={c.integrations.metaPixelId} onChange={(v) => update((d) => ({ ...d, integrations: { ...d.integrations, metaPixelId: v } }))} />
        </Field>
      </Section>
    </div>
  );
}
