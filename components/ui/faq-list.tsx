'use client';

import { useState } from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

/** Design-matched FAQ list: border-top rows, Archivo questions, navy +/− toggle. */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-muted-line">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-muted-line">
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-[18px] px-1 py-5 text-left"
              >
                <span className="font-display text-[17px] font-bold">{f.q}</span>
                <span className="w-6 flex-none text-center font-display text-[22px] font-bold text-brand-600">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            {isOpen && <p className="m-0 px-1 pb-[22px] pr-10 text-[15px] leading-relaxed text-[#4a5560]">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
