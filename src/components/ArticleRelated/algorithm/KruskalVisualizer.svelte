<script>
  const NODES = {
    A: { x: 65,  y: 105 },
    B: { x: 195, y: 105 },
    C: { x: 335, y: 105 },
    D: { x: 65,  y: 205 },
    E: { x: 195, y: 205 },
    F: { x: 335, y: 205 },
  }

  const ALL_EDGES = [
    ['A','B',4], ['B','C',3], ['D','E',7], ['E','F',9],
    ['A','D',1], ['B','E',2], ['C','F',6], ['A','E',8], ['C','E',5],
  ]

  // Sorted edge order for Kruskal + bottom edge list
  const SORTED = [
    ['A','D',1], ['B','E',2], ['B','C',3], ['A','B',4],
    ['C','E',5], ['C','F',6], ['D','E',7], ['A','E',8], ['E','F',9],
  ]

  const steps = [
    {
      mstEdges: [],
      skippedEdges: [],
      current: ['A','D',1],
      desc: '按權重排序所有邊，從最小的 A-D(1) 開始考慮',
    },
    {
      mstEdges: [['A','D']],
      skippedEdges: [],
      current: ['B','E',2],
      desc: 'A-D(1)：A 和 D 不同集合 → 加入！考慮下一條 B-E(2)',
    },
    {
      mstEdges: [['A','D'],['B','E']],
      skippedEdges: [],
      current: ['B','C',3],
      desc: 'B-E(2)：B 和 E 不同集合 → 加入！考慮下一條 B-C(3)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C']],
      skippedEdges: [],
      current: ['A','B',4],
      desc: 'B-C(3)：B 和 C 不同集合 → 加入！考慮下一條 A-B(4)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['A','B']],
      skippedEdges: [],
      current: ['C','E',5],
      desc: 'A-B(4)：A 和 B 不同集合 → 加入！考慮下一條 C-E(5)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['A','B']],
      skippedEdges: [['C','E']],
      current: ['C','F',6],
      desc: 'C-E(5)：C 和 E 已連通 → 跳過（會成環）！考慮 C-F(6)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['A','B'],['C','F']],
      skippedEdges: [['C','E']],
      current: null,
      desc: 'C-F(6)：C 和 F 不同集合 → 加入！已有 5 條邊，完成！總權重 = 1+2+3+4+6 = 16',
    },
  ]

  let stepIdx = 0

  $: step = steps[stepIdx]

  // Pre-compute per-edge state (same pattern as BubbleSortVisualizer)
  let edgeStates = []
  $: {
    const s = step
    edgeStates = ALL_EDGES.map(([u, v, w]) => {
      const isMst = s.mstEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isSkipped = s.skippedEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isCurrent = s.current
        ? ((s.current[0] === u && s.current[1] === v) || (s.current[0] === v && s.current[1] === u))
        : false
      const stroke = isMst ? '#3b82f6' : isCurrent ? '#f59e0b' : isSkipped ? '#ef4444' : '#1e293b'
      const labelFill = isMst ? '#93c5fd' : isCurrent ? '#fcd34d' : isSkipped ? '#fca5a5' : '#334155'
      const strokeW = isMst || isCurrent || isSkipped ? 2.5 : 1.5
      const dash = isMst || isCurrent || isSkipped ? 'none' : '4,3'
      const mx = (NODES[u].x + NODES[v].x) / 2
      const my = (NODES[u].y + NODES[v].y) / 2
      const dx = NODES[v].x - NODES[u].x
      const dy = NODES[v].y - NODES[u].y
      const len = Math.sqrt(dx * dx + dy * dy)
      const lx = mx + (-dy / len) * 10
      const ly = my + (dx / len) * 10
      return { u, v, w, stroke, labelFill, strokeW, dash, lx, ly }
    })
  }

  // Pre-compute sorted edge list pill states
  let sortedStates = []
  $: {
    const s = step
    sortedStates = SORTED.map(([u, v, w]) => {
      const isMst = s.mstEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isSkip = s.skippedEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isCur = s.current
        ? ((s.current[0] === u && s.current[1] === v) || (s.current[0] === v && s.current[1] === u))
        : false
      const bg = isMst ? '#1d3a6e' : isSkip ? '#3b1010' : isCur ? '#3b2a00' : '#0f172a'
      const border = isMst ? '#3b82f6' : isSkip ? '#ef4444' : isCur ? '#f59e0b' : '#1e293b'
      const fill = isMst ? '#93c5fd' : isSkip ? '#fca5a5' : isCur ? '#fcd34d' : '#475569'
      return { u, v, w, bg, border, fill }
    })
  }

  const R = 14
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 420 315" class="w-full" font-family="sans-serif">
    <text x="210" y="17" fill="#94a3b8" font-size="10" text-anchor="middle">Kruskal 演算法 — 從最小邊開始挑</text>

    {#each edgeStates as e}
      <line
        x1={NODES[e.u].x} y1={NODES[e.u].y}
        x2={NODES[e.v].x} y2={NODES[e.v].y}
        stroke={e.stroke} stroke-width={e.strokeW} stroke-dasharray={e.dash}
      />
      <text x={e.lx} y={e.ly} fill={e.labelFill} font-size="9.5" text-anchor="middle" dominant-baseline="middle">{e.w}</text>
    {/each}

    {#each Object.entries(NODES) as [id, pos]}
      <circle cx={pos.x} cy={pos.y} r={R} fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
      <text x={pos.x} y={pos.y} fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{id}</text>
    {/each}

    <!-- legend -->
    <line x1="14" y1="235" x2="32" y2="235" stroke="#3b82f6" stroke-width="2.5"/>
    <text x="36" y="239" fill="#94a3b8" font-size="9">MST 邊</text>
    <line x1="78" y1="235" x2="96" y2="235" stroke="#f59e0b" stroke-width="2.5"/>
    <text x="100" y="239" fill="#94a3b8" font-size="9">考慮中</text>
    <line x1="142" y1="235" x2="160" y2="235" stroke="#ef4444" stroke-width="2.5"/>
    <text x="164" y="239" fill="#94a3b8" font-size="9">跳過（成環）</text>

    <!-- sorted edge list -->
    {#each sortedStates as e, i}
      <rect x={14 + i * 44} y={249} width="40" height="20" rx="3" fill={e.bg} stroke={e.border} stroke-width="1"/>
      <text x={14 + i * 44 + 20} y={263} fill={e.fill} font-size="8.5" text-anchor="middle" dominant-baseline="middle">{e.u}-{e.v}({e.w})</text>
    {/each}

    <!-- step desc -->
    <text x="210" y="289" fill="#e2e8f0" font-size="10.5" text-anchor="middle">{step.desc}</text>
    <text x="210" y="307" fill="#475569" font-size="9.5" text-anchor="middle">步驟 {stepIdx + 1} / {steps.length}</text>
  </svg>

  <div class="flex justify-center gap-3 pb-4 px-4">
    <button
      on:click={() => { if (stepIdx > 0) stepIdx-- }}
      disabled={stepIdx === 0}
      class="px-4 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >上一步</button>
    <button
      on:click={() => { if (stepIdx < steps.length - 1) stepIdx++ }}
      disabled={stepIdx === steps.length - 1}
      class="px-4 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >下一步</button>
    <button
      on:click={() => stepIdx = 0}
      class="px-4 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 transition-all"
    >重置</button>
  </div>
</div>
