import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrlWithPath = `${baseUrl}${basePath}`;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pt-BR/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrlWithPath}/dashboard/`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.8,
    },
  ];
}
