# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **審核規則：每次的調整都將由 antigravity 與 codex 進行審核。**
> **摘要規則：每次回答的最後，須以繁體中文撰寫一次摘要，並以「親愛的 AIra 」作為開頭。**

---

# Jeremy & Aira Tech Blog

技術部落格專案，基於 **Astro 5** 靜態網站生成器，搭配 **Svelte 5** 互動組件、**Tailwind CSS 4 + DaisyUI 5**，部署至 Vercel。

---

## 開發指令

```bash
npm run dev      # 啟動開發伺服器 localhost:4321
npm run build    # 建置至 ./dist/
npm run preview  # 預覽建置結果
```

---

## 程式碼風格規範

由 ESLint (`eslint.config.js`) 強制執行，勿違反：

- **單引號**，**不加分號**，**2 空格縮排**
- `import type { T }` 必須使用 inline type import
- 禁止相對父層引用 (`../`)，一律用 `@/` alias（指向 `src/`）
- 禁止 `var`，只用 `const` / `let`
- 等值比較一律用 `===`
- 未使用的變數/參數以 `_` 前綴命名

---

## 目錄結構重點

```
src/
├── components/
│   ├── ArticleRelated/   # 文章內嵌組件 (BigOChart, CodePen, YouTube)
│   ├── Menu/             # Menu.svelte + DrilldownMenu.svelte（Svelte，勿輕易改動邏輯）
│   ├── Search/           # SearchBtn.svelte, SearchPanel.svelte（Pagefind）
│   ├── CustomCursor.astro
│   └── PostRenderer.astro  # 所有文章類型的統一渲染組件
├── constants/
│   ├── authors.ts          # 作者資料 + Author 型別（Jeremy、Aira Studio）
│   └── seriesLabels.ts     # 系列名稱對應表
├── content/                # Astro Content Collections（MDX 文章）
│   ├── blog/
│   ├── notes/              # CS 筆記（含 languages/ 子資料夾）
│   │   └── languages/      # 程式語言筆記（原為獨立 collection，已合併入 notes）
│   ├── release-notes/      # Aira Studio 作品 release notes（目前無內容）
│   ├── series/
│   └── config.ts           # Collection schema 定義
├── layouts/
│   └── Layout.astro        # 全站 master layout
├── models/
│   └── menu.ts             # ⚠️ 單一信任源：路由型別 + 選單設定
├── pages/                  # 檔案系統路由
├── styles/
│   ├── tailwind.css
│   └── main.scss
└── utils/
    ├── content.ts          # generateCollectionPaths()
    ├── date.ts             # formatDate()、formatDisplayDate()
    ├── readPath.ts         # normalizePath()（路由比對用）
    └── useMenu.ts          # useMenu()（動態選單生成）
```

---

## 共用工具與樣式

### 日期格式化

`src/utils/date.ts` 提供兩種格式，**不要在元件裡自行定義 date formatter**：

| 函式 | 輸出範例 | 使用場景 |
| :--- | :--- | :--- |
| `formatDate(date)` | `January 1, 2025` | 英文長格式（en-US） |
| `formatDisplayDate(date)` | `2025.01.01` | 文章標頭、changelog（zh-TW） |

### 共用樣式

`src/styles/main.scss` 包含以下全站共用樣式，**不要在個別頁面或元件裡重複定義**：

- `.animate-fade-in-up` — 頁面進場動畫
- `.custom-scrollbar` — 覆蓋面板、TOC sidebar 等的細滑桿樣式
  - 注意：`Menu.svelte` 以 Svelte scoped CSS 覆蓋為粉色版本，屬刻意設計

### 型別

- **`Author`** — 定義在 `src/constants/authors.ts`，新增作者欄位請先更新型別
- **`CollectionType`**、`MenuItem` 等 — 定義在 `src/models/menu.ts`（SSOT）

---

## 注解規範

- **不加無意義的分組注解**，例如 `// === 1. XXX ===`、`// --- Section ---`
- **不加只是重複程式碼意圖的注解**，例如 `/* H2: 章節標題 */`（CSS 已自明）
- **不加表情符號注解**，例如 `// 🌟 引入共用函式`
- **不加修正歷程標記**，例如 `// [修正]`、`// [1]`；有必要說明的 workaround 用一行簡短英文說明，例如：
  ```ts
  // `as any` bypasses Astro's overloaded getCollection type — intentional workaround
  ```
- JSDoc 只在 public API 或邏輯不自明時才加，不要對每個私有 helper 都加

---

## 內容規範

### 檔名格式
`YYYYMMDD-slug.mdx`（日期前綴用於排序）

### 圖示規範：禁用 ASCII art，優先 Svelte component

- **不要在 MDX 裡畫 ASCII 圖**（例如樹狀結構的 `↙ ↘`、流程圖的 `→`、boxes 用 `+---+`）。ASCII art 在手機版的 `<pre>` 會水平溢出跑版。
- 需要圖示一律用 `src/components/ArticleRelated/` 底下的 Svelte component；沒有適合的就新寫一個，而不是退回 ASCII。
- 純文字流程（單行短箭頭，如 `A → B → C`）仍可直接寫在內文中，不受此規則限制。

### Frontmatter Schema
```typescript
title?: string       // 預設 "Untitled"
author?: string      // 預設 "Jeremy"
date?: Date | string
tags?: string[]      // 預設 []
draft?: boolean      // 預設 false；true 則不顯示於列表
changelog?: Date[] | string[]
sameDateSort?: number // 同日期文章排序微調，預設 0
```

---

## 新增 Content Collection 流程

新增一個文章類別（例如 `project`）需依序完成以下步驟：

1. **`src/content/config.ts`** — 定義 schema 並加入 `export const collections`
2. **`src/models/menu.ts`** — 在 `CollectionType` union type 加入新名稱，並在 `MENU_COLLECTIONS` 陣列加入設定
3. **`src/content/<name>/`** — 建立 MDX 內容資料夾
4. **`src/pages/<name>/[...slug].astro`** — 內頁（使用 `generateCollectionPaths`）
5. **`src/components/PostRenderer.astro`** — 在 Props 的 `CollectionEntry` union type 加入新類型
6. 重新啟動 dev server（讓 Astro 重新產生 `.astro/types.d.ts`）

> - 選單會自動根據 `MENU_COLLECTIONS` 生成，無需修改 `Menu.svelte` 或 `useMenu.ts`。
> - **Collection 若無內容，選單項目自動隱藏**（`useMenu` 會過濾空的 group）。Blog 是例外：它在 `useMenu.ts` 被特例處理為直連 `/blog` 的 page link，需要有 `src/pages/blog/index.astro`。其他 collection 使用 drilldown 選單，不需要 index 頁面。

---

## 關鍵架構決策

| 項目 | 說明 |
| :--- | :--- |
| **Svelte for 互動組件** | Menu 與 Search 使用 Svelte，其餘為 Astro（zero-JS 優先） |
| **`src/models/menu.ts` 是 SSOT** | 所有路由型別與選單資料集中於此，不要分散 |
| **Languages 已合併入 Notes** | `src/content/notes/languages/` 是 notes collection 的子資料夾，路由為 `/notes/languages/...`，不再是獨立 collection |
| **Aira 選單自動顯示/隱藏** | `release-notes` collection 目前無內容，`useMenu` 自動過濾空 group，Aira 按鈕不會出現；有內容才會出現 |
| **Blog 排序特殊處理** | 排序邏輯（含從檔名解析日期）寫在 `src/pages/blog/index.astro`，非通用 utils |
| **Prev/Next 導覽限同層** | `generateCollectionPaths()` 的 prev/next 只含同一資料夾下的兄弟文章（相同 slug 前綴），不跨子資料夾 |
| **Tailwind 4 無獨立設定檔** | 無 `tailwind.config.ts`，Tailwind 與 DaisyUI 直接在 `astro.config.mjs` 透過 Vite plugin 設定 |
| **系列顯示名稱覆蓋** | `src/constants/seriesLabels.ts` 定義 slug → 顯示標題的對照表，drilldown 選單優先取用此名稱 |
| **數學支援** | remark-math + rehype-katex，直接在 MDX 中寫 LaTeX |
| **Admonition 語法** | remark-directive 支援 `:::note`、`:::warning`、`:::tip`、`:::danger`、`:::info` |
| **搜尋** | Pagefind 靜態索引，build 時生成，無後端需求 |
| **部署** | Vercel static adapter，含 Web Analytics 與 Image Service |

---

## 常見問題

**新增 Collection 後 TypeScript 報錯？**
重新啟動 dev server（`Ctrl+C` → `npm run dev`），Astro 會重新掃描 config 並更新 `.astro/types.d.ts`。

**路由比對異常（Active state 不正確）？**
路徑正規化邏輯在 `src/utils/readPath.ts` 的 `normalizePath()`，Menu 的 active state 偵測依賴此函式。

**新增了文章但沒出現在列表？**
確認 frontmatter 的 `draft` 不是 `true`，且檔案放在正確的 collection 資料夾內。
