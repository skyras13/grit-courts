/**
 * Yard-image upload. Stores the visitor's photo in the private `yard-uploads`
 * bucket and returns a path plus a time-limited signed URL the render model can
 * fetch. In demo mode (no Supabase) it returns a synthetic path; the mock render
 * provider doesn't need the real bytes.
 */
import 'server-only';
import { getServiceClient, STORAGE_BUCKETS } from './supabase';

export interface StoredImage {
  path: string;
  /** Publicly fetchable URL for the render provider (signed, short-lived). */
  signedUrl: string | null;
}

const SIGNED_URL_TTL_SEC = 60 * 30; // 30 min — long enough for a render to finish

export async function uploadYardImage(
  bytes: ArrayBuffer,
  contentType: string,
  ext: string,
): Promise<StoredImage> {
  const supabase = getServiceClient();
  const filename = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  if (!supabase) {
    // Demo mode: nothing to store; return a synthetic path.
    return { path: `demo/${filename}`, signedUrl: null };
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.uploads)
    .upload(filename, bytes, { contentType, upsert: false });
  if (error) throw new Error(`upload failed: ${error.message}`);

  const { data } = await supabase.storage
    .from(STORAGE_BUCKETS.uploads)
    .createSignedUrl(filename, SIGNED_URL_TTL_SEC);

  return { path: filename, signedUrl: data?.signedUrl ?? null };
}
