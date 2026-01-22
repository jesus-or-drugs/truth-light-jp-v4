import { defineSitemapEventHandler } from '#imports'
import { getRequestURL } from 'h3'

export default defineSitemapEventHandler(async (event) => {
  const fixed = ['/', '/info', '/info/disclaimer', '/substances'].map((loc) => ({ loc }))

  try {
    // リクエストの origin を使って同一ドメインから静的JSONを取得
    const origin = getRequestURL(event).origin
    const ids = await $fetch<string[]>(`${origin}/data/substance_ids.json`)

    const dynamic = ids.map((id) => ({
      loc: `/substances/${encodeURIComponent(id)}`, // α対策
    }))

    return [...fixed, ...dynamic]
  } catch (e) {
    console.warn('[sitemap] failed to fetch /data/substance_ids.json', e)
    return fixed
  }
})
