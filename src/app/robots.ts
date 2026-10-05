import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://trajettacompany.com.br';

  return {
    rules: [
      // 1. General search engines (Google, Bing, Yahoo, DuckDuckGo)
      {
        userAgent: '*',
        allow: ['/', '/en', '/login', '/register', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: [
          '/api/',
          '/app/',
          '/admin/',
          '/crm/',
          '/dashboard/',
          '/auth',
        ],
      },
      // 2. OpenAI Crawlers (ChatGPT Search, GPT-4, Operator)
      {
        userAgent: ['GPTBot', 'ChatGPT-User'],
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
      // 3. Perplexity AI Crawler
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
      // 4. Anthropic Claude Crawlers
      {
        userAgent: ['ClaudeBot', 'anthropic-ai'],
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
      // 5. Google AI Overviews & Gemini
      {
        userAgent: ['Google-Extended', 'Googlebot'],
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
      // 6. Apple Intelligence
      {
        userAgent: ['Applebot', 'Applebot-Extended'],
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
      // 7. Open Source Training Crawlers
      {
        userAgent: ['CCBot', 'cohere-ai', 'Diffbot'],
        allow: ['/', '/en', '/termos', '/en/terms', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/app/', '/admin/', '/crm/', '/dashboard/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
