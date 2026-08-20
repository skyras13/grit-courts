/**
 * Cached read path for published content.
 *
 * Pages stay fast because content is cached and tagged; publishing from the
 * dashboard invalidates the tag, so an edit is live immediately without making
 * every route dynamic.
 */
import 'server-only';
import { unstable_cache } from 'next/cache';
import { getContent } from './store';
import type { SiteContent } from './types';

export const CONTENT_TAG = 'site-content';

export const readContent = unstable_cache(
  async (): Promise<SiteContent> => getContent(),
  ['site-content-v1'],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

/** Is the promo bar currently live? Honours the expiry date. */
export function specialIsLive(c: SiteContent): boolean {
  if (!c.special.enabled) return false;
  if (!c.special.expiresAt) return true;
  return new Date(c.special.expiresAt).getTime() > Date.now();
}
