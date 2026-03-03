import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/api/',
        '/*.json$',
        '/*.js$',
        '/_next/',
        '/favicon.ico',
        '/public/',
      ],
    },
    sitemap: 'https://tablemaster.fr/sitemap.xml',
    host: 'https://tablemaster.fr',
  };
}
