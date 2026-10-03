import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trajettacompany.com.br';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
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
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'pt-BR': baseUrl,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
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
