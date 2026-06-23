import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';
import { publishedCities } from '@/lib/cities-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/preview`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/design`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services/pickleball`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/court-surfacing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/coatings`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/trade-partners`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/warranty`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${siteUrl}/service-area`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = publishedCities().map((c) => ({
    url: `${siteUrl}/utah/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
