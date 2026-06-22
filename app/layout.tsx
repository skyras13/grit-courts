import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { Analytics } from '@/components/site/analytics';
import { JsonLd, localBusinessJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/env';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GRIT Courts | Custom Pickleball, Basketball & Multi-Sport Court Builders in Utah',
    template: '%s | GRIT Courts',
  },
  description:
    'Utah’s custom sport-court builders. We design and install backyard pickleball, basketball, and multi-sport courts across the Wasatch Front. See your court before we pour with our AI previewer.',
  applicationName: COMPANY.name,
  keywords: [
    'pickleball court builder utah',
    'backyard basketball court',
    'multi-sport court',
    'sport court utah',
    'epoxy garage floor',
  ],
  openGraph: {
    type: 'website',
    siteName: COMPANY.name,
    title: 'Custom Sport Courts in Utah | GRIT Courts',
    description:
      'See a finished court rendered onto a photo of your own backyard — then get an instant price range.',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: COMPANY.brandColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={localBusinessJsonLd()} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
