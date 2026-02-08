<script lang="ts">
  import { onMount } from "svelte"
  import type { MenuItem, MenuGroup } from "@/models/menu"
  import DrilldownMenu from "@/components/DrilldownMenu.svelte"
  import SearchBtn from "@/components/SearchBtn.svelte"
  import SearchPanel from "@/components/SearchPanel.svelte"
  import { fade, slide } from "svelte/transition"

  export let rootItems: MenuItem[] = []
  export let currentPath = "" 

  let desktopOpenGroup: MenuGroup | null = null
  let desktopMenuElement: HTMLUListElement | null = null
  let desktopTitle = ""
  
  let innerWidth = 0;
  let isSearchOpen = false;
  let isMobileMenuOpen = false;

  function isGroup(menuItem: MenuItem): menuItem is MenuGroup {
    return menuItem.type === "group"
  }

  function groupContainsPath(group: MenuGroup, path: string): boolean {
    return group.children.some(child => {
      if (child.type === 'page') return child.href === path || path.startsWith(child.href)
      if (child.type === 'group') return groupContainsPath(child, path)
      return false
    })
  }

  // --- 電腦版互動 ---
  function openDesktopGroup(menuGroup: MenuGroup, event: MouseEvent) {
    if (innerWidth < 768) return; 

    if (desktopOpenGroup && desktopOpenGroup.title === menuGroup.title) {
      closeAll();
      return
    }
    closeAll();
    desktopOpenGroup = menuGroup
    desktopTitle = menuGroup.title
  }

  // --- 手機版互動 ---
  function handleLogoClick(e: MouseEvent) {
    if (innerWidth < 768) {
      e.preventDefault();
      if (isMobileMenuOpen) {
        closeAll();
      } else {
        openMobileMenu();
      }
    }
  }

  function openMobileMenu() {
    closeAll();
    isMobileMenuOpen = true;
    desktopTitle = "MENU";
  }

  function closeAll() {
    desktopOpenGroup = null;
    isMobileMenuOpen = false;
    isSearchOpen = false;
    desktopTitle = "";
  }

  function toggleSearch() {
    if (isSearchOpen) {
      closeAll();
    } else {
      closeAll();
      isSearchOpen = true;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      toggleSearch();
    }
  }

  function isActive(item: MenuItem): boolean {
    if (innerWidth >= 768 && desktopOpenGroup === item) return true
    if (isGroup(item)) return groupContainsPath(item, currentPath)
    return item.href === currentPath
  }
</script>

<svelte:window bind:innerWidth on:keydown={handleKeydown} />

<header class="fixed top-0 left-0 right-0 z-50 mt-6 pointer-events-none">
  <div class="pointer-events-auto mx-auto w-fit flex justify-center items-center px-3 py-2 md:pl-3 md:pr-4 relative border border-white/10 bg-black/40 backdrop-blur-xl rounded-full shadow-2xl transition-all duration-300">

    <div class="flex w-auto justify-center items-center gap-2 md:gap-4 relative">
      
      <a 
        href="/" 
        on:click={handleLogoClick}
        class="
          group relative flex items-center justify-center h-10 px-6 md:px-8 rounded-full 
          bg-gradient-to-b from-slate-50 via-slate-300 to-slate-400 
          text-slate-800 font-bold tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm 
          shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.9)] 
          border-t border-white/50 ring-1 ring-slate-400/30
          hover:brightness-110 hover:-translate-y-[1px]
          active:scale-[0.98] transition-all duration-300 ease-out
          z-20
        "
      >
        <span class="drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] whitespace-nowrap">
          JEREMY & AIRA
        </span>
      </a>

      <ul class="hidden md:flex menu menu-horizontal bg-transparent px-1 gap-2" bind:this={desktopMenuElement}>
        {#each rootItems as menuItem}
          {#if isGroup(menuItem)}
            <li>
              <button 
                class="h-10 px-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 {isActive(menuItem) ? 'bg-white/15 backdrop-blur-md text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' : 'text-white/80 hover:text-white hover:bg-white/5'}"
                on:click={(event) => openDesktopGroup(menuItem, event)}
              >
                {menuItem.title}
              </button>
            </li>
          {:else}
            <li>
              <a 
                href={menuItem.href}
                class="h-10 px-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 flex items-center {isActive(menuItem) ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'}"
              >
                {menuItem.title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>

      <div class="flex items-center gap-1 md:gap-3 md:pl-1">
        <div class="hidden md:block w-px h-5 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <SearchBtn onClick={toggleSearch} />
      </div>

    </div>

    {#if (desktopOpenGroup && innerWidth >= 768) || (isMobileMenuOpen && innerWidth < 768)}
      <div
        class="
          absolute top-full pt-4 z-50
          /* Mobile: Centered */
          w-[calc(100vw-24px)] max-w-[360px] left-1/2 -translate-x-1/2
          /* Desktop: Match Parent Width Exactly */
          md:w-full md:max-w-none md:left-0 md:translate-x-0
        "
        transition:fade={{ duration: 120 }}
      >
        <div
          class="backdrop-blur-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-2 py-3 overflow-hidden"
          transition:slide={{ duration: 250, axis: "y" }}
        >
          <div class="flex items-center justify-between mb-1 px-3 pt-1 pb-2 border-b border-white/5">
             {#key desktopTitle}
              <div class="text-xs font-bold uppercase tracking-[0.2em] text-white/40 ml-1" in:fade={{ duration: 150 }}>
                {desktopTitle}
              </div>
            {/key}
            <button class="btn btn-ghost btn-xs btn-circle text-white/40 hover:text-white hover:bg-white/10 transition-colors" on:click={closeAll}>✕</button>
          </div>

          {#key (isMobileMenuOpen ? 'mobile-root' : desktopOpenGroup?.title)}
            <DrilldownMenu
              rootItems={rootItems}
              initialItems={isMobileMenuOpen ? rootItems : (desktopOpenGroup?.children || [])}
              currentPath={currentPath} 
              onBackToRoot={() => {
                 if (!isMobileMenuOpen) closeAll();
              }}
              onClose={closeAll}
              onTitleChange={(title) => (desktopTitle = title || (isMobileMenuOpen ? "MENU" : desktopOpenGroup?.title) || "")}
            />
          {/key}
        </div>
      </div>
    {/if}

    {#if isSearchOpen}
      <div
        class="
          absolute top-full pt-4 z-50
          /* Mobile */
          w-[calc(100vw-24px)] max-w-[360px] left-1/2 -translate-x-1/2
          /* Desktop: Match Parent Width Exactly */
          md:w-full md:max-w-none md:left-0 md:translate-x-0
        "
        transition:fade={{ duration: 120 }}
      >
        <div
          class="backdrop-blur-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden"
          transition:slide={{ duration: 250, axis: "y" }}
        >
          <SearchPanel {rootItems} onClose={closeAll} />
        </div>
      </div>
    {/if}

  </div>
</header>

{#if (desktopOpenGroup && innerWidth >= 768) || isMobileMenuOpen || isSearchOpen}
  <button 
    class="fixed inset-0 z-40 cursor-default focus:outline-none" 
    aria-label="Close panel" 
    on:click={closeAll}
  ></button>
{/if}