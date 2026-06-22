/**
 * Supabase access.
 *
 * - `getServiceClient()` — server-only, uses the SERVICE ROLE key. All writes to
 *   `leads` / `renders` go through this (RLS blocks anon writes). NEVER import
 *   this into a Client Component.
 * - `getAnonClient()` — public read client (anon key) for published cities /
 *   testimonials and Storage public URLs.
 *
 * Both return `null` when the corresponding keys are absent so the app runs in
 * demo mode without crashing. Callers must handle the null path.
 */
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, capabilities } from './env';

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  if (!capabilities.supabase) return null;
  if (!serviceClient) {
    serviceClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}

export function getAnonClient(): SupabaseClient | null {
  if (!capabilities.supabasePublic) return null;
  if (!anonClient) {
    anonClient = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonClient;
}

export const STORAGE_BUCKETS = {
  uploads: 'yard-uploads', // private, EXIF-stripped client-side
  renders: 'renders', // public-read
} as const;
