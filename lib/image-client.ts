/**
 * Client-side image preprocessing for the Backyard Previewer.
 *
 * Downscales the longest edge to MAX_IMAGE_EDGE and re-encodes to JPEG via canvas.
 * Re-encoding through canvas drops all EXIF/GPS metadata as a side effect, which
 * is exactly the privacy behavior we want (we never want the visitor's home GPS
 * coordinates). Returns a Blob ready to upload. HEIC from iOS is typically
 * delivered to canvas as a decodable image by Safari; if a browser can't decode
 * it, the caller surfaces a friendly error.
 */
import { MAX_IMAGE_EDGE } from './schemas';

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
}

export async function processYardImage(file: File): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('We couldn’t read that image. Try a JPG or PNG photo.');
  });

  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > MAX_IMAGE_EDGE ? MAX_IMAGE_EDGE / longest : 1;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser can’t process images here.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9),
  );
  if (!blob) throw new Error('We couldn’t process that image. Please try another.');

  return { blob, width, height, previewUrl: URL.createObjectURL(blob) };
}
