<script context="module" lang="ts">
  // 1. 這裡只負責 "存"，不負責 "驅動畫面"
  import FlexSearch from "flexsearch";
  import type { SearchIndexItem } from "@/models/search";

  let cachedIndex: any = null;
  let cachedData: SearchIndexItem[] = [];
</script>

<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { MenuItem } from "@/models/menu";

  export let rootItems: MenuItem[] = [];
  export let onClose: () => void; 

  let searchQuery = "";
  let searchInput: HTMLInputElement;
  let activeIndex = 0;
  let isIndexing = false;

  // 2. 這是本地變數，負責讓 Svelte 更新畫面
  let articleData: SearchIndexItem[] = [];
  let searchIndex: any = null;
  let results: SearchIndexItem[] = [];

  // 初始化邏輯
  async function initSearch() {
    // A. 如果快取有資料，直接拿來用 (會觸發 Reactivity)
    if (cachedIndex && cachedData.length > 0) {
      searchIndex = cachedIndex;
      articleData = cachedData;
      return;
    }

    // B. 沒有快取，才去 fetch
    isIndexing = true;
    try {
      const newIndex = new FlexSearch.Document({
        document: {
          id: "slug",
          index: ["title", "content"],
          store: true
        },
        tokenize: "full"
      });

      const res = await fetch('/api/search.json');
      if (!res.ok) throw new Error('Failed to fetch search index');
      
      const items: SearchIndexItem[] = await res.json();
      
      items.forEach(item => newIndex.add(item));

      // 寫入快取 (Module Level)
      cachedIndex = newIndex;
      cachedData = items;

      // 寫入本地 (Instance Level - 觸發更新)
      searchIndex = newIndex;
      articleData = items;

    } catch (e) {
      console.error("Search index failed:", e);
    } finally {
      isIndexing = false;
    }
  }

  // Menu 資料處理
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

  // 搜尋執行邏輯 (依賴本地變數 searchIndex)
  $: if (searchQuery.trim() === "") {
    results = [];
  } else {
    const menuResults = flatMenuItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let articleResults: SearchIndexItem[] = [];
    
    // 這裡改用本地變數 searchIndex
    if (searchIndex) {
      const searchRes = searchIndex.search(searchQuery, { limit: 8 });
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
    results = [...menuResults, ...articleResults].slice(0, 10);
  }

  onMount(() => {
    initSearch();
    tick().then(() => searchInput?.focus());
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) activeIndex = (activeIndex + 1) % results.length;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) activeIndex = (activeIndex - 1 + results.length) % results.length;
    }
    if (e.key === "Enter" && results[activeIndex]) {
      window.location.href = results[activeIndex].slug;
      onClose();
    }
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex items-center px-4 py-3 border-b border-white/5">
    <svg class="h-5 w-5 text-white/40 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      bind:this={searchInput}
      bind:value={searchQuery}
      on:keydown={handleKeydown} 
      type="text"
      placeholder="Search documentation..."
      class="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base h-full"
    />
    <div class="text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5 ml-2">ESC</div>
  </div>

  <div class="max-h-[60vh] overflow-y-auto p-2">
    {#if isIndexing && results.length === 0 && searchQuery}
        <div class="py-8 text-center text-white/30 text-sm animate-pulse">Initializing...</div>
    {:else if searchQuery && results.length === 0}
        <div class="py-8 text-center text-white/30 text-sm">No results found.</div>
    {:else if results.length > 0}
      <div class="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 py-2">Results</div>
      <ul>
        {#each results as result, i}
          <li>
            <a
              href={result.slug}
              on:click={onClose}
              class="
                block px-3 py-2.5 rounded-lg cursor-pointer border border-transparent transition-colors
                {i === activeIndex ? 'bg-white/10 text-white border-white/5' : 'text-white/70 hover:bg-white/5'}
              "
              on:mouseenter={() => activeIndex = i}
            >
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium truncate pr-2">{result.title}</span>
                <span class="text-[9px] uppercase opacity-50 border border-white/20 px-1 rounded flex-shrink-0">{result.type}</span>
              </div>
              {#if result.description}
                <div class="text-xs text-white/40 mt-0.5 line-clamp-1">{result.description}</div>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>