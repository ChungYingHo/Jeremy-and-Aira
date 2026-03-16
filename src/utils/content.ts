import { getCollection } from 'astro:content'
import type { CollectionType } from '@/models/menu'
import { MENU_COLLECTIONS } from '@/models/menu'

export type NavLink = { title: string; href: string } | null

function slugToTimestamp(slug: string): number {
  const parts = slug.split('/')
  const filename = parts[parts.length - 1]
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})-/)
  if (match) return new Date(`${match[1]}-${match[2]}-${match[3]}`).valueOf()
  return 0
}

function slugGroup(slug: string): string {
  const parts = slug.split('/')
  return parts.slice(0, -1).join('/')
}

export async function generateCollectionPaths(collectionName: CollectionType) {
  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  const entries = await getCollection(collectionName as any, (entry: any) => {
    return entry.data.draft !== true
  })

  const baseUrl = MENU_COLLECTIONS.find(c => c.collectionName === collectionName)?.baseUrl ?? `/${collectionName}`

  // Sort ascending (oldest first) with same tiebreakers as useMenu
  const sorted = [...entries].sort((a: any, b: any) => {
    const dateA = a.data.date ? new Date(a.data.date).valueOf() : slugToTimestamp(a.slug)
    const dateB = b.data.date ? new Date(b.data.date).valueOf() : slugToTimestamp(b.slug)
    if (dateA !== dateB) return dateA - dateB
    const sortDiff = (a.data.sameDateSort ?? 0) - (b.data.sameDateSort ?? 0)
    if (sortDiff !== 0) return sortDiff
    return (a.data.title ?? '').localeCompare(b.data.title ?? '')
  })

  return sorted.map((entry: any) => {
    const group = slugGroup(entry.slug)
    const siblings = sorted.filter((e: any) => slugGroup(e.slug) === group)
    const i = siblings.findIndex((e: any) => e.slug === entry.slug)

    const prevEntry = siblings[i - 1] ?? null
    const nextEntry = siblings[i + 1] ?? null

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
