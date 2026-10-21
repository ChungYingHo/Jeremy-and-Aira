# AGENTS.md

This file is the canonical, tool-neutral guidance for anyone or any automation working with code in this repository.

> **審核規則：每次的調整都將由 antigravity 與 codex 進行審核。**
> **摘要規則：每次回答的最後，須以繁體中文撰寫一段摘要（一段以內），以「親愛的 AIra 」作為開頭。**

---

## 專案概觀

**Jeremy 的技術部落格**（Aira 為附屬 sub-brand，非並列作者）。Astro 5 靜態站 + Svelte 5 互動組件 + Tailwind CSS 4 / DaisyUI 5，部署 Vercel。2026-06 起為「紙與墨」淺色設計系統。

```bash
npm run dev      # localhost:4321
npm run build    # 建置至 ./dist/
npm run preview  # 預覽建置結果
```

## 延伸文件（符合觸發條件才讀）

| 觸發條件 | 讀這個檔 |
| :--- | :--- |
| 改動任何視覺／顏色／字體／品牌呈現 | `docs/claude/design-system.md` |
| 新增文章、新增 collection、frontmatter 或 MDX 語法問題 | `docs/claude/content-collections.md` |

## 程式碼風格（ESLint 強制，勿違反）

- **單引號**、**不加分號**、**2 空格縮排**
- `import type { T }` 用 inline type import
- 禁止相對父層引用（`../`），一律 `@/` alias（指向 `src/`）
- 禁止 `var`；等值比較用 `===`；未使用變數以 `_` 前綴

## 不要重複造輪子（改碼前先查這張表）

| 需求 | 用這個，不要自己寫 |
| :--- | :--- |
| 日期顯示／解析檔名日期 | `src/utils/date.ts`：`formatDisplayDate()`（→ `2025.01.01`）、`parseDateFromSlug()` |
| 取文章列表 | `getPublishedEntries(name)`（`src/utils/content.ts`）——全專案唯一允許 `as any` 之處；不要直接呼叫 `getCollection` |
| 發布時間戳 | `entryTimestamp(entry)`（frontmatter date 優先，退回檔名前綴） |
| 排序 | `compareSortKeys(a, b)`（`src/utils/sort.ts`）：date → sameDateSort → title |
| 進場動畫／細滑桿 | `main.scss` 的 `.animate-fade-in-up`、`.custom-scrollbar`（`Menu.svelte` 的苔綠版覆蓋是刻意設計） |
| 路徑比對 | `normalizePath()`（`src/utils/readPath.ts`） |

型別：`Author` 在 `src/constants/authors.ts`；`CollectionType`、`MenuItem` 在 `src/models/menu.ts`（**SSOT**——所有路由型別與選單設定集中於此，勿分散）。

## 關鍵架構決策

- **Svelte 只用於 Menu 與 Search**，其餘 Astro（zero-JS 優先）。`Menu.svelte` / `DrilldownMenu.svelte` 勿輕易改動邏輯。
- **Tailwind 4 無獨立設定檔**：Tailwind 與 DaisyUI 在 `astro.config.mjs` 的 Vite plugin 設定；色彩 token 在 `src/styles/tailwind.css` 的 `@theme`。
- **文章配色只用 CSS 變數**：`PostRenderer.astro` 用全站 token（`--color-*`、`--font-*`）與文章專用 `--md-*`（該檔頂部 `:root`），透明變化用 `color-mix()`；改色票不要逐字搜換 hex。
- **搜尋**：Pagefind 靜態索引，build 時生成。
- **部署**：Vercel static adapter + Web Analytics + Image Service；GA4 已接（G-X57D2M0BZX）。

## 注解規範

- 不加分組注解（`// === 1. XXX ===`）、不加重複程式碼意圖的注解、不加表情符號注解、不加修正歷程標記（`// [修正]`）。
- 必要的 workaround 用一行簡短英文說明。JSDoc 只在 public API 或邏輯不自明時才加。
