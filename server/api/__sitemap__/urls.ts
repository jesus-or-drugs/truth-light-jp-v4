import { defineSitemapEventHandler } from '#imports'
import { promises as fsp } from 'node:fs'
import path from 'node:path'

export default defineSitemapEventHandler(async () => {
  // 固定ページ（手動）
  const fixed = ['/', '/info', '/info/disclaimer', '/substances'].map((loc) => ({ loc }))

  // 動的ページ（data/substances/*.json から）
  const dir = path.resolve(process.cwd(), 'data/substances')

  try {
    const files = await fsp.readdir(dir)

    const dynamic = files
      .filter((f) => f.endsWith('.json'))
      .filter((f) => !f.startsWith('_')) // _scheme.json など除外
      .filter((f) => !f.startsWith('.')) // .DS_Store 等除外
      .map((f) => f.replace(/\.json$/, ''))
      // ★重要：idをURLセグメントとしてエンコード（α-xxx 対策）
      .map((id) => ({ loc: `/substances/${encodeURIComponent(id)}` }))

    return [...fixed, ...dynamic]
  } catch (e) {
    // dir読み込みでコケても sitemap を落とさない（固定ページだけ返す）
    console.warn('[sitemap] failed to read:', dir, e)
    return fixed
  }
})
