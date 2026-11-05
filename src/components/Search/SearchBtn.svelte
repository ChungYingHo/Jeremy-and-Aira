<script lang="ts">
  // 接收點擊事件
  export let onClick: () => void
  export let expanded = false
  export let textLabel = ''
</script>

<button
  id="site-search-trigger"
  on:click={onClick}
  aria-label="搜尋文章"
  aria-expanded={expanded}
  class="
    group flex items-center justify-center h-11
    text-ink-soft hover:text-ink bg-transparent hover:bg-ink/5
    transition-all duration-300 active:scale-95
    {textLabel ? 'px-0' : 'w-9 sm:w-11'}
  "
>
  {#if textLabel}<span class="search-text">{textLabel}</span>{/if}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors {textLabel ? 'lg:hidden' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>

<style>
  .search-text { display: none; }
  @media (min-width: 1024px) { .search-text { display: inline; font-family: var(--font-body); font-size: 1rem; font-weight: 400; letter-spacing: 0.01em; } }
</style>
