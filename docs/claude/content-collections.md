# Content Collections 操作手冊

最後更新：2026-07-03。新增文章、新增 collection、frontmatter 規範與常見問題都在這裡。

## Frontmatter Schema

```typescript
title?: string        // 預設 "Untitled"
author?: string       // 預設 "Jeremy"
date?: Date | string
tags?: string[]       // 預設 []
draft?: boolean       // 預設 false；true 則不顯示於列表
changelog?: Date[] | string[]
sameDateSort?: number // 同日期文章排序微調，預設 0
```

檔名格式：`YYYYMMDD-slug.mdx`（日期前綴用於排序，`parseDateFromSlug()` 會解析它）。

## 現有 collections

| Collection | 資料夾 | 路由 | 備註 |
| :--- | :--- | :--- | :--- |
| blog | `src/content/blog/` | `/blog` | 列表新到舊（與選單、prev/next 的舊到新相反），方向寫在 `src/pages/blog/index.astro` |
| techbook | `src/content/techbook/` | `/techbook` | 軟體開發筆記；`languages/`（程式語言）與 `series/`（iThome 鐵人賽）是其子資料夾，不是獨立 collection。歷史：notes → codex → techbook 兩度更名 |
| release-notes | `src/content/release-notes/` | — | 目前無內容；`useMenu` 自動過濾空 group，選單 'Solunastre' 按鈕不會出現 |

## 新增一個 collection 的步驟（依序）

1. `src/content/config.ts` — 定義 schema 並加入 `export const collections`
2. `src/models/menu.ts` — 在 `CollectionType` union 加入新名稱，並在 `MENU_COLLECTIONS` 加入設定
3. `src/content/<name>/` — 建立 MDX 內容資料夾
4. `src/pages/<name>/[...slug].astro` — 內頁（使用 `generateCollectionPaths`）
5. `src/components/PostRenderer.astro` — 在 Props 的 `CollectionEntry` union 加入新類型
6. 重新啟動 dev server（Astro 才會重新產生 `.astro/types.d.ts`）

注意：
- 選單自動根據 `MENU_COLLECTIONS` 生成，**不要**改 `Menu.svelte` 或 `useMenu.ts`。
- 空 collection 的選單項目自動隱藏。Blog 是例外：在 `useMenu.ts` 特例處理為直連 `/blog` 的 page link，需要 `src/pages/blog/index.astro`；其他 collection 用 drilldown 選單，不需要 index 頁。
- 系列顯示名稱：`src/constants/seriesLabels.ts` 定義 slug → 顯示標題，drilldown 選單優先取用。

## MDX 內容規範

- **禁 ASCII art**（樹狀 `↙ ↘`、`+---+` boxes、多行流程圖）：手機版 `<pre>` 會水平溢出。需要圖示用 `src/components/ArticleRelated/` 的 Svelte component，沒有合適的就新寫一個。單行短箭頭（`A → B → C`）寫在內文可以。
- 數學：remark-math + rehype-katex，直接寫 LaTeX；`katex.min.css` 由 `PostRenderer.astro` 載入（僅文章頁），不要搬回 Layout。
- Admonition：`:::note`、`:::warning`、`:::tip`、`:::danger`、`:::info`。

## 常見問題

- **新增 collection 後 TypeScript 報錯** → 重啟 dev server，Astro 會重新掃描 config 更新 `.astro/types.d.ts`。
- **新文章沒出現在列表** → 檢查 frontmatter `draft` 不是 `true`，且檔案在正確的 collection 資料夾。
- **選單 active state 不正確** → 路徑正規化在 `src/utils/readPath.ts` 的 `normalizePath()`。
- **Prev/Next 導覽**只含同一資料夾下的兄弟文章（相同 slug 前綴），不跨子資料夾——這是 `generateCollectionPaths()` 的刻意設計，不是 bug。
