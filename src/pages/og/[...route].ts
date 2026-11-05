import { OGImageRoute } from 'astro-og-canvas'
import { getExcerpt, clamp } from '@/utils/excerpt'
import { getPublishedEntries } from '@/utils/content'
import type { CollectionType } from '@/models/menu'

const OG_COLLECTIONS: CollectionType[] = ['techbook', 'blog']

const entryLists = await Promise.all(OG_COLLECTIONS.map((c) => getPublishedEntries(c)))

const pages: Record<string, { title: string; description: string }> = {}
OG_COLLECTIONS.forEach((collection, i) => {
  for (const entry of entryLists[i]) {
    pages[`${collection}/${entry.slug}`] = {
      title: entry.data.title ?? 'Untitled',
      description: entry.data.description ?? getExcerpt(entry.body),
    }
  }
})

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: clamp(page.description, 80),
    logo: { path: './public/icon-512.png', size: [76, 76] },
    bgGradient: [[65, 66, 74]],
    border: { color: [222, 213, 235], width: 6, side: 'block-end' },
    padding: 64,
    font: {
      title: { color: [240, 237, 244], size: 60, lineHeight: 1.3, weight: 'Bold', families: ['Noto Sans TC'] },
      description: { color: [213, 208, 220], size: 28, lineHeight: 1.45, weight: 'Normal', families: ['Noto Sans TC'] },
    },
    fonts: ['./src/assets/og/NotoSansTC.ttf'],
  }),
})
