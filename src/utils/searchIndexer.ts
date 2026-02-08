import type { SearchIndexItem } from '@/models/search'

/**
 * 移除 Markdown 語法，保留純文字
 */
function sanitizeMarkdown(markdown: string): string {
  return markdown
    .replace(/---[\s\S]*?---/g, '') // 移除 Frontmatter
    .replace(/#{1,6}\s/g, '')        // 移除標題 Header
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除粗體
    .replace(/(\*|_)(.*?)\1/g, '$2')    // 移除斜體
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除連結 [text](url) -> text
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')    // 移除圖片
    .replace(/`{3}[\s\S]*?`{3}/g, '') // 移除程式碼區塊
    .replace(/`(.+?)`/g, '$1')        // 移除行內程式碼
    .replace(/\n/g, ' ')              // 換行轉空白
    .replace(/\s+/g, ' ')             // 合併多餘空白
    .trim()
}

/**
 * 解析 Frontmatter (簡單實作，不依賴額外套件)
 */
function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n/)
  if (!match) return null
  
  const frontmatterStr = match[1]
  const titleMatch = frontmatterStr.match(/title:\s*(.*)/)
  const descMatch = frontmatterStr.match(/description:\s*(.*)/)
  
  return {
    title: titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : 'Untitled',
    description: descMatch ? descMatch[1].trim().replace(/^['"]|['"]$/g, '') : ''
  }
}

/**
 * 建構搜尋索引
 */
export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const items: SearchIndexItem[] = []

  // 1. 抓取 src/pages 下的 .md 檔案 (直接對應路由)
  // eager: true 讓 Vite 在編譯時就讀取內容
  const pageFiles = import.meta.glob('/src/pages/**/*.md', { as: 'raw', eager: true })

  // 2. 抓取 src/content 下的 .md 檔案 (通常是集合)
  const contentFiles = import.meta.glob('/src/content/**/*.md', { as: 'raw', eager: true })

  // 處理 Pages
  for (const path in pageFiles) {
    const rawContent = pageFiles[path] as unknown as string
    const meta = parseFrontmatter(rawContent)
    const plainText = sanitizeMarkdown(rawContent)
    
    // Pages 的 Slug 通常就是檔案路徑 (去除 /src/pages 和 .md)
    const slug = path
      .replace('/src/pages', '')
      .replace('.md', '')
      .replace('/index', '') // 處理 /about/index.md -> /about

    if (meta) {
      items.push({
        title: meta.title,
        slug: slug || '/', // 避免空字串
        content: plainText.slice(0, 5000), // 限制索引長度
        description: meta.description || plainText.slice(0, 100) + '...',
        type: 'Page'
      })
    }
  }

  // 處理 Content Collections
  for (const path in contentFiles) {
    const rawContent = contentFiles[path] as unknown as string
    const meta = parseFrontmatter(rawContent)
    const plainText = sanitizeMarkdown(rawContent)

    // Content 的 Slug 處理比較彈性，通常是資料夾名稱或檔名
    // 假設結構是 /src/content/posts/article-1.md -> slug: /posts/article-1
    const parts = path.split('/')
    const collectionName = parts[parts.length - 2] // 例如 'posts'
    const fileName = parts[parts.length - 1].replace('.md', '')
    
    const slug = `/${collectionName}/${fileName}` 

    if (meta) {
      items.push({
        title: meta.title,
        slug: slug,
        content: plainText.slice(0, 5000),
        description: meta.description || plainText.slice(0, 100) + '...',
        type: 'Article' // 或根據 collectionName 動態給予 (e.g. 'Blog', 'Project')
      })
    }
  }

  return items
}
