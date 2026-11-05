<script lang="ts">
  import { onMount } from 'svelte'

  export let label: string
  export let minWidth = 500

  let viewport: HTMLDivElement
  let overflows = false

  onMount(() => {
    const update = () => {
      overflows = viewport.scrollWidth > viewport.clientWidth + 1
    }
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    const drawing = viewport.querySelector('svg')
    if (drawing) observer.observe(drawing)
    update()
    return () => observer.disconnect()
  })
</script>

<div class="diagram-frame" data-diagram-frame>
  {#if overflows}
    <p class="diagram-hint" data-diagram-hint>左右滑動查看完整圖解</p>
  {/if}
  <div
    bind:this={viewport}
    class="diagram-viewport"
    data-diagram-viewport
    data-overflow={overflows}
    style={`--diagram-min-width: ${minWidth}px`}
    role="region"
    aria-label={overflows ? `${label}，可左右捲動` : label}
    tabindex={overflows ? 0 : -1}
  >
    <slot />
  </div>
</div>
