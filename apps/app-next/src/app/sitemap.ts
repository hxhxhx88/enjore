import type { MetadataRoute } from 'next'
import { locales } from '@repo/i18n/locales'
import { env } from '@/lib/env'

const pages = ['', '/privacy-policy', '/service-terms']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return locales.flatMap(locale =>
    pages.map(page => ({
      url: `${env.APP_ORIGIN}/${locale}${page}`,
      lastModified,
    })),
  )
}
