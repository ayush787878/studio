
import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/history/', '/progress/', '/store/'],
      },
    ],
    sitemap: 'https://facelyze.com/sitemap.xml',
  };
}
