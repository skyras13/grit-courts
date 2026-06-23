// One-off: re-download the service/gallery photos from the live CDN and bake
// EXIF orientation into pixels (sharp .rotate()) + downscale. Fixes the
// upside-down/sideways iPhone shots. Run: node scripts/fetch-photos.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const BASE =
  'https://www.builtwithgrit.com/uploads/b/8366dd669ca5a0ae1f66311a87fcdc533b1d578d73196e0200f700dadd28de97';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

// CDN filename (URL-encoded) -> output file in public/photos
const MAP = {
  // services
  'IMG_3873_1740005848.jpg': 'svc-surfacing.jpg',
  'PNG%20image_1740006129.jpeg': 'svc-repair.jpg', // cracked court
  'IMG_3865_1740006163.JPG': 'svc-lines.jpg',
  'Black%20Lines%202_1749865517.JPEG': 'lines-2.jpg',
  'IMG_3876_1740006585.jpg': 'svc-fencing.jpg',
  'epoxy%20floor%202_1658868731.jpg': 'epoxy-1.jpg',
  'epoxy%20floor_1658868704.jpg': 'epoxy-2.jpg',
  'IMG_1828_1740006330.jpg': 'svc-landscaping.jpg', // lawn + boulders + mountains
  'IMG_0956_1740006506.JPEG': 'svc-concrete.jpg', // concrete pour crew
  'IMG_3877_1740007384.PNG': 'svc-trampoline.jpg', // court + in-ground trampolines
  'Parking%20Lot%20Lines_1740006898.jpg': 'svc-parking.jpg',
  'golf-simulator-shed-12-copy_1752608439.jpg': 'svc-golf.jpg',
  // hero / gallery extras
  'dji_fly_20250515_150914_186_1747344171794_photo_optimized_1750386193.jpg': 'drone-1.jpg',
  'dji_fly_20250524_073702_353_1748580777000_photo_optimized_1749865517.JPG': 'drone-2.jpg',
  'Kevin%20Court%202_1750386193.jpg': 'kevin-2.jpg',
  'James%20Garage%201_1664429594.jpg': 'garage-1.jpg',
  'Ann%20Whole%20Garage_1668639653.JPG': 'garage-2.jpg',
  'Cool%20Cars_1768265926.jpg': 'coatings-cars.jpg',
};

for (const [src, out] of Object.entries(MAP)) {
  const res = await fetch(`${BASE}/${src}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.log(`SKIP ${out} (${res.status})`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const data = await sharp(buf)
    .rotate() // bake EXIF orientation
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(new URL(`../public/photos/${out}`, import.meta.url), data);
  console.log(`✓ ${out}  ${(data.length / 1024).toFixed(0)}KB`);
}
console.log('done');
