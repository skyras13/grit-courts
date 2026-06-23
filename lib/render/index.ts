/**
 * renderCourt() — the single, swappable entry point for the AI Backyard Previewer.
 *
 * Providers (Replicate / Fal / mock) live behind this interface so the rest of the
 * app never knows which model is running. Swap providers by changing RENDER_PROVIDER
 * in env — no call-site changes. See docs/04-features/feat-backyard-previewer.md.
 */
import 'server-only';
import { env } from '../env';
import type { CourtType } from '../types';
import { buildPrompt, NEGATIVE_PROMPT, PROMPT_STRENGTH } from './prompt';

export interface RenderRequest {
  imageUrl: string;
  courtType: CourtType;
  /** Extra design detail (colors, size, add-ons) appended to the prompt. */
  detail?: string;
}

export interface RenderResult {
  url: string;
  provider: string;
  model: string;
  prompt: string;
  latencyMs: number;
  costUsd: number;
}

export class RenderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
  ) {
    super(message);
    this.name = 'RenderError';
  }
}

/** A curated set of pre-rendered sample courts, used by the mock provider and the
 *  sample gallery so the feature is compelling before a real key is wired. These
 *  are self-contained local SVGs (no network, never 404). Replace with the
 *  owner's real AI renders / job photos for production. */
export const SAMPLE_RENDERS: Record<CourtType, string> = {
  pickleball: '/photos/court-05.jpg',
  basketball: '/photos/court-01.jpg',
  'multi-sport': '/photos/poh-24.jpg',
  epoxy: '/photos/epoxy-1.jpg',
};

async function renderWithReplicate(req: RenderRequest, prompt: string): Promise<RenderResult> {
  const start = Date.now();
  const model = env.REPLICATE_MODEL;

  // Create a prediction and poll. We keep this dependency-free (no SDK) so the
  // bundle stays small and the call is easy to audit.
  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=55', // ask Replicate to hold the connection until done (<=60s)
    },
    body: JSON.stringify({
      // For an owner-pinned model version, set REPLICATE_MODEL to "owner/name:version".
      ...(model.includes(':') ? { version: model.split(':')[1] } : { model }),
      input: {
        prompt,
        image: req.imageUrl,
        negative_prompt: NEGATIVE_PROMPT,
        prompt_strength: PROMPT_STRENGTH,
        num_outputs: 1,
        output_format: 'webp',
        output_quality: 90,
      },
    }),
  });

  if (!createRes.ok) {
    throw new RenderError(`Replicate create failed: ${createRes.status}`, 'replicate');
  }

  let prediction = (await createRes.json()) as {
    id: string;
    status: string;
    output?: string[] | string;
    error?: string;
    urls?: { get?: string };
  };

  // Poll if not already resolved by the `Prefer: wait` hint.
  const deadline = Date.now() + 90_000;
  while (
    prediction.status !== 'succeeded' &&
    prediction.status !== 'failed' &&
    prediction.status !== 'canceled' &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 1500));
    const pollRes = await fetch(prediction.urls?.get ?? `https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Bearer ${env.REPLICATE_API_TOKEN}` },
    });
    prediction = await pollRes.json();
  }

  if (prediction.status !== 'succeeded' || !prediction.output) {
    throw new RenderError(prediction.error ?? `Replicate status: ${prediction.status}`, 'replicate');
  }

  const url = Array.isArray(prediction.output) ? prediction.output[0]! : prediction.output;
  return {
    url,
    provider: 'replicate',
    model,
    prompt,
    latencyMs: Date.now() - start,
    costUsd: 0.02, // order-of-magnitude per-render cost; refine from billing webhooks
  };
}

async function renderWithFal(req: RenderRequest, prompt: string): Promise<RenderResult> {
  const start = Date.now();
  const model = 'fal-ai/flux/dev/image-to-image';
  const res = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_url: req.imageUrl,
      strength: PROMPT_STRENGTH,
      num_images: 1,
    }),
  });
  if (!res.ok) throw new RenderError(`Fal failed: ${res.status}`, 'fal');
  const data = (await res.json()) as { images?: Array<{ url: string }> };
  const url = data.images?.[0]?.url;
  if (!url) throw new RenderError('Fal returned no image', 'fal');
  return { url, provider: 'fal', model, prompt, latencyMs: Date.now() - start, costUsd: 0.025 };
}

async function renderWithMock(req: RenderRequest, prompt: string): Promise<RenderResult> {
  // Simulate realistic latency so the polling UI is exercised in demo mode.
  await new Promise((r) => setTimeout(r, 2200));
  return {
    url: SAMPLE_RENDERS[req.courtType],
    provider: 'mock',
    model: 'demo-sample',
    prompt,
    latencyMs: 2200,
    costUsd: 0,
  };
}

export async function renderCourt(req: RenderRequest): Promise<RenderResult> {
  const prompt = buildPrompt(req.courtType, req.detail);
  switch (env.RENDER_PROVIDER) {
    case 'replicate':
      return renderWithReplicate(req, prompt);
    case 'fal':
      return renderWithFal(req, prompt);
    default:
      return renderWithMock(req, prompt);
  }
}
