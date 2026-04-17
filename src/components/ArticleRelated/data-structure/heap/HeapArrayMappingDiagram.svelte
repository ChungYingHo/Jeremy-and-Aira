<script>
  // 1-indexed max-heap: index 0 is placeholder
  const HEAP = [null, 6, 5, 4, 1, 2, 3]
  const N = HEAP.length - 1

  // fixed positions for 1-indexed complete binary tree
  const POS = {
    1: { x: 250, y: 55  },
    2: { x: 150, y: 135 },
    3: { x: 350, y: 135 },
    4: { x: 85,  y: 215 },
    5: { x: 215, y: 215 },
    6: { x: 285, y: 215 },
    7: { x: 415, y: 215 },
  }

  const EDGES = [
    [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]
  ].filter(([_, c]) => c <= N)

  let selected = 1

  $: parent = selected > 1 ? Math.floor(selected / 2) : null
  $: left   = 2 * selected <= N     ? 2 * selected     : null
  $: right  = 2 * selected + 1 <= N ? 2 * selected + 1 : null

  function nodeFill(i) {
    if (i === selected) return '#4c1d95'
    if (i === parent) return '#1e3a5f'
    if (i === left || i === right) return '#14532d'
    return '#0f172a'
  }
  function nodeStroke(i) {
    if (i === selected) return '#a78bfa'
    if (i === parent) return '#3b82f6'
    if (i === left || i === right) return '#22c55e'
    return '#334155'
  }
  function nodeText(i) {
    if (i === selected) return '#ede9fe'
    if (i === parent) return '#93c5fd'
    if (i === left || i === right) return '#86efac'
    return '#64748b'
  }
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-slate-500 font-mono">
      Max-heap 陣列對應 · 1-indexed · 點擊任一節點查看 parent / left / right
    </p>
  </div>

  <svg viewBox="0 0 500 255" class="w-full px-1" xmlns="http://www.w3.org/2000/svg">
    {#each EDGES as [a, b]}
      <line
        x1={POS[a].x} y1={POS[a].y}
        x2={POS[b].x} y2={POS[b].y}
        stroke="#1e293b"
        stroke-width="2"
        stroke-linecap="round"
      />
    {/each}
    {#each HEAP.slice(1) as val, idx}
      {@const i = idx + 1}
      <g on:click={() => selected = i} style="cursor: pointer">
        <circle
          cx={POS[i].x} cy={POS[i].y} r="22"
          fill={nodeFill(i)}
          stroke={nodeStroke(i)}
          stroke-width="2"
          style="transition: fill 0.25s, stroke 0.25s"
        />
        <text
          x={POS[i].x} y={POS[i].y + 5}
          text-anchor="middle"
          font-size="15"
          font-weight="bold"
          font-family="'JetBrains Mono', monospace"
          fill={nodeText(i)}
          style="user-select: none; pointer-events: none"
        >{val}</text>
        <text
          x={POS[i].x} y={POS[i].y - 30}
          text-anchor="middle"
          font-size="10"
          font-family="'JetBrains Mono', monospace"
          fill="#475569"
          style="user-select: none; pointer-events: none"
        >idx {i}</text>
      </g>
    {/each}
  </svg>

  <div class="px-4 pb-2">
    <p class="text-center text-[11px] text-slate-600 font-mono mb-2">陣列表示（index 0 保留不用）</p>
    <div class="flex justify-center gap-0">
      {#each HEAP as val, i}
        <button
          on:click={() => { if (i > 0) selected = i }}
          disabled={i === 0}
          class="w-11 h-11 flex flex-col items-center justify-center border-r last:border-r-0 first:rounded-l last:rounded-r transition-colors
            {i === selected
              ? 'bg-violet-900/60 border-violet-500 text-violet-200'
              : i === parent
              ? 'bg-[#1e3a5f] border-blue-500 text-blue-200'
              : (i === left || i === right)
              ? 'bg-green-900/40 border-green-600 text-green-200'
              : i === 0
              ? 'bg-slate-900 border-slate-800 text-slate-700'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'}"
        >
          <span class="text-[10px] opacity-60">[{i}]</span>
          <span class="text-sm font-bold font-mono">{val ?? '—'}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="px-4 pb-4 mt-3">
    <div class="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 font-mono text-xs">
      <p class="text-slate-400 mb-2">
        選中 <span class="text-violet-300 font-bold">idx {selected}</span>，值 =
        <span class="text-violet-300 font-bold">{HEAP[selected]}</span>
      </p>
      <div class="space-y-1 text-slate-500">
        <p>
          parent = ⌊{selected} / 2⌋ =
          {#if parent !== null}
            <span class="text-blue-300 font-bold">{parent}</span>（值 =
            <span class="text-blue-300 font-bold">{HEAP[parent]}</span>）
          {:else}
            <span class="text-slate-600">—（根節點無父）</span>
          {/if}
        </p>
        <p>
          left = 2 × {selected} =
          {#if left !== null}
            <span class="text-green-300 font-bold">{left}</span>（值 =
            <span class="text-green-300 font-bold">{HEAP[left]}</span>）
          {:else}
            <span class="text-slate-600">—（超出範圍，無左子）</span>
          {/if}
        </p>
        <p>
          right = 2 × {selected} + 1 =
          {#if right !== null}
            <span class="text-green-300 font-bold">{right}</span>（值 =
            <span class="text-green-300 font-bold">{HEAP[right]}</span>）
          {:else}
            <span class="text-slate-600">—（超出範圍，無右子）</span>
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>
