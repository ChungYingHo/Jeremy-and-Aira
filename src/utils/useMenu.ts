import type { MenuItem, MenuGroup } from '@/models/menu'
import { MENU_COLLECTIONS, type CollectionType } from '@/models/menu'
import { getCollection, type CollectionEntry } from 'astro:content'
import { SERIES_LABELS } from '@/constants/seriesLabels'

function removeDatePrefix(fileSegment: string): string {
  return fileSegment.replace(/^\d{8}-/, '')
}

function humanizeSegment(pathSegment: string): string {
  const segmentWithoutDate = removeDatePrefix(pathSegment)
  const withSpaces = segmentWithoutDate.replace(/[-_]/g, ' ')
  return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase())
}

function resolveEntryTitle(entry: CollectionEntry<CollectionType>): string {
  const data = entry.data as any
  if (data.title) return data.title
  
  const slugParts = entry.slug.split('/')
  const fileName = slugParts[slugParts.length - 1]
  return humanizeSegment(fileName)
}

function getOrCreateGroup(
  currentLevelItems: MenuItem[],
  groupTitle: string
): MenuGroup {
  const existingGroup = currentLevelItems.find(
    (item) => item.type === 'group' && item.title === groupTitle
  ) as MenuGroup | undefined

  if (existingGroup) {
    return existingGroup
  }

  const newGroup: MenuGroup = {
    type: 'group',
    title: groupTitle,
    children: [],
  }
  
  currentLevelItems.push(newGroup)
  return newGroup
}

function insertEntryIntoTree(
  menuTree: MenuItem[],
  entry: CollectionEntry<CollectionType>,
  baseUrl: string
): void {
  const pathSegments = entry.slug.split('/')
  let currentLevelItems = menuTree
  const href = `${baseUrl}/${entry.slug}`

  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1

    if (isLast) {
      currentLevelItems.push({
        type: 'page',
        title: resolveEntryTitle(entry),
        href: href,
        date: entry.data.date,
        sameDateSort: entry.data.sameDateSort,
      } as any)
    } else {
      const groupTitle = (SERIES_LABELS as Record<string, string>)[segment] || humanizeSegment(segment)
      
      const group = getOrCreateGroup(currentLevelItems, groupTitle)
      currentLevelItems = group.children
    }
  })
}

// Sort: pages before groups, by date asc, then sameDateSort, then title
function sortMenuTree(menuItems: MenuItem[]): void {
  menuItems.sort((a, b) => {
    if (a.type === 'page' && b.type === 'page') {
      const pageA = a as any
      const pageB = b as any

      if (pageA.date && pageB.date) {
        const timeA = new Date(pageA.date).getTime()
        const timeB = new Date(pageB.date).getTime()
        if (timeA !== timeB) return timeA - timeB
      }

      const sortA = pageA.sameDateSort ?? 0
      const sortB = pageB.sameDateSort ?? 0
      if (sortA !== sortB) return sortA - sortB

      return a.title.localeCompare(b.title)
    }

    if (a.type !== b.type) return a.type === 'page' ? -1 : 1

    if (a.type === 'group' && b.type === 'group') {
      const getWeight = (title: string) => {
        const t = title.toLowerCase()
        if (t === 'notes') return 1
        if (t === 'languages') return 2
        if (t === 'data structure') return 3
        if (t === 'algorithm') return 4
        if (t === 'leetcode') return 5
        return 99
      }
      const weightDiff = getWeight(a.title) - getWeight(b.title)
      if (weightDiff !== 0) return weightDiff
    }

    return a.title.localeCompare(b.title)
  })

  for (const item of menuItems) {
    if (item.type === 'group') sortMenuTree(item.children)
  }
}

async function buildTreeFromCollection(name: CollectionType, baseUrl: string) {
  const tree: MenuItem[] = []

  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  const entries = await getCollection(name as any, (entry: any) => {
    return entry.data.draft !== true
  })

  for (const entry of entries) {
    insertEntryIntoTree(tree, entry as CollectionEntry<CollectionType>, baseUrl)
  }

  sortMenuTree(tree)

  return tree
}

function getStaticPages(): MenuItem[] {
  return [
    { type: 'page', title: 'About', href: '/about' },
  ]
}

export async function useMenu() {
  const staticPages = getStaticPages()

  const collectionMenusPromises = MENU_COLLECTIONS.map(async (config) => {
    if (config.title === 'Blog') {
      return {
        type: 'page' as const,
        title: config.title,
        href: config.baseUrl 
      }
    }

    const tree = await buildTreeFromCollection(config.collectionName, config.baseUrl)
    return {
      type: 'group' as const,
      title: config.title,
      children: tree
    }
  })

  const collectionMenus = await Promise.all(collectionMenusPromises)

  const validCollectionMenus = collectionMenus.filter(item => {
    if (item.type === 'page') return true
    return item.children && item.children.length > 0
  })

  validCollectionMenus.sort((a, b) => {
    const getWeight = (title: string) => {
      const t = title.toLowerCase()
      if (t === 'notes') return 1
      if (t === 'languages') return 2
      if (t === 'blog') return 999
      return 50
    }
    
    return getWeight(a.title) - getWeight(b.title)
  })

  const fullMenu = [...staticPages, ...validCollectionMenus]

  return { menu: fullMenu }
}
