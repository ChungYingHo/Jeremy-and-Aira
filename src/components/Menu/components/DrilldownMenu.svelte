<script lang="ts">
  import { fly } from "svelte/transition"
  import { cubicOut } from "svelte/easing"
  import type { MenuItem, MenuGroup } from "@/models/menu"

  export let rootItems: MenuItem[] = []
  export let initialItems: MenuItem[] | null = null
  export let currentPath = "" // 接收路徑

  export let onTitleChange: ((title: string) => void) | undefined = undefined
  export let onBackToRoot: (() => void) | undefined
  export let onClose: (() => void) | undefined

  let stack: MenuItem[][] = []
  let items: MenuItem[] = [] 
  let direction = 1 

  // --- 初始化邏輯 (Deep Linking) ---
  
  // 1. 遞迴尋找目標路徑的父層堆疊
  function findPathStack(
    currentItems: MenuItem[], 
    targetPath: string, 
    currentStack: MenuItem[][]
  ): { found: boolean, stack: MenuItem[][], finalItems: MenuItem[] } {
    
    for (const item of currentItems) {
      // 如果找到目標 Page
      if (item.type === 'page' && item.href === targetPath) {
        return { found: true, stack: currentStack, finalItems: currentItems }
      }

      // 如果是 Group，繼續往下找
      if (item.type === 'group') {
        const result = findPathStack(
          item.children, 
          targetPath, 
          [...currentStack, currentItems] // 把目前這一層加入 stack
        )
        if (result.found) {
          return result
        }
      }
    }
    return { found: false, stack: [], finalItems: [] }
  }

  // 2. 初始化
  function init() {
    const baseItems = initialItems ?? rootItems
    
    if (currentPath && currentPath !== '/') {
      const { found, stack: newStack, finalItems } = findPathStack(baseItems, currentPath, [])
      
      if (found) {
        stack = newStack
        items = finalItems
        // 如果有深入層級，記得通知父層更新標題
      } else {
        items = baseItems
      }
    } else {
      items = baseItems
    }
  }

  // 立即執行初始化
  init()

  // ------------------------------

  function isGroup(item: MenuItem): item is MenuGroup {
    return item.type === "group"
  }

  function enterGroup(item: MenuGroup) {
    onTitleChange?.(item.title)
    direction = 1
    stack = [...stack, items]
    items = item.children
  }

  function back() {
    if (stack.length === 0) {
      onBackToRoot?.()
      return
    }

    direction = -1
    items = stack[stack.length - 1]
    stack = stack.slice(0, -1)
    
    // Back 的時候標題邏輯可能需要優化，這裡先設回空字串讓父層顯示預設
    onTitleChange?.("")
  }

  // 🌟 自動滾動到 Active 項目的 Svelte Action
  function scrollToActive(node: HTMLElement, isActive: boolean) {
    if (isActive) {
      // 延遲 250ms 確保 Menu 的 slide/fade 動畫已展開完成，再進行滾動
      setTimeout(() => {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
    
    return {
      update(newIsActive: boolean) {
        if (newIsActive) {
          setTimeout(() => {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 250);
        }
      }
    }
  }
</script>

<div class="relative w-full grid grid-cols-1 grid-rows-1 transition-all duration-300 ease-out">
  {#key items}
    <ul
      class="menu menu-vertical w-full col-start-1 row-start-1 p-0 gap-1"
      in:fly={{ x: direction * 20, duration: 300, easing: cubicOut }}
      out:fly={{ x: direction * -20, duration: 300, easing: cubicOut }}
    >
      {#if stack.length > 0}
        <li class="mb-2 border-b border-white/5 pb-2">
          <button
            class="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
            on:click={back}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1">
              <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
            </svg>
            Back
          </button>
        </li>
      {/if}

      {#each items as item}
        <li>
          {#if isGroup(item)}
            <button
              class="group flex justify-between items-center w-full px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
              on:click={() => enterGroup(item)}
            >
              <span class="text-base font-medium tracking-wide">{item.title}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white/20 transition-all duration-300 group-hover:text-white group-hover:translate-x-1">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          {:else}
            <a
              href={item.href}
              use:scrollToActive={item.href === currentPath}
              class="group flex justify-between items-center w-full px-4 py-3 rounded-xl transition-all duration-200 {item.href === currentPath ? 'bg-white/20 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-white/10'}"
              on:click={onClose} 
            >
              <span class="text-base tracking-wide">{item.title}</span>
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  {/key}
</div>