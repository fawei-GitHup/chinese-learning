import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/medical/*',
          '/sitemap.xml',
        ],
        disallow: [
          '/login',
          '/app/*',
          '/auth/*',
          '/dashboard',
          '/srs',
          '/search',
          '/account',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
