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

  const steps = [
    {
      inTree: ['A'],
      mstEdges: [],
      candidates: [['A','D',1],['A','B',4],['A','E',8]],
      desc: '從 A 出發，列出所有可從 A 延伸的邊（候選邊）',
    },
    {
      inTree: ['A','D'],
      mstEdges: [['A','D']],
      candidates: [['A','B',4],['D','E',7],['A','E',8]],
      desc: '選最小候選邊 A-D(1)，把 D 拉進樹',
    },
    {
      inTree: ['A','D','B'],
      mstEdges: [['A','D'],['A','B']],
      candidates: [['B','E',2],['B','C',3],['D','E',7],['A','E',8]],
      desc: '選最小候選邊 A-B(4)，把 B 拉進樹',
    },
    {
      inTree: ['A','D','B','E'],
      mstEdges: [['A','D'],['A','B'],['B','E']],
      candidates: [['B','C',3],['C','E',5],['E','F',9]],
      desc: '選最小候選邊 B-E(2)，把 E 拉進樹',
    },
    {
      inTree: ['A','D','B','E','C'],
      mstEdges: [['A','D'],['A','B'],['B','E'],['B','C']],
      candidates: [['C','F',6],['E','F',9]],
      desc: '選最小候選邊 B-C(3)，把 C 拉進樹',
    },
    {
      inTree: ['A','D','B','E','C','F'],
      mstEdges: [['A','D'],['A','B'],['B','E'],['B','C'],['C','F']],
      candidates: [],
      desc: '選最小候選邊 C-F(6)，把 F 拉進樹 — 完成！總權重 1+4+2+3+6 = 16',
    },
  ]

  let stepIdx = 0

  $: step = steps[stepIdx]
  $: inTreeSet = new Set(step.inTree)

  // Pre-compute per-edge state as a reactive array (same pattern as BubbleSortVisualizer)
  let edgeStates = []
  $: {
    const s = step
    edgeStates = ALL_EDGES.map(([u, v, w]) => {
      const isMst = s.mstEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isCandidate = s.candidates.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const stroke = isMst ? '#3b82f6' : isCandidate ? '#f59e0b' : '#1e293b'
      const labelFill = isMst ? '#93c5fd' : isCandidate ? '#fcd34d' : '#334155'
      const strokeW = isMst || isCandidate ? 2.5 : 1.5
      const dash = isMst || isCandidate ? 'none' : '4,3'
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

  const R = 14
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 420 295" class="w-full" font-family="sans-serif">
    <text x="210" y="17" fill="#94a3b8" font-size="10" text-anchor="middle">Prim 演算法 — 從節點 A 出發</text>

    {#each edgeStates as e}
      <line
        x1={NODES[e.u].x} y1={NODES[e.u].y}
        x2={NODES[e.v].x} y2={NODES[e.v].y}
        stroke={e.stroke} stroke-width={e.strokeW} stroke-dasharray={e.dash}
      />
      <text x={e.lx} y={e.ly} fill={e.labelFill} font-size="9.5" text-anchor="middle" dominant-baseline="middle">{e.w}</text>
    {/each}

    {#each Object.entries(NODES) as [id, pos]}
      <circle cx={pos.x} cy={pos.y} r={R}
        fill={inTreeSet.has(id) ? '#166534' : '#0f172a'}
        stroke={inTreeSet.has(id) ? '#4ade80' : '#475569'}
        stroke-width="1.5"
      />
      <text x={pos.x} y={pos.y} fill={inTreeSet.has(id) ? '#4ade80' : '#94a3b8'}
        font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{id}</text>
    {/each}

    <!-- legend -->
    <circle cx="20" cy="235" r="5" fill="#166534" stroke="#4ade80" stroke-width="1.5"/>
    <text x="30" y="239" fill="#94a3b8" font-size="9">在樹中</text>
    <line x1="72" y1="235" x2="90" y2="235" stroke="#3b82f6" stroke-width="2.5"/>
    <text x="94" y="239" fill="#94a3b8" font-size="9">MST 邊</text>
    <line x1="132" y1="235" x2="150" y2="235" stroke="#f59e0b" stroke-width="2.5"/>
    <text x="154" y="239" fill="#94a3b8" font-size="9">候選邊</text>

    <!-- step desc -->
    <text x="210" y="260" fill="#e2e8f0" font-size="10.5" text-anchor="middle">{step.desc}</text>
    <text x="210" y="278" fill="#475569" font-size="9.5" text-anchor="middle">步驟 {stepIdx + 1} / {steps.length}</text>
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
