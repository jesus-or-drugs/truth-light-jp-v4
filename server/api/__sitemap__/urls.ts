// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '#imports'
import { promises as fsp } from 'node:fs'
import path from 'node:path'

export default defineSitemapEventHandler(async () => {
  // 1) 手動で入れたい固定ページ
  const fixed = [
    '/',
    '/info',
    '/info/disclaimer',
    '/substances',
  ].map((loc) => ({ loc }))

  // 2) /substances/[id] は data/substances/*.json のファイル名から生成
  const dir = path.resolve(process.cwd(), 'data/substances')
  const files = await fsp.readdir(dir)

  const dynamic = files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .map((id) => ({ loc: `/substances/${id}` }))

  // まとめて返す
  return [...fixed, ...dynamic]
})
