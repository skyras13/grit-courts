'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CourtThumbnail } from '@/components/court/court-thumbnail';
import { designSummary, toLeadCourtType, type DesignConfig } from '@/lib/court-designer';
import { getClientAttribution } from '@/lib/client-attribution';
import { track } from '@/lib/analytics';

interface EstimateContextValue {
  /** Open the quote modal, optionally pre-filled with a court design + source. */
  open: (opts?: { design?: DesignConfig; source?: string; citySlug?: string }) => void;
}

const EstimateContext = createContext<EstimateContextValue | null>(null);

export function useEstimate(): EstimateContextValue {
  const ctx = useContext(EstimateContext);
  if (!ctx) throw new Error('useEstimate must be used within <EstimateProvider>');
  return ctx;
}

export function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [design, setDesign] = useState<DesignConfig | undefined>();
  const [source, setSource] = useState('quote-modal');
  const [citySlug, setCitySlug] = useState<string | undefined>();

  const open = useCallback<EstimateContextValue['open']>((opts) => {
    setDesign(opts?.design);
    setSource(opts?.source ?? 'quote-modal');
    setCitySlug(opts?.citySlug);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <EstimateContext.Provider value={value}>
      {children}
      {isOpen && <QuoteModal design={design} source={source} citySlug={citySlug} onClose={() => setOpen(false)} />}
    </EstimateContext.Provider>
  );
}

function QuoteModal({
  design,
  source,
  citySlug,
  onClose,
}: {
  design?: DesignConfig;
  source: string;
  citySlug?: string;
  onClose: () => void;
}) {
  const summary = design ? designSummary(design) : [];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [sms, setSms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length >= 2 && (phone.replace(/\D/g, '').length >= 10 || /\S+@\S+\.\S+/.test(email));

  async function submit() {
    if (!valid) {
      setError('Please add your name and a phone number or email.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const designMsg = design
        ? `Court design — ${summary.map((r) => `${r.k}: ${r.v}`).join('; ')}`
        : undefined;
      const payload = {
        fullName: name,
        phone: phone || undefined,
        email: email || undefined,
        propertyAddress: address || undefined,
        courtType: design ? toLeadCourtType(design.sport) : undefined,
        citySlug,
        smsConsent: sms,
        source,
        message: designMsg,
        ...getClientAttribution(),
      };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.');
      track('lead_submit', { source });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get your quote"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(12,22,34,0.55)] p-6 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-xl bg-white shadow-modal">
        {submitted ? (
          <div className="px-9 py-11 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl font-extrabold text-brand-600">✓</div>
            <h3 className="text-2xl font-extrabold">Your request is in.</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              Thanks, {name.split(' ')[0] || 'there'}. {design ? 'We’ve saved your court design and ' : ''}a GRIT
              estimator will reach out within one business day to talk through your project and a free on-site quote.
            </p>
            <button onClick={onClose} className="mt-7 rounded-md bg-brand-600 px-7 py-3.5 font-bold text-white transition hover:bg-brand-700">Done</button>
          </div>
        ) : (
          <div className="px-8 pb-9 pt-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted-faint">{design ? 'Your court design' : 'Free quote'}</div>
                <div className="font-display text-[26px] font-extrabold leading-tight text-ink">
                  {design ? 'Send it to GRIT' : 'Tell us about your project'}
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-cream text-lg text-muted">✕</button>
            </div>

            {design && (
              <div className="mb-5 flex gap-4 rounded-lg border border-muted-line bg-[#f6f8fa] p-3">
                <div className="w-28 flex-none overflow-hidden rounded-md"><CourtThumbnail config={design} /></div>
                <div className="min-w-0 flex-1">
                  {summary.map((row) => (
                    <div key={row.k} className="flex justify-between gap-3 py-0.5 text-[12.5px]">
                      <span className="text-muted-faint">{row.k}</span>
                      <span className="text-right font-bold text-ink">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" aria-label="Full name" className="col-span-2 rounded-md border-[1.5px] border-muted-input px-3.5 py-3 text-[14.5px] outline-none focus:border-brand-500" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="tel" autoComplete="tel" aria-label="Phone" className="rounded-md border-[1.5px] border-muted-input px-3.5 py-3 text-[14.5px] outline-none focus:border-brand-500" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" aria-label="Email" className="rounded-md border-[1.5px] border-muted-input px-3.5 py-3 text-[14.5px] outline-none focus:border-brand-500" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Project address (city is fine)" autoComplete="address-level2" aria-label="Project address" className="col-span-2 rounded-md border-[1.5px] border-muted-input px-3.5 py-3 text-[14.5px] outline-none focus:border-brand-500" />
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5">
              <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-0.5 h-4 w-4 flex-none accent-brand-600" />
              <span className="text-[12.5px] leading-relaxed text-muted-soft">Text me about my project. Message rates may apply — opt out anytime.</span>
            </label>

            {error && <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button onClick={submit} disabled={submitting} className="mt-5 w-full rounded-md bg-brand-600 py-4 font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
              {submitting ? 'Sending…' : 'Request my free quote'}
            </button>
            <p className="mt-3 text-center text-[11.5px] text-muted-faint">Free on-site quote — confirmed in person, no obligation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
