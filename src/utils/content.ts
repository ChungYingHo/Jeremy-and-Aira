import { getCollection, type CollectionEntry } from 'astro:content'

/**
 * 通用的路徑生成器
 * @param collectionName content/config.ts 裡定義的集合名稱
 */
export async function generateCollectionPaths(collectionName: 'notes' | 'series') {
  const entries = await getCollection(collectionName, ({ data }: CollectionEntry<'notes' | 'series'>) => {
    return data.draft !== true
  })

  return entries.map((entry: CollectionEntry<'notes' | 'series'>) => ({
    params: { slug: entry.slug },
    props: { entry },
  }))
}
