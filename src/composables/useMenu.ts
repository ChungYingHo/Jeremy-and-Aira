import type { MenuItem, MenuGroup } from '@/models/menu'
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
function resolveEntryTitle(entry: CollectionEntry<'notes' | 'series'>): string {
  if (entry.data.title) return entry.data.title
  
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
  entry: CollectionEntry<'notes' | 'series'>,
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
 */
async function buildTreeFromCollection(
  name: 'notes' | 'series',
  baseUrl: string
) {
  const tree: MenuItem[] = []
  
  const entries = await getCollection(name, ({ data }) => {
    return data.draft !== true
  })

  for (const entry of entries) {
    insertEntryIntoTree(tree, entry, baseUrl)
  }

  sortMenuTree(tree)

  return tree
}

/**
 * [新增] 定義靜態頁面 (src/pages/ 下的獨立頁面)
 * 可以在這裡手動加入 About, Contact, 或其他單頁
 */
function getStaticPages(): MenuItem[] {
  return [
    // 如果想要首頁也在選單出現，可以取消下面註解
    // { type: 'page', title: 'Home', href: '/' },
    { type: 'page', title: 'About', href: '/about' },
    // { type: 'page', title: 'Contact', href: '/contact' },
  ]
}

/**
 * Public API: 整合 Static Pages 與 Collections
 */
export async function useMenu() {
  const notesTree = await buildTreeFromCollection('notes', '/notes')
  const seriesTree = await buildTreeFromCollection('series', '/series')

  const staticPages = getStaticPages()

  const collectionsMenu: MenuItem[] = [
    {
      type: 'group' as const,
      title: 'Notes',
      children: notesTree
    },
    {
      type: 'group' as const,
      title: 'Series',
      children: seriesTree
    }
  ].filter(item =>
    item.type === 'group' && item.children.length > 0
  )

  const fullMenu = [...staticPages, ...collectionsMenu]

  return { menu: fullMenu }
}
