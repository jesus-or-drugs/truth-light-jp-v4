// server/api/feed/note-feed.get.ts
import Parser from 'rss-parser'

const parser = new Parser()

export default cachedEventHandler(async () => {

  type NoteArticle = {
    title?: string
    link?: string
    pubDate?: string
    isoDate?: string
    contentSnippet?: string
  }
  const feed = await parser.parseURL('https://note.com/truthlight_proj/rss')

  return feed.items.slice(0, 3).map((item: NoteArticle) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    isoDate: item.isoDate,
    contentSnippet: item.contentSnippet,
  }))
}, {
  maxAge: 60 * 60 * 3, // 3時間キャッシュ
  name: 'note-feed',
})