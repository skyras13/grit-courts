'use client';

import { useState, type FormEvent } from 'react';
import { getClientAttribution } from '@/lib/client-attribution';

interface ContactFormProps {
  source?: string;
  heading?: string;
  subheading?: string;
}

const INPUT_CLASS =
  'w-full rounded-md border-[1.5px] border-muted-input px-3.5 py-3 text-[14.5px] outline-none transition focus:border-brand-500';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactForm({ source, heading, subheading }: ContactFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          message: message.trim(),
          source: source ?? 'contact',
          smsConsent: false,
          ...getClientAttribution(),
        }),
      });
      const data: { ok?: boolean } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setDone(true);
      } else {
        setError('Something went wrong. Please try again or email us directly.');
      }
    } catch {
      setError('Network error. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-muted-line bg-cream p-7 shadow-card" role="status">
        <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Message sent
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Thanks — we&rsquo;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-muted-line bg-paper p-6 shadow-card sm:p-7">
      {heading && (
        <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          {heading}
        </h3>
      )}
      {subheading && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subheading}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-[13px] font-bold text-ink">
            Full name
          </label>
          <input
            id="cf-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-[13px] font-bold text-ink">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label htmlFor="cf-message" className="mb-1.5 block text-[13px] font-bold text-ink">
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${INPUT_CLASS} resize-y`}
            placeholder="Tell us about your space and what you'd like to play..."
          />
        </div>

        {error && (
          <p role="alert" className="text-[13.5px] font-semibold text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-[26px] py-4 text-[15.5px] font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send message'}
        </button>

        <p className="text-[12px] leading-relaxed text-muted">
          You may receive marketing and promotional materials. This form is protected by reCAPTCHA
          and the Google Privacy Policy and Terms of Service apply.
        </p>
      </form>
    </div>
  );
}
