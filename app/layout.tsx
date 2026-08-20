import type { Metadata, Viewport } from 'next';
import { Archivo, Manrope, Newsreader } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/site/header';
import { SpecialBanner } from '@/components/site/special-banner';
import { Footer } from '@/components/site/footer';
import { Analytics } from '@/components/site/analytics';
import { EstimateProvider } from '@/components/estimate/estimate-provider';
import { JsonLd, localBusinessJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/env';
import { COMPANY } from '@/lib/site';

const archivo = Archivo({ subsets: ['latin'], weight: ['500', '600', '700', '800', '900'], variable: '--font-archivo', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500'], style: ['italic'], variable: '--font-newsreader', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GRIT Courts | Custom Sport Court & Backyard Builders in Utah',
    template: '%s | GRIT Courts',
  },
  description:
    'Utah’s custom court and backyard builders. Pickleball, basketball, and multi-sport courts, plus pools, concrete, and full backyard transformations across the Wasatch Front. Design your court in 3D or see it in your own yard.',
  applicationName: COMPANY.name,
  openGraph: {
    type: 'website',
    siteName: COMPANY.name,
    title: 'Custom Sport Courts & Backyards in Utah | GRIT Courts',
    description: 'Design your court in 3D, then see it dropped into a photo of your own backyard.',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#2b598a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper">
        <a href="#main" className="skip-link">Skip to content</a>
        <JsonLd data={localBusinessJsonLd()} />
        <EstimateProvider>
          <SpecialBanner />
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </EstimateProvider>
        <Analytics />
      </body>
    </html>
  );
}
