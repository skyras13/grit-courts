/**
 * Content persistence. Supabase when it's configured, an in-process store
 * otherwise so the site is fully demo-able before the owner has an account.
 *
 * The in-process store hangs off globalThis deliberately: Next.js route handlers
 * can be bundled more than once, and a module-level Map would silently give each
 * bundle its own copy.
 */
import 'server-only';
import { getServiceClient } from '../supabase';
import { DEFAULT_CONTENT } from './defaults';
import type { SiteContent } from './types';

const TABLE = 'site_content';
const ROW_ID = 'singleton';

interface CmsGlobal {
  __gritContent?: SiteContent;
}
const g = globalThis as unknown as CmsGlobal;

function demoContent(): SiteContent {
  if (!g.__gritContent) g.__gritContent = structuredClone(DEFAULT_CONTENT);
  return g.__gritContent;
}

/** Fills in anything a stored document is missing after a schema addition. */
function merge(stored: Partial<SiteContent> | null | undefined): SiteContent {
  if (!stored) return structuredClone(DEFAULT_CONTENT);
  return {
    ...structuredClone(DEFAULT_CONTENT),
    ...stored,
    business: { ...DEFAULT_CONTENT.business, ...(stored.business ?? {}) },
    social: { ...DEFAULT_CONTENT.social, ...(stored.social ?? {}) },
    special: { ...DEFAULT_CONTENT.special, ...(stored.special ?? {}) },
    home: { ...DEFAULT_CONTENT.home, ...(stored.home ?? {}) },
    integrations: { ...DEFAULT_CONTENT.integrations, ...(stored.integrations ?? {}) },
    seo: { ...DEFAULT_CONTENT.seo, ...(stored.seo ?? {}) },
  };
}

export async function getContent(): Promise<SiteContent> {
  const supabase = getServiceClient();
  if (!supabase) return demoContent();

  const { data, error } = await supabase.from(TABLE).select('data').eq('id', ROW_ID).maybeSingle();
  if (error || !data) return structuredClone(DEFAULT_CONTENT);
  return merge(data.data as Partial<SiteContent>);
}

export async function saveContent(next: SiteContent): Promise<SiteContent> {
  const stamped: SiteContent = { ...next, updatedAt: new Date().toISOString() };
  const supabase = getServiceClient();
  if (!supabase) {
    g.__gritContent = stamped;
    return stamped;
  }
  const { error } = await supabase.from(TABLE).upsert({ id: ROW_ID, data: stamped });
  if (error) throw new Error(`Could not save content: ${error.message}`);
  return stamped;
}

/** Applies a partial update without the caller having to read-modify-write. */
export async function patchContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getContent();
  return saveContent({ ...current, ...patch });
}

export async function resetContent(): Promise<SiteContent> {
  return saveContent(structuredClone(DEFAULT_CONTENT));
}
