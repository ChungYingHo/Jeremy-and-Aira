import type { MenuItem, MenuGroup } from '@/models/menu'
import { MENU_COLLECTIONS, type CollectionType } from '@/models/menu'
import { getCollection, type CollectionEntry } from 'astro:content'
import { SERIES_LABELS } from '@/constants/seriesLabels'

/**
 * 移除日期前綴
 */
function removeDatePrefix(fileSegment: string): string {
  return fileSegment.replace(/^\d{8}-/, '')
}

/**
 * 轉為可讀標題
 */
function humanizeSegment(pathSegment: string): string {
  const segmentWithoutDate = removeDatePrefix(pathSegment)
  const withSpaces = segmentWithoutDate.replace(/[-_]/g, ' ')
  return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * 決定 Collection Entry 的標題
 */
function resolveEntryTitle(entry: CollectionEntry<CollectionType>): string {
  const data = entry.data as any
  if (data.title) return data.title
  
  const slugParts = entry.slug.split('/')
  const fileName = slugParts[slugParts.length - 1]
  return humanizeSegment(fileName)
}

/**
 * 遞迴查找或建立 Group
 */
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

/**
 * 將 Entry 插入樹狀結構
 */
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
      })
    } else {
      // 💡 關鍵修改：優先去 SERIES_LABELS 裡面找對應的中文標題，找不到才使用預設的 humanizeSegment
      const groupTitle = (SERIES_LABELS as Record<string, string>)[segment] || humanizeSegment(segment)
      
      const group = getOrCreateGroup(currentLevelItems, groupTitle)
      currentLevelItems = group.children
    }
  })
}

/**
 * 遞迴排序：Page 優先，其次 Group，最後依字母
 */
function sortMenuTree(menuItems: MenuItem[]): void {
  menuItems.sort((a, b) => {
    // 1. Page 優先，其次 Group
    if (a.type !== b.type) {
      return a.type === 'page' ? -1 : 1
    }

    if (a.type === 'group' && b.type === 'group') {
      const getWeight = (title: string) => {
        const t = title.toLowerCase()
        if (t === 'notes') return 1
        if (t === 'languages') return 2
        return 99
      }
      
      const weightA = getWeight(a.title)
      const weightB = getWeight(b.title)

      if (weightA !== weightB) {
        return weightA - weightB
      }
    }

    return a.title.localeCompare(b.title)
  })

  for (const item of menuItems) {
    if (item.type === 'group') {
      sortMenuTree(item.children)
    }
  }
}

/**
 * 建構 Collection 樹狀選單
 * [修正 TS 錯誤] 將 filter 參數宣告為 (entry: any)，避免 unknown 解構錯誤
 */
async function buildTreeFromCollection(
  name: CollectionType,
  baseUrl: string
) {
  const tree: MenuItem[] = []
  
  // 這裡使用 entry: any 是解決 TS 多載錯誤最直接的方法
  const entries = await getCollection(name as any, (entry: any) => {
    return entry.data.draft !== true
  })

  for (const entry of entries) {
    insertEntryIntoTree(tree, entry as CollectionEntry<CollectionType>, baseUrl)
  }

  sortMenuTree(tree)

  return tree
}

/**
 * 定義靜態頁面
 */
function getStaticPages(): MenuItem[] {
  return [
    { type: 'page', title: 'About', href: '/about' },
  ]
}

/**
 * Public API: 整合 Static Pages 與 Collections
 */
export async function useMenu() {
  const staticPages = getStaticPages()

  // 1. 動態讀取 menu.ts 的設定
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
