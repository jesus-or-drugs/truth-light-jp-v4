export type NewsCategory = 'site' | 'law' | 'substance' | 'article'

export type NewsItem = {
  id: string
  title: string
  date: string
  category: NewsCategory
  summary: string
  href?: string
  attachments?: string[]
}

export const newsItems: NewsItem[] = [
  {
    id: '2026-07-05-scheduled-substance',
    title: '指定薬物の指定情報を更新しました',
    date: '2026-07-05',
    category: 'law',
    summary: '新たに指定薬物として指定された物質の情報を反映しました。',
    href: '/news',
  },
  {
    id: '2026-07-01-mdma-page',
    title: 'MDMAの基礎情報ページを更新しました',
    date: '2026-07-01',
    category: 'substance',
    summary: '作用、副作用、依存性、法規制情報を整理しました。',
    href: '/substance/mdma',
  },
]