<!--
  Shows how the same graph (5 vertices, edges 0-1, 0-3, 1-2, 2-4, 3-4)
  is represented as an Adjacency Matrix vs. Adjacency List.
  Hover a vertex to highlight corresponding entries.
-->

<script>
  let mode = 'matrix'
  let hovered = null

  const n = 5
  const edges = [[0,1],[0,3],[1,2],[2,4],[3,4]]

  const matrix = Array.from({ length: n }, () => Array(n).fill(0))
  edges.forEach(([u, v]) => { matrix[u][v] = 1; matrix[v][u] = 1 })

  const adjList = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adjList[u].push(v); adjList[v].push(u) })

  const verts = [
    { id: 0, x: 130, y: 34  },
    { id: 1, x: 44,  y: 110 },
    { id: 2, x: 74,  y: 205 },
    { id: 3, x: 216, y: 110 },
    { id: 4, x: 186, y: 205 },
  ]
  const vertMap = Object.fromEntries(verts.map(v => [v.id, v]))

  function isHighlighted(row, col) {
    return hovered !== null && (row === hovered || col === hovered)
  }

  function isActive(row, col) {
    return hovered !== null && (row === hovered || col === hovered) && matrix[row][col] === 1
  }

  function edgeColor(u, v) {
    return (hovered !== null && (u === hovered || v === hovered)) ? '#2563eb' : '#1e293b'
  }

  function vertFill(id)   { return id === hovered ? '#1e3a5f' : '#0f172a' }
  function vertStroke(id) { return id === hovered ? '#3b82f6' : '#334155' }
  function vertText(id)   { return id === hovered ? '#93c5fd' : '#475569' }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">

  <!-- Header: description + mode toggle -->
  <div class="px-4 pt-4 pb-3 flex flex-col items-center gap-3">
    <p class="text-xs text-slate-500 font-mono text-center">
      無向圖：5 個頂點，邊為 0–1, 0–3, 1–2, 2–4, 3–4
      <span class="hidden sm:inline">— 滑鼠移過頂點查看關聯</span>
    </p>
    <div class="flex gap-2">
      {#each [['matrix','鄰接矩陣'], ['list','鄰接串列']] as [key, label]}
        <button
          on:click={() => mode = key}
          class="px-3 py-1 rounded-lg text-xs font-medium border transition-colors
            {mode === key
              ? 'bg-violet-900/60 text-violet-200 border-violet-600'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'}"
        >{label}</button>
      {/each}
    </div>
  </div>

  <!-- Body: graph + representation, stacked on mobile / side-by-side on sm+ -->
  <div class="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 px-4 pb-5">

    <!-- Mini graph -->
    <div class="flex justify-center sm:block sm:shrink-0">
      <svg viewBox="0 0 260 240" class="w-full max-w-[180px] sm:w-[180px]" xmlns="http://www.w3.org/2000/svg">
        {#each edges as [u, v]}
          <line
            x1={vertMap[u].x} y1={vertMap[u].y}
            x2={vertMap[v].x} y2={vertMap[v].y}
            stroke={edgeColor(u, v)} stroke-width="2" stroke-linecap="round"
            style="transition: stroke 0.2s"
          />
        {/each}
        {#each verts as v}
          <circle
            cx={v.x} cy={v.y} r="20"
            fill={vertFill(v.id)} stroke={vertStroke(v.id)} stroke-width="2"
            style="transition: fill 0.2s, stroke 0.2s; cursor: pointer"
            role="button"
            tabindex="0"
            on:mouseenter={() => hovered = v.id}
            on:mouseleave={() => hovered = null}
            on:focus={() => hovered = v.id}
            on:blur={() => hovered = null}
          />
          <text x={v.x} y={v.y + 5} text-anchor="middle"
            font-size="14" font-weight="bold" font-family="'JetBrains Mono', monospace"
            fill={vertText(v.id)}
            style="transition: fill 0.2s; pointer-events: none; user-select: none"
          >{v.id}</text>
        {/each}
      </svg>
    </div>

    <!-- Representation panel -->
    <div class="flex-1 min-w-0">
      {#if mode === 'matrix'}
        <div class="overflow-x-auto">
          <table class="border-collapse font-mono text-xs mx-auto">
            <thead>
              <tr>
                <th class="w-8 h-8 text-slate-600"></th>
                {#each Array.from({length: n}, (_, i) => i) as c}
                  <th class="w-8 h-8 text-center text-slate-500 font-normal">{c}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each matrix as row, r}
                <tr>
                  <td class="w-8 h-8 text-center text-slate-500 pr-1">{r}</td>
                  {#each row as val, c}
                    <td
                      class="w-8 h-8 text-center border font-bold transition-all
                        {isActive(r, c)
                          ? 'bg-blue-900/50 border-blue-700 text-blue-200'
                          : isHighlighted(r, c)
                          ? 'bg-slate-800/60 border-slate-600 text-slate-400'
                          : 'bg-[#0f172a] border-slate-800 text-slate-600'}"
                      on:mouseenter={() => hovered = r}
                      on:mouseleave={() => hovered = null}
                      on:focus={() => hovered = r}
                      on:blur={() => hovered = null}
                    >{val}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="text-xs text-slate-600 font-mono mt-3 text-center">matrix[i][j] = 1 表示 i 與 j 之間有邊</p>

      {:else}
        <div class="flex flex-col gap-1.5">
          {#each adjList as neighbors, v}
            <div
              role="button"
              tabindex="0"
              class="flex items-center gap-2 px-3 py-2 rounded border transition-all font-mono text-xs
                {hovered === v ? 'bg-slate-800/80 border-blue-800/60' : 'bg-[#0f172a] border-slate-800'}"
              on:mouseenter={() => hovered = v}
              on:mouseleave={() => hovered = null}
              on:focus={() => hovered = v}
              on:blur={() => hovered = null}
            >
              <span class="font-bold w-4 {hovered === v ? 'text-blue-300' : 'text-slate-400'}">{v}</span>
              <span class="text-slate-700 mx-1">→</span>
              <span class="flex flex-wrap gap-1.5">
                {#each neighbors as nb}
                  <span class="px-1.5 py-0.5 rounded border
                    {hovered === v
                      ? 'bg-blue-900/40 border-blue-700/60 text-blue-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'}">
                    {nb}
                  </span>
                {/each}
              </span>
            </div>
          {/each}
        </div>
        <p class="text-xs text-slate-600 font-mono mt-3 text-center">每個頂點列出其所有相鄰頂點</p>
      {/if}
    </div>

  </div>
</div>
