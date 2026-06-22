/**
 * City loader. Prefers published rows from Supabase when a DB is wired; otherwise
 * falls back to the static seed in cities-data.ts so the site builds and runs
 * with zero infrastructure. The merged result always exposes the richer seed
 * fields (lots/neighborhoods/fromProvo) used by the page template.
 */
import 'server-only';
import { getAnonClient } from './supabase';
import { CITIES, getCitySeed, publishedCities, type CitySeed } from './cities-data';

export type { CitySeed } from './cities-data';

/** All published city slugs — used by generateStaticParams. */
export function getAllCitySlugs(): string[] {
  return publishedCities().map((c) => c.slug);
}

/**
 * Returns a single city. DB row (if present) overrides seed scalar fields, while
 * the seed always supplies the local-detail fields the template needs.
 */
export async function getCity(slug: string): Promise<CitySeed | null> {
  const seed = getCitySeed(slug);
  const supabase = getAnonClient();
  if (!supabase) return seed ?? null;

  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (!data) return seed ?? null;
  if (!seed) return null; // local-detail fields are required by the template
  return { ...seed, ...data };
}

export function getAllCities(): CitySeed[] {
  return CITIES;
}
