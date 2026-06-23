// Re-fetch the original court photos with EXIF baked in (sharp .rotate()) so any
// sideways/upside-down iPhone shots render correctly. Same output names as before
// so lib/content.ts mappings are unchanged. Run: node scripts/fetch-courts.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const BASE =
  'https://www.builtwithgrit.com/uploads/b/8366dd669ca5a0ae1f66311a87fcdc533b1d578d73196e0200f700dadd28de97';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

const MAP = {
  'IMG_0491_1686203417.jpg': 'court-01.jpg',
  'IMG_0494_1686203417.jpg': 'court-02.jpg',
  'IMG_6914_1686203417.jpg': 'court-03.jpg',
  'IMG_7304_1739303783.jpg': 'court-04.jpg',
  'IMG_7643_1739303783.jpg': 'court-05.jpg',
  'IMG_7684%202_1739303783.jpg': 'court-06.jpg',
  'IMG_8282_1739303783.jpg': 'court-07.jpg',
  'IMG_8291_1739303783.jpg': 'court-08.jpg',
  '2DAA1921-460F-445E-B15E-1D299148F715_1685249138.JPG': 'court-09.jpg',
  '642933C2-8918-463E-9D83-77221FD10C2D_1685249131.JPG': 'court-10.jpg',
  'Jake%20Court_1663710155.jpg': 'jake-court.jpg',
  'Kevin%20Court%203_1668639635.jpg': 'kevin-court.jpg',
  'PoH%2024_1739302879.jpg': 'poh-24.jpg',
};

for (const [src, out] of Object.entries(MAP)) {
  const res = await fetch(`${BASE}/${src}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) { console.log(`SKIP ${out} (${res.status})`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const data = await sharp(buf)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(new URL(`../public/photos/${out}`, import.meta.url), data);
  console.log(`✓ ${out}  ${(data.length / 1024).toFixed(0)}KB`);
}
console.log('done');
