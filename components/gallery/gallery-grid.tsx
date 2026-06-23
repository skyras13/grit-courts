'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GALLERY, GALLERY_FILTERS } from '@/lib/content';
import { cn } from '@/lib/utils';

export function GalleryGrid() {
  const [filter, setFilter] = useState('all');
  const items = GALLERY.filter((g) => filter === 'all' || g.cat === filter);

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2.5">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              'rounded-full border-[1.5px] px-4 py-2.5 text-[13px] font-bold transition',
              filter === f.key ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="[column-gap:16px] sm:columns-2 lg:columns-3">
        {items.map((g) => (
          <figure key={g.id} className="relative mb-4 block break-inside-avoid overflow-hidden rounded-lg bg-[#e8eef3]" style={{ aspectRatio: g.tall ? '4 / 5' : '4 / 3' }}>
            <Image src={g.img} alt={`${g.title} — ${g.city}`} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px" className="object-cover" />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3.5 pb-3 pt-8" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.6))' }}>
              <span className="text-[13.5px] font-bold text-white">{g.title}</span>
              <span className="whitespace-nowrap text-[12px] text-white/85">{g.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
