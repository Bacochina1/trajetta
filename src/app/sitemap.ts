import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trajettacompany.com.br';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'pt-BR': baseUrl,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
      alternates: {
        languages: {
          'pt-BR': baseUrl,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          'pt-BR': `${baseUrl}/termos`,
          en: `${baseUrl}/en/terms`,
          'x-default': `${baseUrl}/termos`,
        },
      },
    },
    {
      url: `${baseUrl}/en/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          'pt-BR': `${baseUrl}/termos`,
          en: `${baseUrl}/en/terms`,
          'x-default': `${baseUrl}/termos`,
        },
      },
    },
  ];
}
