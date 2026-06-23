/**
 * Zod schemas for every external input. The client never gets trusted —
 * API routes parse with these and reject on failure. Shared with React Hook Form
 * on the client so validation rules live in exactly one place.
 */
import { z } from 'zod';
import { COURT_SIZES, COURT_TYPES, LAND_CONDITIONS, RENDER_STATUSES } from './types';

// Loose-but-real phone check: 10+ digits after stripping formatting.
const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number')
  .refine((v) => (v.match(/\d/g)?.length ?? 0) >= 10, 'Enter a 10-digit phone number');

export const utmSchema = z.record(z.string(), z.string()).default({});

export const leadSchema = z
  .object({
    courtType: z.enum(COURT_TYPES).optional(),
    courtSize: z.enum(COURT_SIZES).optional(),
    landCondition: z.enum(LAND_CONDITIONS).optional(),
    fullName: z.string().trim().min(2, 'Please enter your name').max(120),
    // Phone OR email is required (estimator/previewer send phone; the contact &
    // warranty forms send email + message). Enforced by the refine below.
    phone: phoneSchema.optional().or(z.literal('')),
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    message: z.string().trim().max(2000).optional(),
    propertyAddress: z.string().trim().max(240).optional().or(z.literal('')),
  citySlug: z.string().trim().max(120).optional(),
  renderId: z.string().uuid().optional(),
  // TCPA: must be explicitly true to trigger SMS automation; we store the timestamp.
  smsConsent: z.boolean().default(false),
  estimatedMin: z.number().int().nonnegative().optional(),
  estimatedMax: z.number().int().nonnegative().optional(),
  utm: utmSchema.optional(),
  // Meta click cookies — the client reads these and may send null when absent.
    fbc: z.string().nullable().optional(),
    fbp: z.string().nullable().optional(),
    source: z.string().default('site'),
  })
  .refine((v) => Boolean((v.phone && v.phone.length) || (v.email && v.email.length)), {
    message: 'Add a phone number or email so we can reach you',
    path: ['phone'],
  });

export type LeadInput = z.infer<typeof leadSchema>;

export const renderCreateSchema = z.object({
  courtType: z.enum(COURT_TYPES).default('pickleball'),
  // The uploaded file is handled separately as multipart; this validates the rest.
  leadId: z.string().uuid().optional(),
});

export type RenderCreateInput = z.infer<typeof renderCreateSchema>;

export const renderWebhookSchema = z.object({
  renderId: z.string().uuid(),
  status: z.enum(RENDER_STATUSES),
  renderedImageUrl: z.string().url().optional(),
  error: z.string().optional(),
  latencyMs: z.number().int().optional(),
  costUsd: z.number().optional(),
});

export type RenderWebhookInput = z.infer<typeof renderWebhookSchema>;

/** Upload constraints enforced on both client and server. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;
export const MAX_IMAGE_EDGE = 1536; // px — downscale longest edge before upload
