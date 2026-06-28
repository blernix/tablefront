import { MetadataRoute } from 'next';
import { cities } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tablemaster.fr';
  const currentDate = new Date().toISOString().split('T')[0];

  const pages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/demo`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/integrations`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/site-sur-mesure`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/legal`, lastModified: '2026-01-11', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: '2026-01-11', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/cookies`, lastModified: '2026-01-11', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/cgv`, lastModified: '2026-01-11', changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  // Pages villes
  cities.forEach((city) => {
    pages.push({
      url: `${baseUrl}/ville/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    });
  });

  return pages;
}
