<script lang="ts">
  import { onMount } from "svelte"
  import type { MenuItem, MenuGroup } from "@/models/menu"
  import DrilldownMenu from "@/components/DrilldownMenu.svelte"
  import { fade, slide } from "svelte/transition"

  export let rootItems: MenuItem[] = []
  export let currentPath = "" // 接收當前路徑

  let desktopOpenGroup: MenuGroup | null = null
  let desktopMenuElement: HTMLUListElement | null = null
  let desktopTitle = ""

  function isGroup(menuItem: MenuItem): menuItem is MenuGroup {
    return menuItem.type === "group"
  }

  // 遞迴檢查：某個 Group 是否包含當前路徑
  function groupContainsPath(group: MenuGroup, path: string): boolean {
    // 簡單優化：如果是 /notes 開頭且 Group Title 是 Notes，直接回傳 true
    // 但為了精確，我們遞迴檢查 children
    return group.children.some(child => {
      if (child.type === 'page') return child.href === path || path.startsWith(child.href)
      if (child.type === 'group') return groupContainsPath(child, path)
      return false
    })
  }

  function openDesktopGroup(menuGroup: MenuGroup, event: MouseEvent) {
    if (desktopOpenGroup && desktopOpenGroup.title === menuGroup.title) {
      closeDesktopPanel()
      return
    }
    desktopOpenGroup = menuGroup
    desktopTitle = menuGroup.title
  }

  function closeDesktopPanel() {
    desktopOpenGroup = null
    desktopTitle = ""
  }

  function isActive(item: MenuItem): boolean {
    if (desktopOpenGroup === item) return true
    if (isGroup(item)) return groupContainsPath(item, currentPath)
    return item.href === currentPath
  }
</script>

<header class="fixed top-0 left-0 right-0 z-50 mt-6 pointer-events-none">
  <div class="pointer-events-auto mx-auto w-fit flex justify-center items-center px-3 py-2 relative border border-white/10 bg-black/40 backdrop-blur-xl rounded-full shadow-2xl">

    <div class="hidden md:flex w-auto justify-center items-center gap-4 relative">
      <a 
        href="/" 
        class="
          group
          relative
          flex items-center justify-center 
          h-10 px-8 
          rounded-full 
          bg-gradient-to-b from-slate-50 via-slate-300 to-slate-400 
          text-slate-800 font-bold tracking-[0.2em] text-sm 
          shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] 
          border-t border-white/50
          ring-1 ring-slate-400/30
          hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)]
          active:scale-[0.98] active:brightness-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
          transition-all duration-300 ease-out
        "
      >
        <span class="drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          JEREMY & AIRA
        </span>
      </a>

      <ul class="menu menu-horizontal bg-transparent px-1 gap-2" bind:this={desktopMenuElement}>
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
    </div>

    {#if desktopOpenGroup && desktopMenuElement}
      <div
        class="absolute top-full left-0 z-50 w-full min-w-[320px] pt-4"
        transition:fade={{ duration: 120 }}
      >
        <div
          class="backdrop-blur-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-2 py-3 overflow-hidden"
          transition:slide={{ duration: 250, axis: "y" }}
        >
          <div class="flex items-center justify-between mb-1 px-3 pt-1 pb-2 border-b border-white/5">
            {#key desktopTitle}
              <div
                class="text-xs font-bold uppercase tracking-[0.2em] text-white/40 ml-1"
                in:fade={{ duration: 150 }}
              >
                {desktopTitle}
              </div>
            {/key}
            
            <button 
              class="btn btn-ghost btn-xs btn-circle text-white/40 hover:text-white hover:bg-white/10 transition-colors" 
              on:click={closeDesktopPanel}
            >
              ✕
            </button>
          </div>

          {#key desktopOpenGroup}
            <DrilldownMenu
              rootItems={rootItems}
              initialItems={desktopOpenGroup.children}
              currentPath={currentPath} 
              onBackToRoot={closeDesktopPanel}
              onClose={closeDesktopPanel}
              onTitleChange={(title) => (desktopTitle = title || desktopOpenGroup?.title || "")}
            />
          {/key}
        </div>
      </div>
    {/if}

  </div>
</header>

{#if desktopOpenGroup}
  <button class="fixed inset-0 z-40 cursor-default" aria-label="Close menu" on:click={closeDesktopPanel}></button>
{/if}