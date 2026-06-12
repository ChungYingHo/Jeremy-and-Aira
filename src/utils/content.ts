import { getCollection, type CollectionEntry } from 'astro:content'
import type { CollectionType } from '@/models/menu'
import { MENU_COLLECTIONS } from '@/models/menu'
import { parseDateFromSlug } from '@/utils/date'
import { compareSortKeys } from '@/utils/sort'

export type NavLink = { title: string; href: string } | null

type Entry = CollectionEntry<CollectionType>

/** All non-draft entries of a collection. */
export async function getPublishedEntries<T extends CollectionType>(collectionName: T): Promise<CollectionEntry<T>[]> {
  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  return await getCollection(collectionName as any, (entry: any) => entry.data.draft !== true) as CollectionEntry<T>[]
}

/** Publish timestamp: frontmatter date first, falling back to the YYYYMMDD- filename prefix. */
export function entryTimestamp(entry: Entry): number {
  const time = entry.data.date
    ? new Date(entry.data.date).valueOf()
    : parseDateFromSlug(entry.slug)?.valueOf() ?? 0
  return Number.isNaN(time) ? 0 : time
}

function slugGroup(slug: string): string {
  return slug.split('/').slice(0, -1).join('/')
}

export async function generateCollectionPaths(collectionName: CollectionType) {
  const entries = await getPublishedEntries(collectionName)

  const baseUrl = MENU_COLLECTIONS.find(c => c.collectionName === collectionName)?.baseUrl ?? `/${collectionName}`

  const sorted = [...entries].sort((a, b) => compareSortKeys(
    { time: entryTimestamp(a), sameDateSort: a.data.sameDateSort, title: a.data.title ?? '' },
    { time: entryTimestamp(b), sameDateSort: b.data.sameDateSort, title: b.data.title ?? '' },
  ))

  // Prev/next never cross folders: siblings share the same slug prefix
  const siblingsByGroup = new Map<string, Entry[]>()
  for (const entry of sorted) {
    const group = slugGroup(entry.slug)
    const list = siblingsByGroup.get(group)
    if (list) {
      list.push(entry)
    } else {
      siblingsByGroup.set(group, [entry])
    }
  }

  const toNavLink = (entry: Entry | undefined): NavLink =>
    entry ? { title: entry.data.title ?? 'Untitled', href: `${baseUrl}/${entry.slug}` } : null

  return sorted.map((entry) => {
    const siblings = siblingsByGroup.get(slugGroup(entry.slug)) ?? []
    const i = siblings.indexOf(entry)

    return {
      params: { slug: entry.slug },
      props: { entry, prev: toNavLink(siblings[i - 1]), next: toNavLink(siblings[i + 1]) },
    }
  })
}
