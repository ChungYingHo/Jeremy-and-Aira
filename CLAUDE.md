# CLAUDE.md — Jeremy & Aira Tech Blog

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
│   ├── authors.ts          # 作者資料（Jeremy、Aira Studio）
│   └── seriesLabels.ts     # 系列名稱對應表
├── content/                # Astro Content Collections（MDX 文章）
│   ├── blog/
│   ├── languages/
│   ├── notes/
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
    ├── date.ts             # formatDate()
    ├── readPath.ts         # normalizePath()（路由比對用）
    └── useMenu.ts          # useMenu()（動態選單生成）
```

---

## 內容規範

### 檔名格式
`YYYYMMDD-slug.mdx`（日期前綴用於排序）

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
4. **`src/pages/<name>/index.astro`** — 列表頁
5. **`src/pages/<name>/[...slug].astro`** — 內頁（使用 `generateCollectionPaths`）
6. **`src/components/PostRenderer.astro`** — 在 Props 的 `CollectionEntry` union type 加入新類型
7. 重新啟動 dev server（讓 Astro 重新產生 `.astro/types.d.ts`）

> 選單會自動根據 `MENU_COLLECTIONS` 生成，無需修改 `Menu.svelte` 或 `useMenu.ts`。

---

## 關鍵架構決策

| 項目 | 說明 |
| :--- | :--- |
| **Svelte for 互動組件** | Menu 與 Search 使用 Svelte，其餘為 Astro（zero-JS 優先） |
| **`src/models/menu.ts` 是 SSOT** | 所有路由型別與選單資料集中於此，不要分散 |
| **Blog 排序特殊處理** | 排序邏輯（含從檔名解析日期）寫在 `src/pages/blog/index.astro`，非通用 utils |
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
