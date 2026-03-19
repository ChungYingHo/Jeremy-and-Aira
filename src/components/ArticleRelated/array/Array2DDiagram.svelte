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

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-slate-500 font-mono leading-relaxed">
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
          <div class="w-12 text-center text-xs text-slate-500 font-mono">col {c}</div>
        {/each}
      </div>

      <!-- Grid rows -->
      {#each matrix as row, r}
        <div class="flex items-center mb-1">
          <div class="w-12 text-right pr-2 text-xs text-slate-500 font-mono shrink-0">row {r}</div>
          {#each row as val, c}
            <button
              on:click={() => selected = (selected?.r === r && selected?.c === c) ? null : { r, c }}
              class="w-12 h-10 flex items-center justify-center border text-sm font-bold font-mono transition-all
                {selected?.r === r && selected?.c === c
                  ? 'bg-violet-900/60 border-violet-500 text-violet-200'
                  : selected !== null && (selected.r === r || selected.c === c)
                  ? 'bg-slate-800/60 border-slate-600 text-slate-400'
                  : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}"
            >
              {val}
            </button>
          {/each}
        </div>
      {/each}

      <!-- Access notation -->
      <div class="mt-3 min-h-[2rem] flex items-center justify-center">
        {#if selected}
          <code class="text-xs font-mono text-violet-300 bg-violet-900/20 px-3 py-1.5 rounded border border-violet-800/50">
            matrix[{selected.r}][{selected.c}] = {matrix[selected.r][selected.c]}
          </code>
        {:else}
          <p class="text-xs text-slate-600 font-mono">點擊上方格子查看存取語法</p>
        {/if}
      </div>

    </div>
  </div>
</div>
