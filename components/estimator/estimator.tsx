'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { estimatePrice } from '@/lib/pricing';
import { track } from '@/lib/analytics';
import { getClientAttribution } from '@/lib/client-attribution';
import { leadSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import type { CourtSize, CourtType, LandCondition } from '@/lib/types';

interface Option<T> {
  value: T;
  label: string;
  hint: string;
  icon: string;
}

const COURT_OPTIONS: Option<CourtType>[] = [
  { value: 'pickleball', label: 'Pickleball', hint: 'The backyard favorite', icon: '🥒' },
  { value: 'basketball', label: 'Basketball', hint: 'Half or full court', icon: '🏀' },
  { value: 'multi-sport', label: 'Multi-sport', hint: 'Pickleball + hoops', icon: '🎾' },
  { value: 'epoxy', label: 'Epoxy floor', hint: 'Garage / shop / patio', icon: '✨' },
];

const SIZE_OPTIONS: Option<CourtSize>[] = [
  { value: '30x60', label: '30 × 60 ft', hint: 'Standard backyard court', icon: '📐' },
  { value: '44x88', label: '44 × 88 ft', hint: 'Tournament / multi-use', icon: '📏' },
  { value: 'full-court', label: 'Full court', hint: 'Full basketball size', icon: '🏟️' },
  { value: 'unsure', label: 'Not sure yet', hint: 'We’ll help you size it', icon: '🤔' },
];

const LAND_OPTIONS: Option<LandCondition>[] = [
  { value: 'concrete', label: 'Existing concrete', hint: 'Sound slab ready to surface', icon: '🧱' },
  { value: 'grass-dirt', label: 'Grass or dirt', hint: 'Needs a new base', icon: '🌱' },
  { value: 'old-court', label: 'Old / cracked court', hint: 'Resurface or rebuild', icon: '🛠️' },
  { value: 'unsure', label: 'Not sure', hint: 'We’ll assess on-site', icon: '🤷' },
];

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ['Court type', 'Size', 'Your site', 'Your details'];

export function Estimator({ citySlug }: { citySlug?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [courtType, setCourtType] = useState<CourtType | null>(null);
  const [courtSize, setCourtSize] = useState<CourtSize | null>(null);
  const [landCondition, setLandCondition] = useState<LandCondition | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const estimate = useMemo(() => {
    if (courtType && courtSize && landCondition) {
      return estimatePrice({ courtType, courtSize, landCondition });
    }
    return null;
  }, [courtType, courtSize, landCondition]);

  function goTo(next: Step) {
    setStep(next);
    track('estimator_step', { step: next, label: STEP_LABELS[next] });
  }

  function pick<T>(setter: (v: T) => void, value: T, next: Step) {
    setter(value);
    if (step === 0) track('estimator_start', {});
    // Small delay so the selection is visible before advancing.
    window.setTimeout(() => goTo(next), 180);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const attribution = getClientAttribution();
    const payload = {
      courtType: courtType ?? undefined,
      courtSize: courtSize ?? undefined,
      landCondition: landCondition ?? undefined,
      fullName,
      phone,
      email: email || undefined,
      propertyAddress: address || undefined,
      citySlug,
      smsConsent,
      estimatedMin: estimate?.min,
      estimatedMax: estimate?.max,
      ...attribution,
      source: 'estimator',
    };

    const validated = leadSchema.safeParse(payload);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] ?? 'Invalid']),
        ),
      );
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
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Something went wrong.');
      }
      track('estimator_complete', { value: estimate?.min });
      track('lead_submit', { value: estimate?.min, source: 'estimator' });
      const q = new URLSearchParams();
      if (estimate) {
        q.set('min', String(estimate.min));
        q.set('max', String(estimate.max));
      }
      q.set('name', fullName);
      router.push(`/thank-you?${q.toString()}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-lift sm:p-8">
      {/* Progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs font-semibold text-fg-muted">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={cn(i <= step && 'text-brand-700')}>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full rounded-full bg-court-500 transition-all duration-300"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <Choices
          title="What do you want to build?"
          options={COURT_OPTIONS}
          selected={courtType}
          onPick={(v) => pick(setCourtType, v, 1)}
        />
      )}
      {step === 1 && (
        <Choices
          title="How big are you thinking?"
          options={courtType === 'epoxy' ? SIZE_OPTIONS.slice(3) : SIZE_OPTIONS}
          selected={courtSize}
          onPick={(v) => pick(setCourtSize, v, 2)}
          onBack={() => goTo(0)}
        />
      )}
      {step === 2 && (
        <Choices
          title="What’s the space like now?"
          options={LAND_OPTIONS}
          selected={landCondition}
          onPick={(v) => pick(setLandCondition, v, 3)}
          onBack={() => goTo(1)}
        />
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate>
          {estimate && (
            <div className="mb-6 rounded-xl bg-brand-50 p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-court-600">
                Your estimated range
              </p>
              <p className="mt-1 text-3xl font-extrabold text-brand-700">{estimate.label}</p>
              <ul className="mt-3 space-y-1 text-left text-sm text-fg-muted">
                {estimate.notes.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="text-xl">Where should we send it?</h2>
          <p className="mt-1 text-sm text-fg-muted">
            We’ll confirm your range and book a free on-site design consult.
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Full name" error={errors.fullName} htmlFor="fullName">
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className={inputCls(errors.fullName)}
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" error={errors.phone} htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className={inputCls(errors.phone)}
                  required
                />
              </Field>
              <Field label="Email (optional)" error={errors.email} htmlFor="email">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputCls(errors.email)}
                />
              </Field>
            </div>
            <Field label="Property address (optional)" error={errors.propertyAddress} htmlFor="address">
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                className={inputCls(errors.propertyAddress)}
              />
            </Field>

            <label className="flex items-start gap-3 rounded-lg bg-brand-50/60 p-3 text-sm text-fg-muted">
              <input
                type="checkbox"
                checked={smsConsent}
                onChange={(e) => setSmsConsent(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-brand-300 text-brand-600"
              />
              <span>
                Text me about my project. By checking this box I agree to receive SMS messages
                from GRIT Courts at the number provided. Msg &amp; data rates may apply; reply STOP
                to opt out. Consent is not a condition of purchase.
              </span>
            </label>
          </div>

          {serverError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <button type="button" onClick={() => goTo(2)} className="text-sm font-semibold text-fg-muted hover:text-ink">
              ← Back
            </button>
            <Button type="submit" size="lg" disabled={submitting} className="min-w-[12rem]">
              {submitting ? 'Sending…' : 'Get my estimate →'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Choices<T extends string>({
  title,
  options,
  selected,
  onPick,
  onBack,
}: {
  title: string;
  options: Option<T>[];
  selected: T | null;
  onPick: (v: T) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            aria-pressed={selected === o.value}
            className={cn(
              'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition',
              selected === o.value
                ? 'border-brand-600 bg-brand-50'
                : 'border-border hover:border-brand-300 hover:bg-brand-50/40',
            )}
          >
            <span className="text-2xl" aria-hidden="true">{o.icon}</span>
            <span>
              <span className="block font-bold text-ink">{o.label}</span>
              <span className="block text-sm text-fg-muted">{o.hint}</span>
            </span>
          </button>
        ))}
      </div>
      {onBack && (
        <button type="button" onClick={onBack} className="mt-5 text-sm font-semibold text-fg-muted hover:text-ink">
          ← Back
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(error?: string): string {
  return cn(
    'h-11 w-full rounded-lg border bg-white px-3.5 text-ink outline-none transition',
    'focus:border-brand-500 focus:ring-2 focus:ring-brand-200',
    error ? 'border-red-400' : 'border-border',
  );
}
