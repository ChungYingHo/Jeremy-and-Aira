# Jeremy & Aira's Tech Blog

這是一個基於 [Astro](https://astro.build) 構建的技術部落格專案，採用了 Content Collections 來管理文章，並透過 TypeScript 進行型別安全的選單生成。

## 🚀 快速開始

所有命令都在專案根目錄執行：

| 命令 | 動作 |
| :--- | :--- |
| `npm install` | 安裝相依套件 |
| `npm run dev` | 啟動本地開發伺服器 (`localhost:4321`) |
| `npm run build` | 建置生產環境版本至 `./dist/` |
| `npm run preview` | 預覽建置後的版本 |

## 📂 專案結構概覽

```text
/
├── public/
├── src/
│   ├── components/      # UI 組件 (Menu, PostRenderer, etc.)
│   ├── content/         # Markdown/MDX 文章內容來源
│   │   ├── blog/
│   │   ├── notes/
│   │   ├── series/
│   │   └── config.ts    # 定義 Content Collections Schema
│   ├── layouts/         # 頁面佈局 (Layout.astro)
│   ├── models/          # 型別定義與設定檔 (menu.ts)
│   ├── pages/           # 路由定義 (index, blog/, notes/, etc.)
│   ├── styles/          # 全域樣式 (Tailwind, SCSS)
│   └── utils/           # 工具函式 (content.ts, useMenu.ts)
└── astro.config.mjs
```

## 📖 開發指南：如何新增一個新的內容區塊 (Route)
如果想要新增一個新的文章類別（例如：project），請依照以下步驟執行：

### 步驟 1：定義資料結構 Schema
前往 src/content/config.ts，定義新的 Collection schema 並匯出。

```TypeScript
// src/content/config.ts

// ... (省略前面的 schema 定義)

// 1. 定義新的 Collection
const projectCollection = defineCollection({
  type: 'content',
  schema: commonSchema, // 或者定義專屬的 schema
});

// 2. 加入 export 列表
export const collections = {
  'notes': notesCollection,
  'series': seriesCollection,
  'blog': blogCollection,
  'project': projectCollection, // <--- 新增這一行
};
```

### 步驟 2：更新型別與選單設定
前往 `src/models/menu.ts`，這是一個單一信任源 (Single Source of Truth)，負責管理全站的路由型別與選單結構。

```TypeScript
// src/models/menu.ts

// 1. 在 CollectionType 加入新的名稱
export type CollectionType = 'notes' | 'series' | 'blog' | 'project'; // <--- 新增 'project'

// ... (省略中間程式碼)

// 2. 在設定檔中加入選單資訊
export const MENU_COLLECTIONS: MenuCollectionConfig[] = [
  { collectionName: 'blog', title: 'Blog', baseUrl: '/blog' },
  { collectionName: 'notes', title: 'Notes', baseUrl: '/notes' },
  { collectionName: 'series', title: 'Series', baseUrl: '/series' },
  // <--- 新增下面這一行
  { collectionName: 'project', title: 'Projects', baseUrl: '/project' }, 
];
```
注意：只要在這裡新增設定，側邊欄選單 (Menu) 就會自動讀取並產生連結，無需修改 `Menu.svelte` 或 `useMenu.ts` 的邏輯。

### 步驟 3：建立 Markdown 內容資料夾
在 src/content/ 下建立對應的資料夾：

```Plaintext
src/content/project/
  ├── my-cool-app.md
  └── another-work.md
```

### 步驟 4：建立頁面路由
Astro 使用檔案系統路由，需要在 `src/pages/` 建立對應的資料夾與檔案。

#### A. 建立列表頁 (`src/pages/project/index.astro`)
負責列出該分類下的所有文章。

```
---
import Layout from '@/layouts/Layout.astro';
import { getCollection } from 'astro:content';

// 抓取 project 集合
const posts = await getCollection('project', ({ data }) => {
  return data.draft !== true;
});
// ... (後續排序與渲染邏輯參考 src/pages/blog/index.astro)
---
<Layout title="Projects">
</Layout>
```

#### B. 建立內頁 (`src/pages/project/[...slug].astro`)
負責渲染單篇文章內容。記得更新 `PostRenderer` 的 Props 型別。

先修改 `src/components/PostRenderer.astro` 的 Props：

```
interface Props {
  entry: CollectionEntry<'notes'> | ... | CollectionEntry<'project'>; // <--- 加入 project
}
```

建立 `src/pages/project/[...slug].astro`：

```
---
import { generateCollectionPaths } from '@/utils/content';
import PostRenderer from '@/components/PostRenderer.astro';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  // 這裡傳入 'project'
  return generateCollectionPaths('project');
}

type Props = {
  entry: CollectionEntry<'project'>;
}

const { entry } = Astro.props;
---

<PostRenderer entry={entry} />
```

## 🛠️ 常見問題
Q: 為什麼新增了 Collection 但 TypeScript 報錯？
A: 嘗試重新啟動開發伺服器 (`Ctrl+C` 然後 `npm run dev`)。Astro 需要重新掃描 `src/content/config.ts` 來自動產生 `.astro/types.d.ts` 中的型別定義。

Q: Blog 的排序邏輯在哪裡？
A: Blog 的特殊排序（包含從檔名解析日期）邏輯寫在 `src/pages/blog/index.astro` 中。

---

## 📋 Changelog

### 2026-03-16 — 導入 Claude Code

從本日起，開始使用 [Claude Code](https://claude.ai/claude-code) 輔助開發。
此日期之前的所有程式碼均為手寫（hand-crafted）。