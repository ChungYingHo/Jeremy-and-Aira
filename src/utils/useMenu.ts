import type { MenuItem, MenuGroup } from '@/models/menu'
import { MENU_COLLECTIONS, type CollectionType } from '@/models/menu'
import { getCollection, type CollectionEntry } from 'astro:content'

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
      const groupTitle = humanizeSegment(segment)
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
    if (a.type !== b.type) {
      return a.type === 'page' ? -1 : 1
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
    
    // [新功能] 如果是 Blog，直接回傳 Page 類型 (不建立樹狀選單)
    if (config.title === 'Blog') {
      return {
        type: 'page' as const,
        title: config.title,
        href: config.baseUrl // 直接連到 /blog
      }
    }

    // 其他 (Notes, Series) 繼續建立樹狀選單
    const tree = await buildTreeFromCollection(config.collectionName, config.baseUrl)
    return {
      type: 'group' as const,
      title: config.title,
      children: tree
    }
  })

  const collectionMenus = await Promise.all(collectionMenusPromises)

  // 2. 過濾邏輯調整
  // 保留 'page' 類型的 Item (如 Blog)，
  // 對於 'group' 類型，則檢查是否有 children
  const validCollectionMenus = collectionMenus.filter(item => {
    if (item.type === 'page') return true
    return item.children && item.children.length > 0
  })

  // 3. 強制排序：讓 "Blog" 永遠排在最後面
  validCollectionMenus.sort((a, b) => {
    if (a.title === 'Blog') return 1
    if (b.title === 'Blog') return -1
    return 0
  })

  const fullMenu = [...staticPages, ...validCollectionMenus]

  return { menu: fullMenu }
}
