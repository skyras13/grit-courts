import Link from 'next/link';
import { readContent, specialIsLive } from '@/lib/cms/read';

/**
 * Site-wide promo bar. Renders nothing unless the owner has switched it on and
 * the end date hasn't passed — so an expired promo takes itself down instead of
 * sitting live for six months.
 */
export async function SpecialBanner() {
  const content = await readContent();
  if (!specialIsLive(content)) return null;
  const s = content.special;

  return (
    <div className="bg-accent text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center sm:px-7">
        <span className="text-[14px] font-bold">{s.headline}</span>
        {s.body && <span className="text-[13.5px] text-white/85">{s.body}</span>}
        {s.ctaLabel && (
          <Link
            href={s.ctaHref || '/contact'}
            className="rounded-full bg-white/15 px-3.5 py-1 text-[13px] font-bold underline-offset-2 hover:bg-white/25"
          >
            {s.ctaLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
