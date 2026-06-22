'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/site';
import { cn } from '@/lib/utils';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-white">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-semibold text-ink">{f.q}</span>
                <svg
                  className={cn('shrink-0 text-brand-600 transition-transform', isOpen && 'rotate-45')}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div className={cn('overflow-hidden px-5 text-fg-muted transition-all', isOpen ? 'max-h-96 pb-5' : 'max-h-0')}>
              <p className="leading-relaxed">{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
