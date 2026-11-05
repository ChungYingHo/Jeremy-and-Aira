<script lang="ts">
  import { onMount } from 'svelte'

  export let onClose: () => void 
  
  let errorMsg = ''

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.pagefind-ui__result-link')) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    const container = document.getElementById('pagefind-search')
    container?.addEventListener('click', handleClick)

    const initPagefind = async () => {
      if (!(window as any).PagefindUI) {
        try {
          await loadScript('/pagefind/pagefind-ui.js')
        } catch (e) {
          try {
             await loadScript('/_pagefind/pagefind-ui.js')
          } catch (e2) {
             console.error('Pagefind script load error:', e2)
             errorMsg = '搜尋暫時無法載入，請稍後再試。'
             return
          }
        }
      }

      const PagefindUI = (window as any).PagefindUI
      if (PagefindUI) {
        try {
          new PagefindUI({
            element: '#pagefind-search',
            showImages: false,
            showSubResults: true,
            excerptLength: 15,
            baseUrl: '/', 
            translations: {
              placeholder: '輸入關鍵字…',
              zero_results: '找不到相關文章',
              clear_search: '清除'
            }
          })

          const input = document.querySelector('.pagefind-ui__search-input') as HTMLInputElement
          if (input) {
            input.focus({ preventScroll: true })
            input.addEventListener('click', (e) => e.stopPropagation())
          }
        } catch (e) {
          console.error('Pagefind init error:', e)
        }
      }
    }

    initPagefind()

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      container?.removeEventListener('click', handleClick)
    }
  })

  function loadScript(src: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error(`Script load error for ${src}`))
      document.body.appendChild(script)
    })
  }
</script>

<div class="search-surface flex flex-col h-full text-left relative bg-paper">
  <div class="search-heading flex items-center justify-between px-5 pt-5 pb-2 md:px-7 md:pt-6 md:pb-2 shrink-0">
    <div class="flex items-center gap-2 md:gap-3 text-ink-soft">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="text-sm font-medium">搜尋文章</span>
    </div>
    <div class="flex items-center gap-2">
       <span class="text-xs text-ink-faint hidden lg:inline-block">Esc 關閉</span>
       <button on:click={onClose} aria-label="關閉搜尋" class="lg:hidden text-ink-faint p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-ink/5">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12" /><path d="M18 6 6 18" /></svg>
       </button>
    </div>
  </div>

  <div class="px-5 pt-3 pb-5 md:px-7 md:pt-4 md:pb-7 overflow-y-auto custom-scrollbar flex-1 relative z-10">
    {#if errorMsg}
        <div class="search-error text-clay text-xs text-center mt-6 p-4 border border-clay/30 bg-clay/5">
          {errorMsg}
        </div>
    {/if}
    
    <div id="pagefind-search" class="w-full pagefind-ui"></div>
  </div>
</div>

<style>
  .search-surface { border-radius: inherit; }
  .search-error { border-radius: var(--radius-control); }
  :global(:root) {
    --pagefind-ui-scale: 0.85;
    --pagefind-ui-primary: var(--color-moss);
    --pagefind-ui-text: var(--color-ink);
    --pagefind-ui-background: var(--color-paper);
    --pagefind-ui-border: var(--color-line);
    --pagefind-ui-tag: var(--color-moss);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: var(--radius-control);
    --pagefind-ui-font: var(--font-body);
  }

  /* Pagefind form must stack vertically, or results squeeze the input sideways */
  :global(.pagefind-ui__form) {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
  }

  :global(.pagefind-ui__form::before),
  :global(.pagefind-ui__form::after) { display: none !important; }

  :global(.pagefind-ui__search-input) {
    width: 100% !important;
    background-color: color-mix(in srgb, var(--color-ink) 3%, transparent) !important;
    border: 1px solid var(--color-line) !important;
    color: var(--color-ink) !important;
    padding: 14px 16px !important;
    padding-right: 72px !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    border-radius: var(--radius-control) !important;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
    box-sizing: border-box !important;
    height: 54px !important;
  }

  @media (min-width: 768px) {
    :global(.pagefind-ui__search-input) {
      padding: 18px 22px !important;
      padding-right: 84px !important;
      font-size: 1.1rem !important;
      height: 60px !important;
    }
  }

  :global(.pagefind-ui__search-input:focus) {
    background-color: var(--color-paper) !important;
    border-color: var(--pagefind-ui-primary) !important;
    outline: none !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-moss) 14%, transparent) !important;
  }

  /* Anchored at half the input height instead of top:50% — the form grows when results render */
  :global(.pagefind-ui__search-clear) {
    position: absolute !important;
    right: 10px !important;
    z-index: 20 !important;
    top: 27px !important;
    transform: translateY(-50%) !important;
    background: transparent !important;
    color: var(--color-ink-faint) !important;
    padding: 8px !important;
    min-width: 44px !important;
    min-height: 44px !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    cursor: pointer !important;
    border-radius: var(--radius-small) !important;
  }

  @media (min-width: 768px) {
    :global(.pagefind-ui__search-clear) {
      top: 30px !important;
    }
  }
  
  :global(.pagefind-ui__search-clear:hover) {
    color: var(--color-moss) !important;
    background: color-mix(in srgb, var(--color-ink) 5%, transparent) !important;
  }

  :global(.pagefind-ui__drawer) {
    gap: 12px !important;
    padding-top: 16px !important;
    width: 100% !important;
  }

  :global(.pagefind-ui__result) {
    border: 0 !important;
    padding: 12px !important;
    border-radius: var(--radius-control) !important;
    background: transparent !important;
    transition: background-color 0.2s ease;
  }

  @media (min-width: 768px) {
    :global(.pagefind-ui__result) {
      padding: 16px !important;
    }
  }

  :global(.pagefind-ui__result:hover) {
    background-color: color-mix(in srgb, var(--color-ink) 4%, transparent) !important;
  }

  :global(.pagefind-ui__result-thumb) { display: none; }

  :global(.pagefind-ui__result-link) {
    color: var(--color-moss) !important;
    font-weight: 500 !important;
    font-size: 1rem !important;
    text-decoration: none !important;
    display: block !important;
    margin-bottom: 4px !important;
    line-height: 1.4 !important;
    word-break: break-word !important; 
  }
  
  @media (min-width: 768px) {
    :global(.pagefind-ui__result-link) {
      font-size: 1.1rem !important;
      margin-bottom: 6px !important;
    }
  }
  
  :global(.pagefind-ui__result-excerpt) {
    color: var(--color-ink-soft) !important;
    font-size: 0.85rem !important;
    line-height: 1.5 !important;
    font-weight: 400 !important;
    
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word !important;
  }

  @media (min-width: 768px) {
    :global(.pagefind-ui__result-excerpt) {
      font-size: 0.9rem !important;
      line-height: 1.6 !important;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }
  }
  
  :global(.pagefind-ui__result-excerpt mark) {
    background: color-mix(in srgb, var(--color-moss) 12%, transparent) !important;
    color: var(--color-moss) !important;
    font-weight: 600 !important;
    padding: 0 3px;
    border-radius: 3px;
  }

  :global(.pagefind-ui__message) {
      color: var(--color-ink-faint) !important;
      padding: 10px 4px !important;
      font-size: 0.9rem !important;
  }
</style>
