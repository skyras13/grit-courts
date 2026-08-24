'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GALLERY, GALLERY_FILTERS } from '@/lib/content';
import type { GalleryItem } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

/** Maps an owner-uploaded photo onto the shape the grid already renders. */
function fromCms(g: GalleryItem) {
  return {
    id: g.id,
    img: g.url,
    title: g.colors || g.alt,
    city: g.city || 'Utah',
    cat: g.sport === 'multi-sport' ? 'multi' : g.sport,
    tall: false,
    uploaded: true as const,
  };
}

export function GalleryGrid({ uploaded = [] }: { uploaded?: GalleryItem[] }) {
  const [filter, setFilter] = useState('all');
  // Owner uploads lead, so the newest job is the first thing a visitor sees.
  const all = [...uploaded.map(fromCms), ...GALLERY.map((g) => ({ ...g, uploaded: false as const }))];
  const items = all.filter((g) => filter === 'all' || g.cat === filter);

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
          <figure key={g.id} className="relative mb-4 block break-inside-avoid overflow-hidden rounded-lg bg-[#e8eef3] shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift" style={{ aspectRatio: g.tall ? '4 / 5' : '4 / 3' }}>
            {g.uploaded ? (
              // Owner uploads can be remote or data URLs, so they bypass next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.img} alt={`${g.title} — ${g.city}`} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Image src={g.img} alt={`${g.title} — ${g.city}`} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 400px" className="object-cover" />
            )}
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
