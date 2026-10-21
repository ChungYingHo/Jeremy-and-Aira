# 設計系統：紙與墨・自然手帖

最後更新：2026-07-03。2026-06-11 全站從賽博霓虹暗色系改版為文青淺色系，本文件是視覺相關改動的單一參考。

## 色彩 token

定義於 `src/styles/tailwind.css` 的 `@theme`，以 utility class 使用（`bg-paper`、`text-ink`、`border-line`）：

| Token | Hex | 用途 |
| :--- | :--- | :--- |
| `paper` | `#f6f4f0` | 頁面底色 |
| `cream` | `#fcfbf8` | 卡片／面板底色 |
| `ink` / `ink-soft` / `ink-faint` | `#2d2a25` / `#5d574d` / `#8f8a80` | 文字三階 |
| `moss` / `moss-soft` | `#5f7355` / `#8ba07e` | 主色 |
| `clay` | `#b3674a` | 輔色／警示 |
| `line` | `#e4e1da` | 邊框、分隔線 |

**硬規則**：
- 新元件一律用上述 token，**禁止** slate / pink / indigo 等暗色系 class，禁止硬寫 hex（文章配色走 `PostRenderer.astro` 的 `--md-*` CSS 變數）。
- 紙色必須是中性暖白：RGB 三通道差距 ≤ 6。使用者明確嫌過「太黃、有霧感」的米色（#f5f1e8 被退貨）。
- 背景光暈 opacity 壓低（moss/10、clay/5 以下）；內文對比至少 9:1。
- Shiki 主題 `vitesse-light`（`astro.config.mjs`）；code block 底色 `#f9f8f4`（`PostRenderer.astro` 的 `--md-pre-bg`）。

## 字體四層（各司其職，勿混用）

| 層 | 字體 | 用在 |
| :--- | :--- | :--- |
| 簽名／個人聲音 | Caveat 600/700（手寫草寫） | 只有：選單 logo「Jeremy」、首頁 hero 簽名、About 作者名、文章 byline、Blog 副標「Fragments & Musings」 |
| 標題與引言 | Lora + Noto Serif TC（`font-serif`） | h1–h4、引言 |
| 內文 | Inter + Noto Sans TC | 一般文字 |
| 技術 | JetBrains Mono | code、日期、技術標籤 |

- Caveat **絕不用在**：內文、文章標題、TOC、admonition、程式碼、技術 eyebrow 標籤。它只含拉丁字母，中文會 fallback，天然限制在英文品牌短句。
- Caveat 600/700 與 Lora italic 為自託管 woff2（`public/fonts/`，`@font-face` 在 `main.scss`，preload 在 `Layout.astro`）；新增品牌字重時兩處都要更新。其餘字體走 Google Fonts 非同步載入。

## 品牌定位：Jeremy 為主，Solunastre 為從屬

2026-06-11 定案、2026-10-22 工作室更名：本站是 **Jeremy 的個人站**，Solunastre（原名 Aira）是「附屬工作室／第二人格」sub-brand，不是並列作者。

- meta 層純 Jeremy：`Layout.astro` 的 `SITE_NAME = 'Jeremy'`。
- logo／hero：主名「Jeremy」Caveat 大字，旁邊小字 Lora 斜體「solunastre studio」（moss 色），靠字級與顏色做主從。
- `authors.ts` 的 Solunastre Studio 物件以註解保留，勿刪除；About 頁不顯示工作室卡。頭像檔仍為 `public/assets/authors/aira.png`。
- **刻意保留、勿「修正」**：文章程式碼範例裡的 `name: 'Aira'`（只是範例人名）、CDN 路徑 `jeremy-and-aira/...`（改了會破圖）、`package.json` 的 `jeremy-and-aira`（對應 repo 名）、blog `20260215-astro.mdx` 講站名由來（已加註更名）。`models/menu.ts` release-notes 的 title 為 'Solunastre'（空 collection，選單自動隱藏）。
- 「Jeremy & Claude」共同作者署名保留。

## 其他

- 首頁潑漆互動保留，顏料為莫蘭迪色 + `mix-blend-mode: multiply`（水彩疊色感）。
- `ArticleRelated/` 圖表元件已陸續改為淺色 token（2026-07-03 檢查已無 `#0a0a0a` 暗底）；改動或新增圖表元件時一律用本文件 token。
- 視覺取捨拿不準時（顏色、留白、語氣），不要硬拍板：做 2-3 個選項附截圖或說明給使用者選。使用者對視覺細節有明確品味。
