<!--
  Interactive 2D array grid diagram.
  Click a cell to see its access syntax matrix[row][col].
-->

<script>
  let selected = null

  const matrix = [
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12],
  ]
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-ink-faint font-mono leading-relaxed">
      int[][] matrix = &#123;&#123;1..4&#125;, &#123;5..8&#125;, &#123;9..12&#125;&#125;
      <span class="hidden sm:inline">— 點擊格子查看存取語法</span>
      <span class="sm:hidden">— 點擊格子</span>
    </p>
  </div>

  <div class="px-4 pb-5 overflow-x-auto">
    <div class="flex flex-col items-center">

      <!-- Column headers -->
      <div class="flex items-center mb-1">
        <div class="w-12 shrink-0"></div>
        {#each matrix[0] as _, c}
          <div class="w-12 text-center text-xs text-ink-faint font-mono">col {c}</div>
        {/each}
      </div>

      <!-- Grid rows -->
      {#each matrix as row, r}
        <div class="flex items-center mb-1">
          <div class="w-12 text-right pr-2 text-xs text-ink-faint font-mono shrink-0">row {r}</div>
          {#each row as val, c}
            <button
              on:click={() => selected = (selected?.r === r && selected?.c === c) ? null : { r, c }}
              class="w-12 h-10 flex items-center justify-center border text-sm font-bold font-mono transition-all
                {selected?.r === r && selected?.c === c
                  ? 'bg-[#ebe5f0] border-[#9181a8] text-[#5f5078]'
                  : selected !== null && (selected.r === r || selected.c === c)
                  ? 'bg-[#f0eee8] border-[#d6d1c5] text-[#5d574d]'
                  : 'bg-paper border-line text-ink-soft hover:border-moss/50 hover:text-ink'}"
            >
              {val}
            </button>
          {/each}
        </div>
      {/each}

      <!-- Access notation -->
      <div class="mt-3 min-h-[2rem] flex items-center justify-center">
        {#if selected}
          <code class="text-xs font-mono text-[#5f5078] bg-[#ebe5f0] px-3 py-1.5 rounded border border-[#9181a8]/50">
            matrix[{selected.r}][{selected.c}] = {matrix[selected.r][selected.c]}
          </code>
        {:else}
          <p class="text-xs text-ink-faint font-mono">點擊上方格子查看存取語法</p>
        {/if}
      </div>

    </div>
  </div>
</div>
