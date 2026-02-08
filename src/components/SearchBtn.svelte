<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import FlexSearch from "flexsearch"; 
  import type { MenuItem } from "@/models/menu"; 
  // 注意：這裡只引用 Type，不要引用後端邏輯，以免 Astro 在客戶端報錯
  import type { SearchIndexItem } from "@/models/search";

  export let rootItems: MenuItem[] = []; // 接收 Menu 資料當備用搜尋

  let isOpen = false;
  let isIndexing = false;
  let searchQuery = "";
  let searchInput: HTMLInputElement;
  let activeIndex = 0;

  // 搜尋引擎實體
  let searchIndex: any = null; 
  let articleData: SearchIndexItem[] = []; // 原始資料備份 (用來顯示標題/摘要)
  let results: SearchIndexItem[] = []; // 最終搜尋結果

  // 1. 初始化 (懶加載：使用者點開才去抓 JSON)
  async function initSearch() {
    if (searchIndex) return; 
    isIndexing = true;

    try {
      // 設定 FlexSearch：針對中文 tokenize: 'full'
      searchIndex = new FlexSearch.Document({
        document: {
          id: "slug",
          index: ["title", "content"], 
          store: true
        },
        tokenize: "full"
      });

      // 🚀 關鍵：Fetch 你剛剛做好的 Astro API
      const res = await fetch('/api/search.json');
      if (!res.ok) throw new Error('Failed to fetch search index');
      
      const items: SearchIndexItem[] = await res.json();
      articleData = items; 

      // 建立索引
      items.forEach(item => searchIndex.add(item));

    } catch (e) {
      console.error("Search index failed:", e);
    } finally {
      isIndexing = false;
    }
  }

  // 2. 處理 Menu 資料 (扁平化以便搜尋)
  let flatMenuItems: SearchIndexItem[] = [];
  function flattenMenu(items: MenuItem[]) {
    items.forEach(item => {
      if (item.type === "group") {
        flattenMenu((item as any).children);
      } else {
        flatMenuItems.push({
          title: item.title,
          slug: item.href,
          content: "",
          type: "Page",
          description: "Navigation Menu"
        });
      }
    });
  }
  
  $: {
    flatMenuItems = [];
    flattenMenu(rootItems);
  }

  // 3. 執行搜尋
  $: if (searchQuery.trim() === "") {
    results = [];
  } else {
    // A. 搜 Menu
    const menuResults = flatMenuItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // B. 搜文章 (FlexSearch)
    let articleResults: SearchIndexItem[] = [];
    if (searchIndex) {
      const searchRes = searchIndex.search(searchQuery, { limit: 8 });
      
      // FlexSearch 回傳的是 ID (slug)，我們要對應回原始資料
      const foundSlugs = new Set<string>();
      searchRes.forEach((group: any) => {
        group.result.forEach((slug: string) => {
          if (!foundSlugs.has(slug)) {
            foundSlugs.add(slug);
            const foundItem = articleData.find(i => i.slug === slug);
            if (foundItem) articleResults.push(foundItem);
          }
        });
      });
    }

    // C. 合併
    results = [...menuResults, ...articleResults].slice(0, 10);
  }

  function openSearch() {
    isOpen = true;
    setTimeout(() => searchInput?.focus(), 50);
    initSearch(); // 打開時才載入
  }

  function closeSearch() {
    isOpen = false;
    searchQuery = "";
    activeIndex = 0;
  }

  // 鍵盤操作 (Ctrl+K, Esc, Arrows)
  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      isOpen ? closeSearch() : openSearch();
    }
    if (!isOpen) return;
    if (e.key === "Escape") closeSearch();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % results.length;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + results.length) % results.length;
    }
    if (e.key === "Enter" && results[activeIndex]) {
      window.location.href = results[activeIndex].slug;
      closeSearch();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  on:click={openSearch}
  aria-label="Search"
  class="
    group flex items-center justify-center w-10 h-10 ml-2 rounded-full
    text-white/70 hover:text-white bg-transparent hover:bg-white/10
    transition-all duration-300
  "
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>

{#if isOpen}
  <button
    type="button"
    class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    on:click={closeSearch}
    aria-label="Close search"
  ></button>

  <div class="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] pointer-events-none">
    <div 
      class="
        pointer-events-auto w-full max-w-lg mx-4 flex flex-col
        bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10
        shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden
      "
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="flex items-center px-4 py-3 border-b border-white/10">
        <svg class="h-5 w-5 text-white/40 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          bind:this={searchInput}
          bind:value={searchQuery}
          type="text"
          placeholder="Search documentation..."
          class="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-lg h-full"
        />
        <div class="text-xs font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">ESC</div>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-2">
        {#if isIndexing && results.length === 0}
           <div class="py-8 text-center text-white/30 text-sm animate-pulse">Initializing Search Index...</div>
        {:else if searchQuery && results.length === 0}
           <div class="py-8 text-center text-white/30 text-sm">No results found.</div>
        {:else if results.length > 0}
          <div class="text-xs font-bold text-white/30 uppercase tracking-widest px-2 py-2">Results</div>
          <ul>
            {#each results as result, i}
              <li>
                <a
                  href={result.slug}
                  on:click={closeSearch}
                  class="
                    block px-3 py-3 rounded-lg cursor-pointer border border-transparent
                    {i === activeIndex ? 'bg-white/10 text-white border-white/5' : 'text-white/70 hover:bg-white/5'}
                  "
                  on:mouseenter={() => activeIndex = i}
                >
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">{result.title}</span>
                    <span class="text-[10px] uppercase opacity-50 border border-white/20 px-1 rounded">{result.type}</span>
                  </div>
                  {#if result.description}
                    <div class="text-xs text-white/40 mt-1 line-clamp-1">{result.description}</div>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}