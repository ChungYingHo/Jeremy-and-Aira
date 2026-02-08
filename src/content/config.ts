import { z, defineCollection } from 'astro:content'

// 定義共用的資料結構 (Schema)
// 這裡告訴 Astro：我的 Markdown 裡可能會有 title (字串) 和 draft (布林值)
const commonSchema = z.object({
  title: z.string().optional(),
  //如果 draft 是 true，我們會在選單中過濾掉它
  draft: z.boolean().optional(),
  // 如果你有其他欄位 (例如 date, tags, description) 也可以加在這裡
  // date: z.date().optional(),
})

// 定義 'notes' 集合
const notesCollection = defineCollection({
  type: 'content', // v2.5.0+ 之後建議加上這行
  schema: commonSchema,
})

// 定義 'series' 集合
const seriesCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

// 關鍵：匯出 collections 物件
// key 名稱 ('notes', 'series') 必須對應 src/content/ 下的資料夾名稱
export const collections = {
  'notes': notesCollection,
  'series': seriesCollection,
}
