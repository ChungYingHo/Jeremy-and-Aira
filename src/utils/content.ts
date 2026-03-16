import { getCollection } from 'astro:content'
import type { CollectionType } from '@/models/menu' 

export async function generateCollectionPaths(collectionName: CollectionType) {
  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  const entries = await getCollection(collectionName as any, (entry: any) => {
    return entry.data.draft !== true
  })

  return entries.map((entry: any) => ({
    params: { slug: entry.slug },
    props: { entry },
  }))
}
