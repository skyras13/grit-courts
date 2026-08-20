import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { readContent } from '@/lib/cms/read';

export const metadata: Metadata = {
  title: 'Our Work — Sport Courts & Backyards Across the Wasatch Front',
  description:
    'Real GRIT Courts projects: backyard pickleball, basketball, and multi-sport courts, epoxy floors, turf, and full backyard transformations across Utah.',
  alternates: { canonical: '/gallery' },
};

export default async function GalleryPage() {
  const content = await readContent();
  return (
    <div className="mx-auto max-w-content px-5 pb-[clamp(48px,6vw,80px)] pt-[clamp(28px,4vw,56px)] sm:px-7">
      <div className="mb-7 max-w-[640px]">
        <div className="eyebrow mb-4">Our work</div>
        <h1 className="font-display text-[clamp(32px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">Built across the Wasatch Front.</h1>
        <p className="mt-3.5 text-[16px] leading-relaxed text-[#4a5560]">
          Real backyards, from sloped dirt lots to finished game courts. Filter by what you’re planning.
        </p>
      </div>
      <GalleryGrid uploaded={content.gallery} />
    </div>
  );
}
