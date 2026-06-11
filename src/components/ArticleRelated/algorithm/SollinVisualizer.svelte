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

  const componentColors = ['#5f7355', '#c9a64e', '#6e94b5', '#c46a5c', '#9181a8', '#b3674a']

  function getNodeColor(id) {
    const comps = step.components
    for (let i = 0; i < comps.length; i++) {
      if (comps[i].includes(id)) return componentColors[i % componentColors.length]
    }
    return '#d6d1c5'
  }

  let edgeStates = []
  $: {
    const s = step
    edgeStates = ALL_EDGES.map(([u, v, w]) => {
      const isMst = s.mstEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const isRound = s.roundEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
      const stroke = isMst ? '#5f7355' : isRound ? '#b3674a' : '#d6d1c5'
      const labelFill = isMst ? '#3f5239' : isRound ? '#8a4a32' : '#5d574d'
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

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 420 295" class="w-full" font-family="sans-serif">
    <text x="210" y="17" fill="#8f8a80" font-size="10" text-anchor="middle">Sollin 演算法 — 每輪每個分量各選最小邊</text>

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
        fill="#f0eee8"
        stroke={color}
        stroke-width="2"
      />
      <text x={pos.x} y={pos.y} fill={color}
        font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{id}</text>
    {/each}

    <!-- legend -->
    <line x1="14" y1="235" x2="32" y2="235" stroke="#5f7355" stroke-width="2.5"/>
    <text x="36" y="239" fill="#5d574d" font-size="9">MST 邊</text>
    <line x1="78" y1="235" x2="96" y2="235" stroke="#b3674a" stroke-width="2.5"/>
    <text x="100" y="239" fill="#5d574d" font-size="9">本輪選中</text>
    <circle cx="158" cy="235" r="5" fill="#f0eee8" stroke="#5f7355" stroke-width="2"/>
    <text x="168" y="239" fill="#5d574d" font-size="9">同色 = 同分量</text>

    <!-- step desc -->
    <text x="210" y="260" fill="#5d574d" font-size="10.5" text-anchor="middle">{step.desc}</text>
    <text x="210" y="278" fill="#8f8a80" font-size="9.5" text-anchor="middle">步驟 {stepIdx + 1} / {steps.length}</text>
  </svg>

  <div class="flex justify-center gap-3 pb-4 px-4">
    <button
      on:click={() => { if (stepIdx > 0) stepIdx-- }}
      disabled={stepIdx === 0}
      class="px-4 py-1.5 text-xs rounded-lg border transition-colors bg-paper
        {stepIdx === 0 ? 'text-ink-faint/50 border-line cursor-not-allowed' : 'text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
    >上一步</button>
    <button
      on:click={() => { if (stepIdx < steps.length - 1) stepIdx++ }}
      disabled={stepIdx === steps.length - 1}
      class="px-4 py-1.5 text-xs rounded-lg border transition-colors bg-paper
        {stepIdx === steps.length - 1 ? 'text-ink-faint/50 border-line cursor-not-allowed' : 'text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
    >下一步</button>
    <button
      on:click={() => stepIdx = 0}
      class="px-4 py-1.5 text-xs rounded-lg border transition-colors bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
    >重置</button>
  </div>
</div>
