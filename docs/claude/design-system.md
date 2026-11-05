# 設計系統：Jeremy・滴墨與共用 Header

2026-11-05 最新正式整合規則。首頁與其他 Layout 頁使用同一 Header；舊花草／銀墨／天體／獨立原型身份規定不再是 current。產品與詳細實作見 PRODUCT.md／DESIGN.md。

## 首頁與身份

- `/` 是持續滴墨入水、漣漪及暈染首屏；100vh fallback／100svh 同時包含共用 Header 與最少入口，下方直接真實文章。
- 首屏完整呈現「雪沫乳花浮午盞，蓼茸蒿筍試春盤。人間有味是清歡。」；前兩句輕量、末句唯一H1，皆採Kouzan Brush Sousho 400真正草書。僅一個輕盈「閱讀更多」連/about。3個實際文字Range行框與CTA採padding8px／圓角8px／外30px柔邊（僅核心外固定起伏≤3px）、核心R≤0.16的局部冪等濃度上限，pigment及screenUV共用helper防平流／折射堆深並同比保留G/R age；區外及intro空隙維持原墨，字形另保留24%紙色／10px柔邊，無全版veil。文字pointer-events:none，操作連結auto。
- Jeremy 是主名，Solunastre Studio 是指定小標，不加 by 或並列作者。Header 不再放額外細 J／桃色方塊，也不加巨大重複 Jeremy。
- 自託管Water Brush 400作Jeremy連筆書寫字標，line-height:1、左右4px空間、font-synthesis:none；Studio小標仍為正文體。Header／Footer／canonical SVG與J favicon同一來源字形，來源、原字形排字對照與OFL保留，不宣稱客製新字型。一般標題、內文、控制用Urbanist／Noto Sans TC，code用JetBrains Mono；詩句草書另保留完整23個字元與來源使用條件。
- 品牌連結統一 `/`；未採用的提案頁、場景、畫作與字型移至專案外封存，正式站只保留已採用的共用 Header 與 InkSurface。

## Header 與閱讀

同一Menu服務首頁、Blog、About、文章；相同viewport的字體／尺寸／對齊及導覽次序一致。桌機112px／手機96px；首頁頂端透明、內頁／捲動後紙白是背景變體，不是兩套設計。核心控制client:load。
最新導覽名稱／位置以SSOT與內容為準：桌機About→TechBook→Blog→Search→Music，音樂44px單鍵固定緊接搜尋右側，兩者同一工具群並以留白／細線與導覽區隔。<1024px的Header只留品牌與最右44px漢堡，MENU根層呈現About／TechBook分類／Blog直連，搜尋與音樂各用48px完整橫列；搜尋關閉或Escape回到可見漢堡。Blog不改成泛用「開始閱讀」，也不加外連箭頭。舊Notes／閱讀入口名稱屬前輪，不再是當前標籤。
TechBook分類／Drilldown／Search保留真實內容、關閉圖示、鍵盤及focus return；面板約400／640px桌機，手機上限380px且不超viewport，依可用高度翻轉／內部捲動。面板關閉、Drilldown Back／Top與搜尋清除控制至少44px觸控區；滑鼠／觸控點按非文字控制不顯示焦點外框，鍵盤保留清楚的focus-visible，輸入欄保留焦點提示。
背景音樂〈人間有味是清歡〉預設啟用、音量0.12且loop；先設volume再載入／play，不用SSR autoplay先搶播。單鍵可關閉並保存偏好；初次play受政策拒絕時等待真正click／keydown或音樂鈕重試，UI依actual playing／blocked／loading呈現，不把啟用意圖當作已播放。Layout的ClientRouter與固定transition:persist Audio保持站內一般切頁音樂不中斷，頁面不新增轉場；PostRenderer採page-load冪等初始化與before-swap清理。其他媒體播放會暫停背景音樂，下次切頁可恢復，跨域YouTube由自有播放hook通知。
正文與 placeholder 對比至少4.5:1、大字3:1，文章標題／正文／前後篇共用上限836px的獨立置中版心、中文行距約1.9。目錄不佔正文寬度；1536px以上以48px間距外掛256px右側目錄，小於1536px且有章節時採底部固定、可展開的目錄，避讓safe-area／visualViewport並讓長目錄內部捲動；列印隱藏底部目錄並移除預留空間。無章節文章維持獨立置中正文。文章用 --md-*／--color-*；不用多色卡片或過多標籤膠囊填滿閱讀區，底部目錄沿用共享柔和圓角。作者資料、原色頭像、共同署名及文章事實／路徑保留。
首頁最近書寫合併Blog／TechBook，以共用helpers按日期倒序、同日sameDateSort與標題正序取六筆，標記日常／筆記並用collection真實路徑，不造Blog配額。About採引言／照片、正文／聯絡、作品的清楚分層；600px以下照片與右側直列職務並排、完整引言另起一段，601–850px身份左／引言右，更寬維持桌機配置。保留AUTHORS所有事實，加入使用者自有「昭離工作室｜Solunastre Studio」https://solunastre.com/，用途僅述自製商業產品。
Networking三圖與五種排序圖解以局部橫捲保留可讀比例，只有實際溢位才顯示滑動提示並可鍵盤聚焦；排序控制位於捲動區外、觸控區至少44px，不對全站SVG設定最小寬度。
游標維持原生；未採用的CustomCursor元件與綠色跟隨效果已移至專案外封存，不保留第二套游標。

## 色彩與動態

palette 為象牙白、墨藍與板岩；paper #f4f3ef、ink／brand #263248。舊 moss／teal／sage 變數只保留非綠的相容值。禁止綠色／teal／sage 色相、雲海、花草圖回到正式首頁。
滴墨為原生 WebGL2 流體／墨色／水波，逐滴初始輪廓、角度、尺度與旋流／拉伸／漂移不同。保留真正的 shader 參數變化，不以計數器或固定 CSS 圓環冒充材質效果。
fine-hover游標移動作筆；hover／自動落墨／點擊共用原滴墨形態與流動；僅路徑取樣、尺寸及劑量隨互動調整，重複描繪允許自然疊濃。Header、操作面板與實際連結保留pointer排除，詩句限濃而非禁畫，intro空隙與區外自然疊濃；移動或點觸後約2600ms恢復閒置auto。點觸仍可加墨、touch pan不寫筆跡也不誤注入；墨色淡去、離屏／hidden停繪。減動／無JS／無GL／context loss有可見SVG，失效context不因resize或減動切換露出空白canvas。不要以同步counter當視覺驗收。

## 驗收與制度

改規則／設定先備份。依實際變更跑lint／build與桌手機關鍵頁；最新詩句／About整批QA2331 exit0，後續Water Brush品牌build96337／143頁、whole lint／diff與限定品牌QA53281均exit0。後者只驗新品牌五尺寸／四路由及必要舊內容保留，前者仍保留完整詩句／recent／About證據，詳見DESIGN，不挪用舊原型或花草測試。
UI 使用當前 bounding rect 原生座標／keyboard，避免 locator 預捲動假象。drilldown 每步等過場結束才截圖。比較 Home→其他頁→品牌返回 Home 的實際場景與 Header，確認沒有舊 Garden／巨大字標。
技術通過不代表審美接受、實體裝置效能、Antigravity 審查或已部署。
