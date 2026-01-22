import { defineSitemapEventHandler } from '#imports'
import { promises as fsp } from 'node:fs'
import path from 'node:path'

async function safeListSubstanceIds(dir: string) {
  try {
    await fsp.access(dir) // ここで存在チェック
    const files = await fsp.readdir(dir)

    return files
      .filter((f) => f.endsWith('.json'))
      .filter((f) => !f.startsWith('_')) // _scheme.json など除外
      .map((f) => f.replace(/\.json$/, ''))
  } catch (e) {
    // ここで落とさず「動的0件」で返す
    console.warn('[sitemap] cannot read dir:', dir, e)
    return []
  }
}

export default defineSitemapEventHandler(async () => {
  // 固定ページ（手動）
  const fixed = ['/', '/info', '/info/disclaimer', '/substances'].map((loc) => ({ loc }))

  // 動的ページ（data/substances のファイル名から）
  const dir = path.resolve(process.cwd(), 'data/substances')
  const ids = await safeListSubstanceIds(dir)

  const dynamic = ids.map((id) => ({ loc: `/substances/${encodeURIComponent(id)}` }))

  return [...fixed, ...dynamic]
})
