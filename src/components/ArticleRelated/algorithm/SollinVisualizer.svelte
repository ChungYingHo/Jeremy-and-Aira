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
      mstEdges: [],
      roundEdges: [],
      components: [['A'],['B'],['C'],['D'],['E'],['F']],
      desc: '初始狀態：每個節點各自為一個連通分量',
    },
    {
      mstEdges: [],
      roundEdges: [['A','D'],['B','E'],['B','C'],['C','F']],
      components: [['A'],['B'],['C'],['D'],['E'],['F']],
      desc: '第一輪：每個分量找自己最小的邊 — A→D(1), B→E(2), C→B(3), D→A(1), E→B(2), F→C(6)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['C','F']],
      roundEdges: [],
      components: [['A','D'],['B','C','E','F']],
      desc: '加入後合併成 2 個分量：{A,D} 和 {B,C,E,F}',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['C','F']],
      roundEdges: [['A','B']],
      components: [['A','D'],['B','C','E','F']],
      desc: '第二輪：{A,D} 最小跨分量邊是 A-B(4)，{B,C,E,F} 最小跨分量邊也是 A-B(4)',
    },
    {
      mstEdges: [['A','D'],['B','E'],['B','C'],['C','F'],['A','B']],
      roundEdges: [],
      components: [['A','B','C','D','E','F']],
      desc: '加入 A-B(4)，所有節點連通 — 完成！總權重 1+2+3+4+6 = 16',
    },
  ]

  let stepIdx = 0

  $: step = steps[stepIdx]

  const componentColors = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7', '#ec4899']

  function getNodeColor(id) {
    const comps = step.components
    for (let i = 0; i < comps.length; i++) {
      if (comps[i].includes(id)) return componentColors[i % componentColors.length]
    }
    return '#475569'
  }

  let edgeStates = []
  $: {
    const s = step
    edgeStates = ALL_EDGES.map(([u, v, w]) => {
      const isMst = s.mstEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isRound = s.roundEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const stroke = isMst ? '#3b82f6' : isRound ? '#f59e0b' : '#1e293b'
      const labelFill = isMst ? '#93c5fd' : isRound ? '#fcd34d' : '#334155'
      const strokeW = isMst || isRound ? 2.5 : 1.5
      const dash = isMst || isRound ? 'none' : '4,3'
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
    <text x="210" y="17" fill="#94a3b8" font-size="10" text-anchor="middle">Sollin 演算法 — 每輪每個分量各選最小邊</text>

    {#each edgeStates as e}
      <line
        x1={NODES[e.u].x} y1={NODES[e.u].y}
        x2={NODES[e.v].x} y2={NODES[e.v].y}
        stroke={e.stroke} stroke-width={e.strokeW} stroke-dasharray={e.dash}
      />
      <text x={e.lx} y={e.ly} fill={e.labelFill} font-size="9.5" text-anchor="middle" dominant-baseline="middle">{e.w}</text>
    {/each}

    {#each Object.entries(NODES) as [id, pos]}
      {@const color = getNodeColor(id)}
      <circle cx={pos.x} cy={pos.y} r={R}
        fill="#0f172a"
        stroke={color}
        stroke-width="2"
      />
      <text x={pos.x} y={pos.y} fill={color}
        font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{id}</text>
    {/each}

    <!-- legend -->
    <line x1="14" y1="235" x2="32" y2="235" stroke="#3b82f6" stroke-width="2.5"/>
    <text x="36" y="239" fill="#94a3b8" font-size="9">MST 邊</text>
    <line x1="78" y1="235" x2="96" y2="235" stroke="#f59e0b" stroke-width="2.5"/>
    <text x="100" y="239" fill="#94a3b8" font-size="9">本輪選中</text>
    <circle cx="158" cy="235" r="5" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
    <text x="168" y="239" fill="#94a3b8" font-size="9">同色 = 同分量</text>

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
