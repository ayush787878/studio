
import { MetadataRoute } from 'next';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://facelyze.com';
 
  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'monthly' },
    { url: '/scan-face', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/store', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/learning-plan', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/event', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/advisory', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/login', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: route.priority,
  }));
}
