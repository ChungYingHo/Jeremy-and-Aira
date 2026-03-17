<script>
  let activeMode = 'preorder'
  let step = -1
  let playing = false
  let timer = null

  const nodes = [
    { id: 5, x: 250, y: 52 },
    { id: 3, x: 125, y: 152 },
    { id: 7, x: 375, y: 152 },
    { id: 1, x: 62,  y: 252 },
    { id: 4, x: 188, y: 252 },
    { id: 6, x: 312, y: 252 },
    { id: 8, x: 438, y: 252 },
  ]

  const rawEdges = [
    [5, 3], [5, 7], [3, 1], [3, 4], [7, 6], [7, 8]
  ]

  const orders = {
    preorder:  [5, 3, 1, 4, 7, 6, 8],
    inorder:   [1, 3, 4, 5, 6, 7, 8],
    postorder: [1, 4, 3, 6, 8, 7, 5],
    bfs:       [5, 3, 7, 1, 4, 6, 8],
  }

  const modeLabels = [
    { key: 'preorder',  label: '前序 Preorder'  },
    { key: 'inorder',   label: '中序 Inorder'   },
    { key: 'postorder', label: '後序 Postorder' },
    { key: 'bfs',       label: 'BFS 層序'       },
  ]

  // precompute node lookup
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  $: order = orders[activeMode]
  $: playLabel = playing ? '暫停' : (step >= order.length - 1 ? '重播' : '播放')

  // recompute display data whenever step or order changes
  let nodeDisplay = []
  let edgeDisplay = []

  $: {
    const visited = new Set(step >= 0 ? order.slice(0, step + 1) : [])
    const cur = step >= 0 ? order[step] : null

    nodeDisplay = nodes.map(n => ({
      ...n,
      fill:   n.id === cur      ? '#4c1d95'
            : visited.has(n.id) ? '#1e3a5f'
            :                     '#0f172a',
      stroke: n.id === cur      ? '#a78bfa'
            : visited.has(n.id) ? '#3b82f6'
            :                     '#334155',
      text:   n.id === cur      ? '#ede9fe'
            : visited.has(n.id) ? '#93c5fd'
            :                     '#475569',
    }))

    edgeDisplay = rawEdges.map(([a, b]) => ({
      x1: nodeMap[a].x, y1: nodeMap[a].y,
      x2: nodeMap[b].x, y2: nodeMap[b].y,
      color: visited.has(a) && visited.has(b) ? '#2563eb' : '#1e293b',
    }))
  }

  function selectMode(mode) {
    if (timer) { clearInterval(timer); timer = null }
    playing = false
    activeMode = mode
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
      BST 以插入順序 5 → 3 → 7 → 1 → 4 → 6 → 8 建立
    </p>
    <div class="flex flex-wrap gap-2 justify-center">
      {#each modeLabels as { key, label }}
        <button
          on:click={() => selectMode(key)}
          class="px-3 py-1 rounded-lg text-xs font-medium transition-colors border
            {activeMode === key
              ? 'bg-violet-900/60 text-violet-200 border-violet-600'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'}"
        >
          {label}
        </button>
      {/each}
    </div>
  </div>

  <svg viewBox="0 0 500 295" class="w-full px-1" xmlns="http://www.w3.org/2000/svg">
    {#each edgeDisplay as edge}
      <line
        x1={edge.x1} y1={edge.y1}
        x2={edge.x2} y2={edge.y2}
        stroke={edge.color}
        stroke-width="2"
        stroke-linecap="round"
        style="transition: stroke 0.35s"
      />
    {/each}
    {#each nodeDisplay as node}
      <circle
        cx={node.x} cy={node.y} r="22"
        fill={node.fill}
        stroke={node.stroke}
        stroke-width="2"
        style="transition: fill 0.35s, stroke 0.35s"
      />
      <text
        x={node.x} y={node.y + 5}
        text-anchor="middle"
        font-size="15"
        font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill={node.text}
        style="transition: fill 0.35s; user-select: none; pointer-events: none"
      >{node.id}</text>
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
