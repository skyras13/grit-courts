'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { leadSchema } from '@/lib/schemas';
import { getClientAttribution } from '@/lib/client-attribution';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { CourtType } from '@/lib/types';

/**
 * Compact lead form used by the previewer and other CTAs. Posts to /api/leads
 * with any attached renderId/courtType/citySlug, then routes to /thank-you.
 */
export function QuickLeadForm({
  renderId,
  courtType,
  citySlug,
  source = 'site',
  heading = 'Get this court in your yard',
  subheading = 'Tell us where to send your design — free, no obligation.',
}: {
  renderId?: string;
  courtType?: CourtType;
  citySlug?: string;
  source?: string;
  heading?: string;
  subheading?: string;
}) {
  const router = useRouter();
  const [fullName, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const payload = {
      fullName,
      phone,
      email: email || undefined,
      renderId,
      courtType,
      citySlug,
      smsConsent,
      source,
      ...getClientAttribution(),
    };
    const validated = leadSchema.safeParse(payload);
    if (!validated.success) {
      const fe = validated.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? 'Invalid'])));
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated.data),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.');
      track('lead_submit', { source });
      const q = new URLSearchParams({ name: fullName });
      router.push(`/thank-you?${q.toString()}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl border border-border bg-white p-6 shadow-card">
      <h3 className="text-xl">{heading}</h3>
      <p className="mt-1 text-sm text-fg-muted">{subheading}</p>
      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="ql-name" className="mb-1 block text-sm font-semibold text-ink">Full name</label>
          <input id="ql-name" value={fullName} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls(errors.fullName)} required />
          {errors.fullName && <p role="alert" className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="ql-phone" className="mb-1 block text-sm font-semibold text-ink">Phone</label>
            <input id="ql-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputCls(errors.phone)} required />
            {errors.phone && <p role="alert" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="ql-email" className="mb-1 block text-sm font-semibold text-ink">Email (optional)</label>
            <input id="ql-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls(errors.email)} />
            {errors.email && <p role="alert" className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>
        <label className="flex items-start gap-2.5 text-xs text-fg-muted">
          <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-300 text-brand-600" />
          <span>Text me about my project. I agree to receive SMS from GRIT Courts; msg &amp; data rates may apply, reply STOP to opt out. Consent isn’t a condition of purchase.</span>
        </label>
      </div>
      {serverError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      <Button type="submit" size="lg" disabled={submitting} className="mt-4 w-full">
        {submitting ? 'Sending…' : 'Send me my design →'}
      </Button>
    </form>
  );
}

function inputCls(error?: string): string {
  return cn(
    'h-11 w-full rounded-lg border bg-white px-3.5 text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200',
    error ? 'border-red-400' : 'border-border',
  );
}
