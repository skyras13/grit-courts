/**
 * Centralized, validated environment access.
 *
 * Design goal: the app must run as a *demo* even when integrations are not yet
 * wired (no Supabase, no Replicate, no Resend). So instead of throwing at boot,
 * we validate softly and expose typed accessors plus capability flags. Each
 * feature degrades gracefully and logs a clear notice when a key is missing.
 *
 * Server secrets are read here ONLY in server contexts. The single NEXT_PUBLIC_*
 * values that the browser needs are re-exported from `lib/public-env.ts`.
 */
import { z } from 'zod';

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3400'),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  RENDER_PROVIDER: z.enum(['replicate', 'fal', 'mock']).default('mock'),
  REPLICATE_API_TOKEN: z.string().min(1).optional(),
  REPLICATE_MODEL: z.string().default('black-forest-labs/flux-dev'),
  FAL_KEY: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().min(1).optional(),
  OWNER_EMAIL: z.string().email().default('owner@builtwithgrit.com'),
  FROM_EMAIL: z.string().email().default('leads@builtwithgrit.com'),

  LEAD_WEBHOOK_URL: z.string().url().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  META_PIXEL_ID: z.string().optional(),
  META_CAPI_TOKEN: z.string().optional(),
  META_TEST_EVENT_CODE: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  ADMIN_PASSWORD: z.string().default('change-me-please'),
  ADMIN_SESSION_SECRET: z.string().default('dev-insecure-session-secret-change-me'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  // We only reach here for *malformed* values (e.g. a non-URL SITE_URL), not for
  // missing optional integration keys. Surface clearly but don't crash dev.
  console.warn(
    '[env] Some environment variables are malformed:\n' +
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
}

export const env: ServerEnv = parsed.success
  ? parsed.data
  : serverEnvSchema.parse({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3400' });

/** Capability flags — each feature checks these and degrades gracefully. */
export const capabilities = {
  supabase: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  supabasePublic: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
  render:
    env.RENDER_PROVIDER === 'mock'
      ? true
      : env.RENDER_PROVIDER === 'replicate'
        ? Boolean(env.REPLICATE_API_TOKEN)
        : Boolean(env.FAL_KEY),
  email: Boolean(env.RESEND_API_KEY),
  webhook: Boolean(env.LEAD_WEBHOOK_URL),
  twilio: Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER),
  metaCapi: Boolean(env.META_PIXEL_ID && env.META_CAPI_TOKEN),
  ga: Boolean(env.NEXT_PUBLIC_GA_ID),
} as const;

export const isDemoMode = !capabilities.supabase;

export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
