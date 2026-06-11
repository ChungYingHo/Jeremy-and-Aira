<script lang="ts">
  import { onMount } from "svelte"
  import type { MenuItem, MenuGroup } from "@/models/menu"
  import DrilldownMenu from "@/components/Menu/components/DrilldownMenu.svelte"
  import SearchBtn from "@/components/Search/SearchBtn.svelte"
  import SearchPanel from "@/components/Search/SearchPanel.svelte"
  import { fade, slide } from "svelte/transition"
  
  import { normalizePath } from "@/utils/readPath"

  export let rootItems: MenuItem[] = []
  export let currentPath = "" 

  let desktopOpenGroup: MenuGroup | null = null
  let desktopMenuElement: HTMLUListElement | null = null
  let desktopTitle = ""
  
  let innerWidth = 0
  let isSearchOpen = false
  let isMobileMenuOpen = false

  let scrollY = 0
  let lastScrollY = 0
  let showMenu = true

  function handleScroll() {
    const currentScrollY = window.scrollY
    const threshold = 50 

    if (currentScrollY < threshold) {
      showMenu = true
    } else {
      showMenu = currentScrollY <= lastScrollY
    }
    lastScrollY = currentScrollY
  }

  function isGroup(menuItem: MenuItem): menuItem is MenuGroup {
    return menuItem.type === "group"
  }

  function groupContainsPath(group: MenuGroup, targetPath: string): boolean {
    const normalizedTarget = normalizePath(targetPath);
    
    return group.children.some(child => {
      if (child.type === 'page') {
        const childHref = normalizePath(child.href);
        return childHref === normalizedTarget || (childHref !== '/' && normalizedTarget.startsWith(childHref + '/'));
      }
      if (child.type === 'group') {
        return groupContainsPath(child, targetPath);
      }
      return false
    })
  }

  function isActive(item: MenuItem): boolean {
    if (innerWidth >= 1024 && desktopOpenGroup === item) return true

    const normalizedTarget = normalizePath(currentPath);

    if (isGroup(item)) {
      return groupContainsPath(item, currentPath);
    }

    if (item.type === 'page') {
      const itemHref = normalizePath(item.href);
      return itemHref === normalizedTarget || (itemHref !== '/' && normalizedTarget.startsWith(itemHref + '/'));
    }

    return false
  }

  function getActiveGroup(): MenuGroup | null {
    for (const item of rootItems) {
      if (isGroup(item) && groupContainsPath(item, currentPath)) {
        return item;
      }
    }
    return null;
  }

  function openDesktopGroup(menuGroup: MenuGroup, event: MouseEvent) {
    if (innerWidth < 1024) return
    if (desktopOpenGroup && desktopOpenGroup.title === menuGroup.title) {
      closeAll()
      return
    }
    closeAll()
    desktopOpenGroup = menuGroup
    desktopTitle = menuGroup.title
  }

  function handleLogoClick(e: MouseEvent) {
    if (innerWidth < 1024) {
      e.preventDefault()
      isMobileMenuOpen ? closeAll() : openMobileMenu()
    }
  }

  function openMobileMenu() {
    closeAll()
    isMobileMenuOpen = true
    const activeGroup = getActiveGroup()
    desktopTitle = activeGroup ? activeGroup.title : "MENU"
  }

  function closeAll() {
    desktopOpenGroup = null
    isMobileMenuOpen = false
    isSearchOpen = false
    desktopTitle = ""
  }

  function toggleSearch() {
    isSearchOpen ? closeAll() : (closeAll(), isSearchOpen = true)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeAll();
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<svelte:window bind:innerWidth />

<header 
  class="
    fixed top-0 left-0 right-0 z-50 mt-6 pointer-events-none
    transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
    {showMenu ? 'translate-y-0' : '-translate-y-[200%]'}
  "
>
  <div 
    class="
      pointer-events-auto mx-auto w-fit flex justify-center items-center px-3 py-2 lg:pl-3 lg:pr-4 relative
      border border-line rounded-full transition-all duration-500
      {scrollY > 50 ? 'bg-cream shadow-xl shadow-ink/10' : 'bg-cream/85 backdrop-blur-lg shadow-lg shadow-ink/5'}
    "
  >

    <div class="flex w-auto justify-center items-center gap-2 lg:gap-4 relative">
      <a 
        href="/" 
        on:click={handleLogoClick}
        class="
          group relative flex items-center justify-center h-10 px-6 lg:px-8 rounded-full
          bg-paper
          border border-line
          hover:border-moss/40 hover:bg-moss/10
          transition-all duration-300 ease-out
          active:scale-[0.98]
          z-20
        "
      >
        <span class="
          font-serif text-xs md:text-sm font-semibold tracking-[0.15em] lg:tracking-[0.2em] whitespace-nowrap
          text-ink group-hover:text-moss
          transition-all duration-300
        ">
          JEREMY &times; AIRA
        </span>
      </a>

      <ul class="hidden lg:flex menu menu-horizontal bg-transparent px-1 gap-2" bind:this={desktopMenuElement}>
        {#each rootItems as menuItem}
          {#if isGroup(menuItem)}
            <li>
              <button 
                class="
                  h-10 px-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 
                  {isActive(menuItem)
                    ? 'bg-moss/10 text-moss border border-moss/25'
                    : 'text-ink-soft hover:text-ink hover:bg-ink/5'}
                "
                on:click={(event) => openDesktopGroup(menuItem, event)}
              >
                {menuItem.title}
              </button>
            </li>
          {:else}
            <li>
              <a 
                href={menuItem.href}
                class="
                  h-10 px-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 flex items-center 
                  {isActive(menuItem)
                    ? 'bg-moss/10 text-moss border border-moss/25'
                    : 'text-ink-soft hover:text-ink hover:bg-ink/5'}
                "
              >
                {menuItem.title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>

      <div class="flex items-center gap-1 lg:gap-3 lg:pl-1">
        <div class="hidden lg:block w-px h-5 bg-gradient-to-b from-transparent via-line to-transparent"></div>
        <SearchBtn onClick={toggleSearch} />
      </div>
    </div>

    {#if (desktopOpenGroup && innerWidth >= 1024) || (isMobileMenuOpen && innerWidth < 1024)}
      <div
        class="
          absolute top-full pt-4 z-50
          w-[calc(100vw-32px)] max-w-[320px] 
          md:w-[600px] md:max-w-[600px] 
          left-1/2 -translate-x-1/2
          lg:w-full lg:max-w-none lg:left-0 lg:translate-x-0
        "
        transition:fade={{ duration: 120 }}
      >
        <div
          class="
            bg-cream border border-line shadow-[0_10px_40px_-10px_rgba(58,53,44,0.25)] rounded-2xl
            p-2.5 lg:p-2 text-xs
            max-h-[60vh] lg:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar
          "
          transition:slide={{ duration: 250, axis: "y" }}
        >
          <div class="flex items-center justify-between mb-1 px-2 pt-1 pb-1.5 border-b border-line sticky top-0 bg-cream z-10">
             {#key desktopTitle}
              <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-moss/70 ml-1" in:fade={{ duration: 150 }}>
                {desktopTitle}
              </div>
             {/key}
            <button class="btn btn-ghost btn-xs btn-circle w-5 h-5 min-h-0 text-ink-faint hover:text-ink hover:bg-ink/10 transition-colors" on:click={closeAll}>✕</button>
          </div>

          {#if innerWidth < 1024}
            <div class="mb-2">
              <a 
                href="/" 
                on:click={closeAll}
                class="
                  flex items-center gap-3 px-3 py-3 rounded-lg w-full
                  text-ink font-bold tracking-widest uppercase
                  hover:bg-ink/5 hover:text-moss transition-all duration-200
                "
              >
                <div class="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center text-moss">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> 
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span>HOME</span>
              </a>
              <div class="h-px bg-line mx-2 mt-1"></div>
            </div>
          {/if}

          {#key (isMobileMenuOpen ? 'mobile-root' : desktopOpenGroup?.title)}
            <DrilldownMenu
              rootItems={rootItems}
              initialItems={isMobileMenuOpen ? rootItems : (desktopOpenGroup?.children || [])}
              currentPath={currentPath} 
              onBackToRoot={() => { if (!isMobileMenuOpen) closeAll(); }}
              onClose={closeAll}
              onTitleChange={(title) => {
                if (title) {
                  desktopTitle = title;
                } else {
                  desktopTitle = isMobileMenuOpen ? "MENU" : (desktopOpenGroup?.title || "");
                }
              }}
            />
          {/key}

          {#if innerWidth < 1024}
            <div class="mt-2 pt-2 border-t border-line">
              <button
                on:click={scrollToTop}
                class="
                  flex items-center justify-center gap-2 px-3 py-3 rounded-lg w-full
                  text-ink-faint font-bold tracking-widest uppercase text-[10px]
                  hover:bg-ink/5 hover:text-moss transition-all duration-200
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                <span>Back to Top</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    {#if isSearchOpen}
      <div
        class="
          absolute top-full pt-4 z-50
          w-[calc(100vw-32px)] max-w-[320px] 
          md:w-[600px] md:max-w-[600px]
          left-1/2 -translate-x-1/2
          lg:w-full lg:max-w-none lg:left-0 lg:translate-x-0
        "
        transition:fade={{ duration: 120 }}
      >
        <div
          class="
            bg-cream border border-line shadow-[0_10px_40px_-10px_rgba(58,53,44,0.25)] rounded-2xl
            p-2.5 lg:p-0 text-xs
            max-h-[60vh] lg:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar
          "
          transition:slide={{ duration: 250, axis: "y" }}
        >
          <SearchPanel onClose={closeAll} />
        </div>
      </div>
    {/if}

  </div>
</header>

{#if (desktopOpenGroup && innerWidth >= 1024) || isMobileMenuOpen || isSearchOpen}
  <button 
    class="fixed inset-0 z-40 cursor-default focus:outline-none" 
    aria-label="Close panel" 
    on:click={closeAll}
  ></button>
{/if}

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(95, 115, 85, 0.25);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(95, 115, 85, 0.45);
  }
</style>