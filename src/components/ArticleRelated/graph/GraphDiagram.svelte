<script>
  let activeMode = 'bfs'
  let step = -1
  let playing = false
  let timer = null

  // pentagon layout: 0 top, 1 left, 3 right, 2 bottom-left, 4 bottom-right
  const vertices = [
    { id: 0, x: 250, y: 58  },
    { id: 1, x: 78,  y: 192 },
    { id: 2, x: 130, y: 332 },
    { id: 3, x: 422, y: 192 },
    { id: 4, x: 370, y: 332 },
  ]

  const rawEdges = [
    [0, 1], [0, 3], [1, 2], [2, 4], [3, 4]
  ]

  const modes = {
    dfs: {
      label: 'DFS 深度優先',
      order: [0, 1, 2, 4, 3],
      // edge used to reach order[i]; null = start node
      treeEdges: [null, [0,1], [1,2], [2,4], [4,3]],
    },
    bfs: {
      label: 'BFS 廣度優先',
      order: [0, 1, 3, 2, 4],
      treeEdges: [null, [0,1], [0,3], [1,2], [3,4]],
    },
  }

  // precompute vertex lookup
  const vertexMap = Object.fromEntries(vertices.map(v => [v.id, v]))

  $: mode = modes[activeMode]
  $: order = mode.order
  $: playLabel = playing ? '暫停' : (step >= order.length - 1 ? '重播' : '播放')

  let vertexDisplay = []
  let edgeDisplay = []

  $: {
    const visited = new Set(step >= 0 ? order.slice(0, step + 1) : [])
    const cur = step >= 0 ? order[step] : null

    // collect tree edges revealed so far
    const treeEdgeSet = new Set()
    if (step >= 0) {
      mode.treeEdges.slice(0, step + 1).forEach(e => {
        if (e) treeEdgeSet.add(`${Math.min(e[0],e[1])}-${Math.max(e[0],e[1])}`)
      })
    }

    vertexDisplay = vertices.map(v => ({
      ...v,
      fill:   v.id === cur      ? '#4c1d95'
            : visited.has(v.id) ? '#1e3a5f'
            :                     '#0f172a',
      stroke: v.id === cur      ? '#a78bfa'
            : visited.has(v.id) ? '#3b82f6'
            :                     '#334155',
      text:   v.id === cur      ? '#ede9fe'
            : visited.has(v.id) ? '#93c5fd'
            :                     '#475569',
    }))

    edgeDisplay = rawEdges.map(([a, b]) => {
      const key = `${Math.min(a,b)}-${Math.max(a,b)}`
      return {
        x1: vertexMap[a].x, y1: vertexMap[a].y,
        x2: vertexMap[b].x, y2: vertexMap[b].y,
        color: treeEdgeSet.has(key) ? '#2563eb' : '#1e293b',
        width: treeEdgeSet.has(key) ? 2.5 : 1.5,
      }
    })
  }

  function selectMode(m) {
    if (timer) { clearInterval(timer); timer = null }
    playing = false
    activeMode = m
    step = -1
  }

  function togglePlay() {
    if (playing) {
      clearInterval(timer)
      timer = null
      playing = false
      return
    }
    if (step >= order.length - 1) step = -1
    playing = true
    timer = setInterval(() => {
      step += 1
      if (step >= order.length - 1) {
        clearInterval(timer)
        timer = null
        playing = false
      }
    }, 700)
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null }
    playing = false
    step = -1
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-1">
    <p class="text-center text-xs text-slate-500 mb-3 font-mono">
      無向圖：5 個頂點，邊為 0–1, 0–3, 1–2, 2–4, 3–4
    </p>
    <div class="flex flex-wrap gap-2 justify-center">
      {#each Object.entries(modes) as [key, m]}
        <button
          on:click={() => selectMode(key)}
          class="px-3 py-1 rounded-lg text-xs font-medium transition-colors border
            {activeMode === key
              ? 'bg-violet-900/60 text-violet-200 border-violet-600'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'}"
        >
          {m.label}
        </button>
      {/each}
    </div>
  </div>

  <svg viewBox="0 0 500 385" class="w-full px-1" xmlns="http://www.w3.org/2000/svg">
    {#each edgeDisplay as edge}
      <line
        x1={edge.x1} y1={edge.y1}
        x2={edge.x2} y2={edge.y2}
        stroke={edge.color}
        stroke-width={edge.width}
        stroke-linecap="round"
        style="transition: stroke 0.35s, stroke-width 0.35s"
      />
    {/each}
    {#each vertexDisplay as v}
      <circle
        cx={v.x} cy={v.y} r="24"
        fill={v.fill}
        stroke={v.stroke}
        stroke-width="2"
        style="transition: fill 0.35s, stroke 0.35s"
      />
      <text
        x={v.x} y={v.y + 5}
        text-anchor="middle"
        font-size="16"
        font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill={v.text}
        style="transition: fill 0.35s; user-select: none; pointer-events: none"
      >{v.id}</text>
    {/each}
  </svg>

  <div class="px-4 pb-4">
    <div class="flex items-center justify-center gap-3 mb-4">
      <button
        on:click={togglePlay}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
          bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500"
      >
        {playLabel}
      </button>
      <button
        on:click={reset}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
          bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
      >
        重置
      </button>
    </div>

    <div class="flex flex-wrap gap-1.5 justify-center items-center min-h-[2rem]">
      <span class="text-slate-500 text-xs mr-1">走訪順序：</span>
      {#each order as id, i}
        <span
          class="w-7 h-7 flex items-center justify-center rounded text-xs font-bold font-mono border transition-all
            {i === step
              ? 'bg-violet-900/70 text-violet-200 border-violet-500'
              : i < step
              ? 'bg-blue-900/40 text-blue-300 border-blue-800/60'
              : 'bg-slate-800/60 text-slate-600 border-slate-700/50'}"
        >
          {id}
        </span>
      {/each}
    </div>
  </div>
</div>
