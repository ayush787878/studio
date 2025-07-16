
import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/history', // User-specific content
          '/progress', // Not in use
        ],
      },
    ],
    sitemap: 'https://facelyze.com/sitemap.xml',
  };
}
