import { defineSitemapEventHandler } from '#imports'
import { promises as fsp } from 'node:fs'
import path from 'node:path'

export default defineSitemapEventHandler(async () => {
  const fixed = ['/', '/info', '/info/disclaimer', '/substances'].map((loc) => ({ loc }))

  try {
    const idsPath = path.resolve(process.cwd(), 'public/data/substance_ids.json')
    const raw = await fsp.readFile(idsPath, 'utf-8')
    const ids: string[] = JSON.parse(raw)

    const dynamic = ids.map((id) => ({
      loc: `/substances/${encodeURIComponent(id)}`, // α対策
    }))

    return [...fixed, ...dynamic]
  } catch (e) {
    console.warn('[sitemap] failed to read public/data/substance_ids.json', e)
    return fixed
  }
})
