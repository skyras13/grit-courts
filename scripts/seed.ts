/**
 * Seeds the Supabase `cities` and `testimonials` tables from the static data in
 * lib/. Idempotent (upsert on slug/id). Requires SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY in the environment. Run: `npm run db:seed`.
 *
 * No-op with a clear message if Supabase isn't configured — the site runs on the
 * static seed without a DB, so this is only needed once you wire Supabase.
 */
import { createClient } from '@supabase/supabase-js';
import { CITIES } from '../lib/cities-data';
import { TESTIMONIALS } from '../lib/site';

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — nothing to seed. Skipping.');
    return;
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const cityRows = CITIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    county: c.county,
    landmark: c.landmark,
    blurb: c.blurb,
    lat: c.lat,
    lng: c.lng,
    median_home_value: c.median_home_value,
    target_keywords: c.target_keywords,
    published: c.published,
  }));
  const { error: cityErr } = await supabase.from('cities').upsert(cityRows, { onConflict: 'slug' });
  if (cityErr) throw cityErr;
  console.log(`Seeded ${cityRows.length} cities.`);

  const tRows = TESTIMONIALS.map((t) => ({
    name: t.name,
    city: t.city,
    court_type: t.court_type,
    rating: t.rating,
    quote: t.quote,
    photo_url: t.photo_url,
    published: t.published,
  }));
  const { error: tErr } = await supabase.from('testimonials').insert(tRows);
  if (tErr && !tErr.message.includes('duplicate')) throw tErr;
  console.log(`Seeded ${tRows.length} testimonials.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
