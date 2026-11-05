# Jeremy — 滴墨與全站共用 Header

2026-11-05 最新正式整合版本。使用者要求從其他頁返回首頁仍是滴墨，且 Header 在主頁與內頁一致。先前花草／綠色、巨大字標、獨立原型身份均已被覆蓋。

未採用的提案頁、場景、畫作與字型已移至專案外封存，專案只保留目前採用的來源與素材。以下歷史驗收中的 `.impeccable/` 相對路徑，現在皆以 `%USERPROFILE%/.codex/scratchpad/jeremy-redesign-evidence-20261105/` 為基底；原始截圖及JSON完整保留於該目錄，不納入網站版本。

## 首頁與路由

正式 `/` 使用 InkSurface 的全寬100vh fallback／100svh場景。共用Header在首屏上方，小型Jeremy／Solunastre Studio保持；左側完整呈現「雪沫乳花浮午盞，蓼茸蒿筍試春盤。人間有味是清歡。」。前兩句輕量、末句為唯一H1，詩句全部採Kouzan Brush Sousho 400草書；前兩句桌機26–32px，主句48–56px桌機／36px手機／30px窄屏，短桌機24／46px、短手機18／30px。詩句與Header共用1360px置中版心，響應式邊距56／32／20px。僅留一個細線文字加箭頭的「閱讀更多」到/about。文字區維持pointer-events:none，僅連結接事件；墨可自然暈到詩句背後，3條實際文字Range行框與CTA採局部核心R≤0.16限濃（padding8px／圓角8px／外30px柔邊，僅核心外固定起伏≤3px），pigment及screenUV共用同一冪等限濃helper並同比保留G/R age，防平流與折射堆深。區外及intro空隙仍可自然疊濃，字形另保留24%紙色／10px柔邊，沒有全版veil。pointer幾何排除保留Header、操作面板與實際閱讀更多連結。
下一段「最近的書寫」合併getPublishedEntries的Blog與TechBook，透過entryTimestamp及compareSortKeys依時間倒序、同日sameDateSort與標題正序取最新六筆。ArticleList依MENU_COLLECTIONS產生實際路徑，首頁顯示「筆記／日常」類型；目前六筆皆為較新的TechBook是實際日期排序結果，不另造Blog配額。
品牌首頁連結一律 `/`。不保留未採用的提案路由、獨立 Header、舊場景或花草資產，避免誤回已否決的畫面。

## 一套 Header 與品牌

Layout 載入同一 Menu，首頁、Blog、About、文章與其他 Layout 頁共用身份／導覽。品牌為自託管Water Brush 400的Jeremy，精確小標Solunastre Studio仍用乾淨正文體；沒有額外細J、桃色方塊或舊monoline SVG參與Header。Footer、三份canonical SVG字標及J favicon採相同Water Brush原字形。WOFF2保留kern／liga／calt、來源HarfBuzz排字與原字形對照記錄於public/fonts/water-brush-jeremy.source.json；OFL授權保留，不宣稱為新客製字型。
Header固定可見，桌機112px／手機96px；字標48px／41px，窄屏37px，Footer39px，皆真實400、line-height:1並保留左右4px墨跡空間，不合成700。桌機統一About→TechBook（SSOT分類標題）→Blog→搜尋→音樂；搜尋與音樂為同一工具群，音樂44px單鍵緊接搜尋右側，細分隔位於工具群之前。<1024px的Header只留品牌與最右44px漢堡；MENU先呈現About／TechBook分類／Blog直連，搜尋與音樂各為48px完整橫列，搜尋關閉或Escape回到可見漢堡。Blog是正常內部文字連結，不是「開始閱讀」與外連箭頭。首頁頂端可透明、內頁與捲動後紙白，尺寸／身份／次序跨頁一致。
Notes／Search 保留面板高度上限、翻轉與內部捲動；Escape／關閉返回原觸發器並 preventScroll。面板關閉、Drilldown Back／Top與搜尋清除控制的觸控區至少44px，保留小圖示與原字級。滑鼠／觸控點按非文字控制不顯示焦點外框，鍵盤保留清楚的focus-visible，文字輸入欄仍有焦點提示。讀取核心控制採 client:load。驗法使用原生座標／鍵盤，避免 locator 預捲動假象；drilldown 等250ms過場結束再截圖。

## 全站背景音樂

〈人間有味是清歡〉使用公開MP3副本，來源MP3／WAV及音樂原稿不改。預設啟用，volume先設0.12再指定音源／呼叫play，原生loop；單一音樂鈕可停止／恢復，localStorage保留明確關閉偏好，sessionStorage保留硬導覽的最佳努力播放位置。播放政策拒絕時保留啟用意圖，等待真正click／keydown重試；音樂鈕本身排除全頁重試，等待播放時點鈕直接嘗試開始，實際播放／載入時點鈕關閉。只有actual playing顯示聲波，等待、錯誤與暫停用真實狀態標籤，不假稱已播放。
Layout使用ClientRouter、body不加切頁動畫，固定名稱transition:persist保留同一Audio DOM／原生controller；Menu重掛透過共用事件查詢狀態。PostRenderer以astro:page-load冪等初始化、before-swap清理listener／observer等資源。原生其他媒體play及YouTube自有播放事件暫停背景音樂，下一次page-load才清除暫停；不推定可監聽跨域iframe結束。

## 色彩、字體與閱讀

色彩 SSOT 為 src/styles/tailwind.css：paper #f4f3ef、ink／brand #263248、ink-soft #505e73、line #d0d3d8。舊 moss／teal／sage 名稱只為相容，實際值已改墨藍／板岩，不能據名稱恢復綠色。
一般標題、正文及操作使用 Urbanist／Noto Sans TC；code 用 JetBrains Mono；Iansui 僅留相容輔助 token。詩句Kouzan Brush Sousho的9,164-byte子集涵蓋全部23個獨立字元，原始字形與來源／使用條件保留。正文及 placeholder 對比至少4.5:1，大字3:1。文章標題、正文與前後篇共用上限836px的獨立置中版心，目錄不佔正文寬度；1536px以上以48px間距外掛256px右側目錄，小於1536px且有章節時採底部固定、可展開的目錄，避讓safe-area／visualViewport並讓長目錄內部捲動；列印隱藏底部目錄並移除預留空間。無章節文章維持獨立置中正文。細線目錄／表格／程式碼，避免多彩大卡片與過多標籤膠囊。焦點、caret、選取與 scrollbar 同色系。

Networking三圖與五種排序圖解以局部橫捲保留可讀比例，只有實際溢位才顯示滑動提示並可鍵盤聚焦；排序控制位於捲動區外、觸控區至少44px，不對全站SVG設定最小寬度。

## 關於頁與游標

About以明確標題、引言與原色照片形成介紹區，下方以可讀正文、文字聯絡連結及作品列表分層。600px以下以96–128px照片和右側直列職務形成緊湊身份區，完整引言另起一段，再依序正文、聯絡與作品；601–850px身份置左、引言置右；更寬維持引言／職務左、照片右的桌機配置。AUTHORS原照片、英文簡介、職務、程式語言、四個社群目的地與三個既有作品均保留。
作品首項新增「昭離工作室｜Solunastre Studio」，實際外連https://solunastre.com/並保留noopener；「我的個人工作室，專門放自製商業產品。」只取使用者提供事實，沒有假設客戶案例或產品數據。外站內容／HTTP未驗證。
游標沿用原生箭頭、文字I-beam與連結pointer；未採用的CustomCursor元件與舊綠色跟隨效果已外存，專案不保留第二套游標。

## 滴墨材質與備援

InkSurface 保持原生 WebGL2：速度／壓力場、MacCormack 墨色平流及獨立水波場。初始三滴形成墨形，之後持續滴落；舊墨淡去，不持續填黑整屏。startup／auto／user 逐滴生成 spread／curl／drift／stretch profile，輪廓角度、橢圓比例、半徑、濃度、旋流正負、拉伸及漂移確實送入 shader，不只診斷亂數。
fine-hover游標移動即可作筆；hover／自動落墨／點擊共用原滴墨形態與流動；僅路徑取樣、尺寸及劑量隨互動調整，重複描繪允許自然疊濃。Header／操作面板／實際連結仍排除pointer注墨，詩句可留淡墨但限濃，intro空隙與周圍維持原墨累積；有效移動或點擊／輕點後暫停auto約2600ms，閒置再恢復滴墨，pan保留原生捲動與pinch zoom。約30fps目標，桌機依實際像素配置、畫布最高900萬像素／顏料長邊960–2048自適應（physical2K為1536、4K為2048），手機維持200萬像素／DPR1.25與原低負載配置；離屏／隱藏停繪。減動、無JS、缺失WebGL2／浮點支援及context loss保留靜態SVG；失效context後resize／減動來回不重新顯示dead canvas。

## 2026-11-05 最新詩句、About與英文草書品牌驗證

詩句／單一入口／合併書寫／About版本由root回報build39070 exit0／143頁、whole lint0／diff0。新整批QA2331實跑exit0，結果.impeccable/review/poem-about/results.json，failures[]：1536×960、768×1024、390×844、320×720及1111×600首屏完整、Kouzan400實際載入且三句正確、唯一閱讀更多原生到/about。最近六筆對照2篇Blog＋135篇TechBook來源與共用排序結果一致，類型／日期／路徑正確且實際文章HTTP200。About原有作者資料／作品與新增工作室href逐項對照，桌手機無overflow；原生游標、正常fluid10秒frame／滴數／像素更新均通過。

後續只將英文品牌改Water Brush400。root回報build96337 exit0／143頁、whole lint0／diff0；另一次限定品牌QA53281實跑exit0，沒有重跑前述全套。五尺寸Header／Footer的字體實際loaded400、Studio正文體、無裁切／碰撞／overflow，Home／Blog／About／真文章同一身份與導覽，品牌原生點擊回首頁均通過；原有完整詩句及單一入口未變。來源記錄、WOFF2 SHA與favicon raster SHA一致，canonical SVG為同來源輪廓。

最新證據在.impeccable/review/brand-script-confirm/results.json；home-live-desktop.png為正常動態、about-mobile.png為完整關於頁。QA代理親看上述兩張及320／1111×600靜態備援截圖，確認書寫體下伸筆畫與Studio保持空間，詩句無缺字或Header遮擋。前一批poem-about圖片保留其當時Caveat品牌，不冒充最新英文草書品牌截圖。未宣稱使用者審美接受、實機效能、Antigravity或外站內容已驗；無部署／推送。

## 前輪導覽與首屏文案驗證（歷史）

root回報build35002 exit0／143頁、whole lint0／diff0。新限定QA45192原始exit1保留：1536×960、768×1024、390×844、320×720及1111×600的100svh／可見H1／雙操作／Header避讓／Search末位／無overflow皆通過；桌手機Home、Blog、About及真文章的導覽一致，兩個hero操作原生導航成功。分類／搜尋的mouse與Enter、面板bounds、Escape焦點、astro結果及空狀態均通過。正常fluid10秒仍有自動滴數／frame／像素變化，文字可讀。

唯一失敗是手機tap後200ms只抽樣「最後一滴」時，user被下一個auto覆寫（滴數5→7），不是已證實的應用缺陷。另用原生觸控＋MutationObserver oldValue歷史的小範圍確認exit0：標題中心hit-test實際為INK-SURFACE、touch pointerdown/up到達、滴數3→4且記錄kind=user、scroll0→0、errors[]。主批次results.json保留exit1，不改寫成全套exit0；補證據為ink-nav-hero/tap-confirm.json。

截圖模式明確：home-reduced-*是靜態備援；home-live-desktop/mobile是no-preference正常fluid10秒後。root親看兩張live，記錄代理另看live兩張及320／1111×600減動圖，文字／操作清楚、無Header重疊。沒有再改UI、再跑全套流體lifecycle或宣稱實機效能。輸出位於.impeccable/review/ink-nav-hero/。

## 前輪整合基準與交付邊界（歷史）

本輪正式整合實跑：root 回報 build97871 exit0／143頁、全站 lint0／diff0。新整合 QA52482 exit0，結果為 .impeccable/review/ink-integrated/results.json，errors[]／failures[]，並未沿用原型通過紀錄。
驗收包含 Home→Blog→About→真文章→品牌回 Home、一致 Header 字型／尺寸／次序、無 Garden 請求、兩預覽 alias、Notes／Search／focus return，及正式首頁最小自動滴墨／點擊煙霧檢查。截圖與結果放 .impeccable/review/ink-integrated/。
桌機1536×960／手機390×844完整原生導航流程實跑，各頁均一個 Header、Caveat700、相同字級／品牌座標／Header尺寸／可見導覽順序；品牌返回 `/` 是100svh InkSurface。平板768×1024導覽與320px窄屏也無 overflow。Notes與Search的原生座標／Enter、Escape返回焦點、面板bounds、真分類文章與astro索引／中文空結果皆通過。ink-preview與design-preview實際轉回正式首頁。
正常 WebGL 桌機／手機測得自動滴數、frame及實際像素增加，點擊追加成功，整合未遮住場景互動。減動截圖另檢查靜態首屏；本輪未重跑先前全部流體lifecycle或實體裝置測試。測試阻擋外部 analytics，未據此宣稱 GA 網路驗收。記錄代理親看平板首頁、手機文章、手機Notes與桌機Search，未見材質／版面重大問題。
截圖模式明確區分：home-*-first/full、returned-home及跨頁／面板圖採 reducedMotion:reduce，所以首頁是原創靜態 SVG；home-live-desktop/mobile.png 另採 no-preference，兩者 ready=true／mode=fluid，實際 canvas 像素、自動滴數與 frame 增加，不是只看 fallback 或計數。root 親看首頁桌機 full 與手機文章，確認共用 Header；root 回報限定唯讀碼審查未見重大問題，未宣稱 Antigravity 已審。
使用者審美、實體裝置效能／電池與 Antigravity 未驗證；本機技術驗收不是發布或使用者已接受。無 commit／部署／推送。舊花草與獨立原型的通過紀錄只屬歷史。
