<script lang="ts">
  import { onMount } from 'svelte'
  import type { MenuItem, MenuGroup } from '@/models/menu'
  import DrilldownMenu from '@/components/Menu/components/DrilldownMenu.svelte'
  import SearchBtn from '@/components/Search/SearchBtn.svelte'
  import SearchPanel from '@/components/Search/SearchPanel.svelte'
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  import { normalizePath } from '@/utils/readPath'
  import { MUSIC_EVENTS, MUSIC_TITLE, INITIAL_MUSIC_STATE, type BackgroundMusicState } from '@/utils/backgroundMusic'

  export let rootItems: MenuItem[] = []
  export let currentPath = ''
  export let visualHome = false

  let desktopOpenGroup: MenuGroup | null = null
  let desktopTitle = ''

  let innerWidth = 0
  let isSearchOpen = false
  let isMobileMenuOpen = false

  let scrollY = 0
  let navShell: HTMLDivElement
  let popoverHeight = 600
  let popoverUp = false
  let menuTrigger: HTMLButtonElement | null = null
  let mobileMenuTrigger: HTMLButtonElement | null = null
  let music: BackgroundMusicState = { ...INITIAL_MUSIC_STATE }

  function updateMusic(event: Event) {
    music = { ...(event as CustomEvent<BackgroundMusicState>).detail }
  }

  function toggleMusic() {
    window.dispatchEvent(new Event(MUSIC_EVENTS.toggle))
  }

  function positionPopover() {
    if (!navShell) return
    const rect = navShell.getBoundingClientRect()
    const viewport = window.visualViewport
    const visibleTop = viewport?.offsetTop ?? 0
    const visibleBottom = visibleTop + (viewport?.height ?? window.innerHeight)
    const below = Math.max(0, visibleBottom - rect.bottom - 24)
    const above = Math.max(0, rect.top - visibleTop - 24)
    popoverUp = below < 200 && above > below
    popoverHeight = Math.floor(popoverUp ? above : below)
  }

  function preserveHeaderFocus(node: HTMLElement) {
    const handlePointerFocus = (event: MouseEvent) => {
      if (event.button !== 0) return
      const target = (event.target as HTMLElement).closest<HTMLButtonElement | HTMLAnchorElement>('button, a')
      if (!target) return
      event.preventDefault()
      target.focus({ preventScroll: true })
    }
    node.addEventListener('mousedown', handlePointerFocus)
    return { destroy: () => node.removeEventListener('mousedown', handlePointerFocus) }
  }

  function handleScroll() {
    scrollY = window.scrollY
    if (desktopOpenGroup || isMobileMenuOpen || isSearchOpen) positionPopover()
  }

  function isGroup(menuItem: MenuItem): menuItem is MenuGroup {
    return menuItem.type === 'group'
  }

  function groupContainsPath(group: MenuGroup, targetPath: string): boolean {
    const normalizedTarget = normalizePath(targetPath)

    return group.children.some(child => {
      if (child.type === 'page') {
        const childHref = normalizePath(child.href)
        return childHref === normalizedTarget || (childHref !== '/' && normalizedTarget.startsWith(childHref + '/'))
      }
      if (child.type === 'group') {
        return groupContainsPath(child, targetPath)
      }
      return false
    })
  }

  function isActive(item: MenuItem): boolean {
    if (innerWidth >= 1024 && desktopOpenGroup === item) return true

    const normalizedTarget = normalizePath(currentPath)

    if (isGroup(item)) {
      return groupContainsPath(item, currentPath)
    }

    if (item.type === 'page') {
      const itemHref = normalizePath(item.href)
      return itemHref === normalizedTarget || (itemHref !== '/' && normalizedTarget.startsWith(itemHref + '/'))
    }

    return false
  }

  function openDesktopGroup(menuGroup: MenuGroup, trigger: HTMLButtonElement) {
    if (innerWidth < 1024) return
    menuTrigger = trigger
    if (desktopOpenGroup && desktopOpenGroup.title === menuGroup.title) {
      closePanels()
      return
    }
    closeAll()
    desktopOpenGroup = menuGroup
    desktopTitle = menuGroup.title
    positionPopover()
  }

  function toggleMobileMenu() {
    isMobileMenuOpen ? closePanels() : openMobileMenu()
  }

  function openMobileMenu() {
    closeAll()
    isMobileMenuOpen = true
    desktopTitle = 'MENU'
    positionPopover()
  }

  function closeAll() {
    desktopOpenGroup = null
    isMobileMenuOpen = false
    isSearchOpen = false
    desktopTitle = ''
  }

  function toggleSearch() {
    isSearchOpen ? closeSearch() : (closeAll(), isSearchOpen = true)
    positionPopover()
  }

  function openMobileSearch() {
    closeAll()
    isSearchOpen = true
    positionPopover()
  }

  function closePanels() {
    if (isSearchOpen) {
      closeSearch()
      return
    }
    const trigger = isMobileMenuOpen ? mobileMenuTrigger : menuTrigger
    closeAll()
    trigger?.focus({ preventScroll: true })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    closeAll()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && (desktopOpenGroup || isMobileMenuOpen || isSearchOpen)) {
      e.preventDefault()
      closePanels()
    }
  }

  function closeSearch() {
    closeAll()
    const trigger = innerWidth < 1024 ? mobileMenuTrigger : document.getElementById('site-search-trigger')
    trigger?.focus({ preventScroll: true })
  }

  onMount(() => {
    const markPointerInput = () => { document.documentElement.dataset.focusInput = 'pointer' }
    const markKeyboardInput = (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey || event.ctrlKey) return
      document.documentElement.dataset.focusInput = 'keyboard'
    }
    handleScroll()
    document.addEventListener('pointerdown', markPointerInput, { capture: true, passive: true })
    document.addEventListener('keydown', markKeyboardInput, true)
    window.addEventListener(MUSIC_EVENTS.state, updateMusic)
    window.dispatchEvent(new Event(MUSIC_EVENTS.query))
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', positionPopover, { passive: true })
    window.visualViewport?.addEventListener('resize', positionPopover, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', markPointerInput, true)
      document.removeEventListener('keydown', markKeyboardInput, true)
      window.removeEventListener(MUSIC_EVENTS.state, updateMusic)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', positionPopover)
      window.visualViewport?.removeEventListener('resize', positionPopover)
    }
  })

  $: isPanelOpen = (desktopOpenGroup && innerWidth >= 1024) || (isMobileMenuOpen && innerWidth < 1024)
  $: blogActive = normalizePath(currentPath) === '/blog' || normalizePath(currentPath).startsWith('/blog/')
  $: musicStatus = !music.enabled ? '已關閉' : music.error ? '暫時無法播放，點擊重試' : music.blocked ? '點擊播放' : music.playing ? '播放中' : music.loading ? '載入中' : '已暫停'
  $: musicLabel = !music.enabled ? '開啟背景音樂' : !music.playing && !music.loading ? '播放背景音樂' : music.loading ? '關閉背景音樂（載入中）' : '關閉背景音樂'
</script>

<svelte:window bind:innerWidth on:keydown={handleKeydown} />

<header
  data-site-header
  use:preserveHeaderFocus
  class="site-header fixed top-0 left-0 right-0 z-50 pointer-events-none {visualHome && scrollY < 50 ? 'header-visual' : 'header-paper'}"
>
  <div bind:this={navShell} style={`--nav-popover-height: ${popoverHeight}px`} class="nav-shell pointer-events-auto mx-auto relative">
    <div class="header-row">
      <a href="/" on:click={closeAll} aria-label="Jeremy 首頁" data-site-brand class="brand-link site-brand">
        <span class="site-brand-name">Jeremy</span>
        <span class="site-brand-studio">Solunastre Studio</span>
      </a>

      <div class="header-controls">
        <nav class="site-nav" aria-label="主要導覽">
          <div class="desktop-nav">
            {#each rootItems as menuItem}
              {#if isGroup(menuItem)}
                <button data-site-notes aria-expanded={desktopOpenGroup === menuItem} class:nav-active={isActive(menuItem)} on:click={(event) => openDesktopGroup(menuItem, event.currentTarget)}>
                  <span>{menuItem.title}</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.2" class:chevron-open={desktopOpenGroup === menuItem}><path d="m5 7 5 5 5-5" /></svg>
                </button>
              {:else if menuItem.href !== '/blog'}
                <a href={menuItem.href} aria-current={isActive(menuItem) ? 'page' : undefined} class:nav-active={isActive(menuItem)}>{menuItem.title}</a>
              {/if}
            {/each}
          </div>
          <a href="/blog" class="blog-link" data-site-blog data-site-reading class:nav-active={blogActive} aria-current={normalizePath(currentPath) === '/blog' ? 'page' : undefined}>Blog</a>
        </nav>
        <button bind:this={mobileMenuTrigger} data-site-menu on:click={toggleMobileMenu} aria-label={isMobileMenuOpen ? '關閉選單' : '開啟選單'} aria-expanded={isMobileMenuOpen} class="mobile-menu-trigger">
          <span class="hamburger-line {isMobileMenuOpen ? 'rotate-45' : '-translate-y-[5px]'}"></span>
          <span class="hamburger-line {isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}"></span>
          <span class="hamburger-line {isMobileMenuOpen ? '-rotate-45' : 'translate-y-[5px]'}"></span>
        </button>
        <div class="search-control">
          <SearchBtn onClick={toggleSearch} expanded={isSearchOpen} />
          <button
            data-site-music
            data-enabled={music.enabled}
            data-playing={music.playing}
            data-blocked={music.blocked}
            class="music-control"
            on:click={toggleMusic}
            aria-label={musicLabel}
            aria-pressed={music.enabled}
            title={`${MUSIC_TITLE} · ${musicStatus}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">
              <path d="m11 5-6 4H2v6h3l6 4V5Z" />
              {#if !music.enabled}
                <path d="m16 9 5 6m0-6-5 6" />
              {:else if music.playing}
                <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>

    {#if isPanelOpen}
      <div
        data-menu-panel
        class="nav-popover menu-popover {popoverUp ? 'popover-up' : ''}"
        in:fly={{ y: -8, duration: 200, easing: cubicOut }}
        out:fly={{ y: -8, duration: innerWidth < 1024 ? 0 : 200, easing: cubicOut }}
      >
        <div
          class="
            bg-paper
            p-2.5 lg:p-2 text-xs
            popover-surface custom-scrollbar
          "
        >
          <div class="flex items-center justify-between min-h-11 mb-1 pl-2 border-b border-line sticky top-0 bg-paper z-10">
             {#key desktopTitle}
              <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint ml-1" in:fade|local={{ duration: 150 }}>
                {desktopTitle}
              </div>
             {/key}
            <button aria-label="關閉選單" class="btn btn-ghost btn-circle w-11 h-11 min-h-11 text-ink-faint hover:text-ink hover:bg-ink/10 transition-colors" on:click={closePanels}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12" /><path d="M18 6 6 18" /></svg>
            </button>
          </div>

          {#if innerWidth < 1024}
            <div class="mb-2">
              <a
                href="/"
                on:click={closeAll}
                class="
                  flex items-center gap-3 px-3 py-3 menu-action w-full
                  text-ink font-bold tracking-widest uppercase
                  hover:bg-ink/5 hover:text-moss transition-all duration-200
                "
              >
                <div class="w-8 h-8 menu-icon bg-ink/5 flex items-center justify-center text-moss">
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
              initialAtRoot={isMobileMenuOpen}
              onBackToRoot={() => { if (!isMobileMenuOpen) closePanels() }}
              onClose={closePanels}
              onTitleChange={(title) => {
                if (title) {
                  desktopTitle = title
                } else {
                  desktopTitle = isMobileMenuOpen ? 'MENU' : (desktopOpenGroup?.title || '')
                }
              }}
            />
          {/key}

          {#if innerWidth < 1024}
            <div class="mobile-menu-tools">
              <button data-mobile-search class="mobile-tool-row" on:click={openMobileSearch}>
                <span class="mobile-tool-label">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                  <span>搜尋文章</span>
                </span>
                <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m7 5 5 5-5 5" /></svg>
              </button>
              <button
                data-site-music
                data-mobile-music
                data-enabled={music.enabled}
                data-playing={music.playing}
                data-blocked={music.blocked}
                class="mobile-tool-row"
                on:click={toggleMusic}
                aria-label={musicLabel}
                aria-pressed={music.enabled}
                title={MUSIC_TITLE}
              >
                <span class="mobile-tool-label">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m11 5-6 4H2v6h3l6 4V5Z" />
                    {#if !music.enabled}
                      <path d="m16 9 5 6m0-6-5 6" />
                    {:else if music.playing}
                      <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />
                    {/if}
                  </svg>
                  <span>背景音樂</span>
                </span>
                <span class="mobile-music-status">{musicStatus}</span>
              </button>
            </div>
            <div class="mt-2 pt-2 border-t border-line">
              <button
                on:click={scrollToTop}
                class="
                  flex items-center justify-center gap-2 px-3 py-3 menu-action w-full
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
        data-search-panel
        class="nav-popover search-popover {popoverUp ? 'popover-up' : ''}"
        in:fly={{ y: -8, duration: 200, easing: cubicOut }}
        out:fly={{ y: -8, duration: innerWidth < 1024 ? 0 : 200, easing: cubicOut }}
      >
        <div
          class="
            bg-paper text-xs
            popover-surface custom-scrollbar
          "
        >
          <SearchPanel onClose={closeSearch} />
        </div>
      </div>
    {/if}

  </div>
</header>

{#if (desktopOpenGroup && innerWidth >= 1024) || isMobileMenuOpen || isSearchOpen}
  <button
    class="fixed inset-0 z-40 cursor-default focus:outline-none"
    aria-label="關閉面板"
    on:click={closePanels}
  ></button>
{/if}

<style>
  .nav-popover { position: absolute; top: 100%; right: 0; width: min(380px, calc(100vw - 48px)); padding-top: 12px; z-index: 50; }
  .nav-popover.popover-up { top: auto; bottom: 100%; padding-top: 0; padding-bottom: 12px; }
  .popover-surface { max-height: min(calc(100dvh - 124px), var(--nav-popover-height)); overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; border: 1px solid color-mix(in srgb, var(--color-line) 75%, transparent); border-radius: var(--radius-panel); box-shadow: 0 16px 44px -24px color-mix(in srgb, var(--color-ink) 24%, transparent); }
  .menu-action { border-radius: var(--radius-control); }
  .menu-icon { border-radius: var(--radius-small); }
  @media (min-width: 1024px) {
    .menu-popover { width: 400px; right: 136px; }
    .search-popover { width: 640px; right: 48px; }
  }
  .site-header { color: var(--color-ink); transition: background-color 220ms ease; }
  .header-visual { background: transparent; }
  .header-paper { background: var(--color-paper); }
  .nav-shell { width: min(var(--site-shell-max), calc(100% - 2 * var(--site-shell-gutter))); min-height: 112px; }
  .header-row { min-height: 112px; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 32px; }
  .brand-link { width: fit-content; color: var(--color-ink); text-decoration: none; }
  .brand-link:hover { color: var(--color-brand); }
  .header-controls { display: flex; justify-self: end; align-items: center; gap: 24px; }
  .site-nav { display: flex; align-items: center; gap: 28px; }
  .desktop-nav { display: flex; align-items: center; gap: 28px; }
  .site-nav :is(a, button) { min-height: 44px; display: inline-flex; align-items: center; gap: 8px; color: var(--color-ink); font: 500 0.9375rem var(--font-body); text-decoration: none; white-space: nowrap; background: none; border: 0; padding: 0; cursor: pointer; }
  .site-nav :is(a, button):hover, .site-nav .nav-active { color: var(--color-brand); text-decoration: underline; text-underline-offset: 7px; text-decoration-thickness: 1px; }
  .desktop-nav svg { transition: transform 180ms ease; }
  .chevron-open { transform: rotate(180deg); }
  .search-control { display: flex; align-items: center; gap: 4px; padding-left: 16px; border-left: 1px solid var(--color-line); }
  .search-control :global(#site-search-trigger) { width: 44px; flex: none; }
  .music-control { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; flex: none; padding: 0; border: 0; border-radius: var(--radius-control); color: var(--color-ink-soft); background: transparent; cursor: pointer; transition: color 180ms ease-out, background-color 180ms ease-out; }
  .music-control:hover { color: var(--color-ink); background: color-mix(in srgb, var(--color-ink) 5%, transparent); }
  .music-control[data-enabled='false'], .music-control[data-blocked='true'] { color: var(--color-ink-faint); }
  .music-control:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 3px; }
  .mobile-menu-tools { display: grid; gap: 4px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-line); }
  .mobile-tool-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; min-height: 48px; padding: 12px 16px; border: 0; border-radius: var(--radius-control); color: var(--color-ink); background: transparent; text-align: left; cursor: pointer; transition: background-color 180ms ease-out; }
  .mobile-tool-row:hover { background: color-mix(in srgb, var(--color-ink) 5%, transparent); }
  .mobile-tool-label { display: inline-flex; align-items: center; gap: 12px; font-size: 16px; line-height: 1.5; }
  .mobile-tool-label svg { flex: none; }
  .mobile-music-status { color: var(--color-ink-soft); font-size: 12px; line-height: 1.5; text-align: right; }
  .mobile-menu-trigger { position: relative; display: none; align-items: center; justify-content: center; width: 44px; height: 44px; flex: none; padding: 0; background: none; border: 0; color: var(--color-ink); cursor: pointer; }
  @media (max-width: 1023px) {
    .site-nav, .search-control { display: none; }
    .desktop-nav { display: none; }
    .mobile-menu-trigger { display: inline-flex; }
    .header-controls { gap: 14px; }
  }
  @media (max-width: 767px) {
    .nav-shell { min-height: 96px; }
    .header-row { min-height: 96px; gap: 12px; }
    .header-controls { gap: 4px; }
    .site-nav .blog-link { font-size: 13px; }
    .search-control { padding-left: 8px; }
    .popover-surface { max-height: min(calc(100dvh - 120px), var(--nav-popover-height)); }
  }
  @media (max-width: 359px) {
    .header-row { gap: 8px; }
    .header-controls { gap: 0; }
    .site-nav .blog-link { font-size: 12px; }
    .search-control { padding-left: 6px; }
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--color-moss) 25%, transparent);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--color-moss) 45%, transparent);
  }

  .hamburger-line {
    position: absolute;
    width: 16px;
    height: 1.5px;
    border-radius: 1px;
    background: currentColor;
    /* Tailwind 4 rotate/translate/scale utilities compile to standalone properties, not transform */
    transition:
      translate 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      rotate 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      scale 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s;
  }
</style>
