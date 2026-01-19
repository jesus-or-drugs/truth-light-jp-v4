// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  // 例: JSONをローカルから読む/DBから取る/CMSを叩く…など
  const ids = ['lsd', 'mdma', 'ketamine'] // 仮

  return ids.map((id) => ({
    loc: `/substances/${id}`,
    // lastmod を入れたいなら ISO文字列で
    // lastmod: new Date().toISOString(),
  })) satisfies SitemapUrlInput[]
})