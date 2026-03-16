import { getCollection } from 'astro:content'
import type { CollectionType } from '@/models/menu'
import { MENU_COLLECTIONS } from '@/models/menu'

export type NavLink = { title: string; href: string } | null

function slugToTimestamp(slug: string): number {
  const match = slug.match(/^(\d{4})(\d{2})(\d{2})-/)
  if (match) return new Date(`${match[1]}-${match[2]}-${match[3]}`).valueOf()
  return 0
}

export async function generateCollectionPaths(collectionName: CollectionType) {
  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  const entries = await getCollection(collectionName as any, (entry: any) => {
    return entry.data.draft !== true
  })

  const baseUrl = MENU_COLLECTIONS.find(c => c.collectionName === collectionName)?.baseUrl ?? `/${collectionName}`

  const sorted = [...entries].sort((a: any, b: any) => {
    const dateA = a.data.date ? new Date(a.data.date).valueOf() : slugToTimestamp(a.slug)
    const dateB = b.data.date ? new Date(b.data.date).valueOf() : slugToTimestamp(b.slug)
    if (dateB !== dateA) return dateB - dateA
    return (a.data.sameDateSort ?? 0) - (b.data.sameDateSort ?? 0)
  })

  return sorted.map((entry: any, index: number) => {
    const prevEntry = sorted[index + 1] ?? null
    const nextEntry = sorted[index - 1] ?? null

    const prev: NavLink = prevEntry
      ? { title: prevEntry.data.title ?? 'Untitled', href: `${baseUrl}/${prevEntry.slug}` }
      : null
    const next: NavLink = nextEntry
      ? { title: nextEntry.data.title ?? 'Untitled', href: `${baseUrl}/${nextEntry.slug}` }
      : null

    return {
      params: { slug: entry.slug },
      props: { entry, prev, next },
    }
  })
}
