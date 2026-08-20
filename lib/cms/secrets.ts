/**
 * Owner-managed API keys.
 *
 * Design rules, in order of importance:
 *   1. A secret value is NEVER returned to the browser. The dashboard can ask
 *      whether a key is set and see a masked hint; it can never read one back.
 *   2. Environment variables win over stored values. If the developer sets a key
 *      in Vercel, a dashboard entry can't silently override it.
 *   3. Storage is server-only and goes through the service-role client, so the
 *      anon key can never reach this table.
 *
 * This is the compromise between "the owner must be able to paste in their own
 * fal.ai key without calling me" and "secrets should not live in a CMS".
 */
import 'server-only';
import { getServiceClient } from '../supabase';
import { SECRET_KEYS, type SecretKey } from './types';

const TABLE = 'site_secrets';

interface SecretGlobal {
  __gritSecrets?: Map<string, string>;
}
const g = globalThis as unknown as SecretGlobal;
function demoSecrets(): Map<string, string> {
  if (!g.__gritSecrets) g.__gritSecrets = new Map();
  return g.__gritSecrets;
}

/** Reads a secret: env first, then owner-set storage. Server-only. */
export async function getSecret(key: SecretKey): Promise<string | null> {
  const fromEnv = process.env[key];
  if (fromEnv && fromEnv.length > 0) return fromEnv;

  const supabase = getServiceClient();
  if (!supabase) return demoSecrets().get(key) ?? null;

  const { data } = await supabase.from(TABLE).select('value').eq('key', key).maybeSingle();
  return (data?.value as string | undefined) ?? null;
}

export async function setSecret(key: SecretKey, value: string): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) {
    demoSecrets().set(key, value);
    return;
  }
  const { error } = await supabase.from(TABLE).upsert({ key, value });
  if (error) throw new Error(`Could not save key: ${error.message}`);
}

export async function clearSecret(key: SecretKey): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) {
    demoSecrets().delete(key);
    return;
  }
  await supabase.from(TABLE).delete().eq('key', key);
}

export interface SecretStatus {
  key: SecretKey;
  isSet: boolean;
  /** Last four characters only — enough to tell two keys apart, useless to a thief. */
  hint: string | null;
  /** True when the value comes from an env var and the dashboard can't change it. */
  managedByEnv: boolean;
}

/** Safe-to-serialise status for every manageable key. */
export async function secretStatuses(): Promise<SecretStatus[]> {
  return Promise.all(
    SECRET_KEYS.map(async (key) => {
      const managedByEnv = Boolean(process.env[key]);
      const value = await getSecret(key);
      return {
        key,
        isSet: Boolean(value),
        hint: value ? `••••${value.slice(-4)}` : null,
        managedByEnv,
      };
    }),
  );
}
