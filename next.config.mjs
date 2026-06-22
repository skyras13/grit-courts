/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;
  } catch {
    return undefined;
  }
})();

const remotePatterns = [
  // Supabase Storage public renders bucket
  ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
  // Replicate delivery domain (rendered images during dev/demo)
  { protocol: 'https', hostname: 'replicate.delivery' },
  { protocol: 'https', hostname: '*.replicate.delivery' },
  // Fal output (if provider swapped)
  { protocol: 'https', hostname: 'fal.media' },
  { protocol: 'https', hostname: '*.fal.media' },
  // Unsplash for placeholder/sample imagery in the demo gallery
  { protocol: 'https', hostname: 'images.unsplash.com' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
