# Jeremy

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Jeremy 的個人部落格，收藏生活、思考與書寫。保留既有技術文章，不以作者職業作首頁預設。

## Capabilities and Constraints

- Astro 5 靜態網站；Svelte 保留於共用 Menu／Search 及既有文章互動，首頁滴墨為原生 WebGL 元件。
- Blog、TechBook、release-notes 的文章、共同署名、作者事實、分類與路徑維持，沿用既有內容／日期／排序／路徑 helpers。
- 保留 Pagefind、目錄、前後篇、程式碼、數學式與圖表。
- 直接 master 本地整合，保留前輪 dirty changes；不建立 branch／worktree，不 commit、部署或推送。

## Current Brand and Navigation

- Jeremy 是站名；Solunastre Studio 是指定小標，不另造 by／並列作者關係。
- 正式首頁為持續滴墨、水波與暈染；首屏以100lvh最大視窗高度為下限，覆蓋Safari透明工具列後方；含小型品牌、共用Header及完整三句「雪沫乳花浮午盞，蓼茸蒿筍試春盤。人間有味是清歡。」。高度保留100vh／100svh／100dvh備援，最小高度保留100vh備援且不受flex壓縮。前兩句輕量、末句為唯一H1，單一細線「閱讀更多」入口連到/about，不放巨大重複Jeremy。
- 首頁、Blog、About、文章共用同一 Header。Water Brush 400 的 Jeremy、Studio 小標、字級、對齊及導覽次序一致；只有首頁頂部透明、內頁紙白的背景變體。Footer、向量字標與J favicon採同一字體來源。
- 導覽維持實際內容：桌機About／TechBook／Blog／Search／Music，音樂單鍵固定在搜尋右側；<1024px的Header只留品牌與44px漢堡，MENU內提供About／TechBook分類／Blog直連及48px搜尋、音樂橫列。搜尋關閉或Escape回到可見漢堡；Blog是隨筆入口，不改稱泛用「開始閱讀」。
- 〈人間有味是清歡〉為全站Layout頁背景音樂，預設啟用、音量0.12；訪客可用Header單鍵關閉並保留偏好。ClientRouter與持續Audio節點維持一般站內切頁播放；若瀏覽器拒絕初次播放，等待真實點擊／按鍵再試，介面呈現實際播放或等待狀態。
- 所有品牌連結回 `/`；正式站不保留未採用的提案頁、場景或畫作。
- 墨藍／象牙白／板岩色；禁用綠色、雲海與已否決花草首頁，沒有額外細 J／桃色方塊或巨大第二字標。
- 品牌採自託管Water Brush 400，詩句採真正草書Kouzan Brush Sousho 400；一般文字仍用Urbanist／Noto Sans TC。資產、來源與授權保留於public/fonts，不宣稱為新客製字型。
- 手機首頁詩句前兩行24px／窄屏22px、主句34–40px／窄屏33px，採24–30px光學內縮並適度下移；<=620px橫向或<=480px超短視窗維持compact版，568px直式仍用放大字級，Header尺寸及單一閱讀更多入口不變。
- 「最近的書寫」合併Blog與TechBook，沿用共用日期／排序helpers，依時間倒序、同日排序與標題正序選最新六筆，標記「日常／筆記」；不為Blog強留配額。
- About以引言／原色照片、正文／聯絡及作品三層重排，頁面標題為About、照片下方不重複Jeremy姓名，保留圖片alt、原始作者事實與所有既有作品；新增使用者提供的「昭離工作室｜Solunastre Studio」https://solunastre.com/，描述為其個人工作室，專門放自製商業產品。
- 游標維持原生箭頭、文字I-beam與連結pointer；舊綠色跟隨游標元件未掛載，本輪僅評估而未改動游標。

## Product Principles

- 少字、主視覺與閱讀入口關係清楚，跨頁保持同一品牌與操作。
- 每滴墨有不同輪廓、方向與流動參數，動畫不影響文字、正常滑動或閱讀。
- 減動／無 JS／無 WebGL 有靜態畫面；離屏暫停與 GPU 清理保留。
- 不編造職業、履歷、作品、統計或文章事實。
- 最新詩句／合併書寫／About整批QA2331實跑exit0；後續英文草書品牌整合build96337／143頁、whole lint／diff及限定品牌QA53281均exit0。五尺寸與四路由共用身份已驗，證據與前輪歷史分開記於DESIGN，不把技術通過當作審美接受、外站內容驗證、實機效能或部署。
