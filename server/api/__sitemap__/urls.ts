import { defineSitemapEventHandler } from '#imports'
import { getRequestURL } from 'h3'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async (event) => {
  const fixed: SitemapUrl[] = [
    '/',
    '/about-us',
    '/disclaimer',
    '/contact-us',
    '/substances'
  ].map((loc): SitemapUrl => ({ loc }))

  const readingUrls: SitemapUrl[] = []

  try {
    const readings = await queryCollection(event, 'readings')
      .select('path', 'updatedAt')
      .all()
    console.log(...readings)

    readingUrls.push(
      ...readings.map((reading) => ({
        loc: reading.path,
        lastmod: reading.updatedAt ?? '',
        changefreq: 'monthly' as const,
        priority: getContentPriority(reading.path),
      }))
    )
  } catch (e) {
    console.warn('[sitemap] failed to fetch Nuxt Content readings.', e)
  }

  const substanceUrls: SitemapUrl[] = []

  try {
    // リクエストの origin を使って同一ドメインから静的JSONを取得
    const origin = getRequestURL(event).origin
    const ids = await $fetch<string[]>(`${origin}/data/substance_ids.json`)

    substanceUrls.push(
      ...ids.map((id) => ({
        loc: `/substances/${encodeURIComponent(id)}`,
        changefreq: 'monthly' as const,
        priority: 0.7 as SitemapUrl['priority'],
      }))
    )
    
  } catch (e) {
    console.warn('[sitemap] failed to fetch /data/substance_ids.json', e)
  }

  const urls = [
    ...readingUrls,
    ...fixed,
    ...substanceUrls,
  ]

  return Array.from(
    new Map(urls.map((url) => [url.loc, url])).values(),
  )
})

function getContentPriority(path: string): SitemapUrl['priority'] {
  if (path.startsWith('/readings/recovery')) return 0.9
  if (path.startsWith('/readings/basics')) return 0.8
  return 0.6
}
