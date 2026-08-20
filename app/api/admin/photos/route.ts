import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/cms/guard';
import { getContent, saveContent } from '@/lib/cms/store';
import { CONTENT_TAG } from '@/lib/cms/read';
import { getServiceClient, STORAGE_BUCKETS } from '@/lib/supabase';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/schemas';
import type { GalleryItem } from '@/lib/cms/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

/**
 * Adds a photo to the gallery.
 *
 * With Supabase configured the bytes go to a public bucket and we store the URL.
 * Without it (demo mode) we inline the image as a data URL so the owner can
 * still see the whole flow work — that path is capped hard because a data URL
 * lives in the content document itself.
 */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected a file upload.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file was attached.' }, { status: 400 });
  }
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json({ ok: false, error: 'Use a JPG, PNG or WebP.' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: 'That photo is over 10MB.' }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const supabase = getServiceClient();
  let url: string;

  if (supabase) {
    const name = `gallery/${crypto.randomUUID()}.${EXT[file.type] ?? 'jpg'}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.renders)
      .upload(name, bytes, { contentType: file.type, upsert: false });
    if (error) {
      return NextResponse.json({ ok: false, error: `Upload failed: ${error.message}` }, { status: 500 });
    }
    url = supabase.storage.from(STORAGE_BUCKETS.renders).getPublicUrl(name).data.publicUrl;
  } else {
    if (bytes.byteLength > 1_500_000) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Demo mode stores photos inline, so they must be under 1.5MB. Connect Supabase for full-size uploads.',
        },
        { status: 413 },
      );
    }
    url = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`;
  }

  const content = await getContent();
  const item: GalleryItem = {
    id: crypto.randomUUID(),
    url,
    alt: String(form.get('alt') ?? '') || 'GRIT Courts project',
    city: String(form.get('city') ?? ''),
    sport: (String(form.get('sport') ?? 'other') as GalleryItem['sport']) || 'other',
    colors: String(form.get('colors') ?? ''),
    featured: form.get('featured') === 'true',
    order: content.gallery.length,
    createdAt: new Date().toISOString(),
  };
  const saved = await saveContent({ ...content, gallery: [item, ...content.gallery] });
  revalidateTag(CONTENT_TAG);
  return NextResponse.json({ ok: true, item, gallery: saved.gallery });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ ok: false, error: 'Missing photo id.' }, { status: 400 });
  const content = await getContent();
  const saved = await saveContent({ ...content, gallery: content.gallery.filter((g) => g.id !== id) });
  revalidateTag(CONTENT_TAG);
  return NextResponse.json({ ok: true, gallery: saved.gallery });
}
