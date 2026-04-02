<script>
  const W = 420, H = 300

  const points = [
    { id: 'P0', x: 100, y: 220 },
    { id: 'P1', x: 60,  y: 140 },
    { id: 'P2', x: 130, y: 60  },
    { id: 'P3', x: 220, y: 40  },
    { id: 'P4', x: 310, y: 70  },
    { id: 'P5', x: 360, y: 150 },
    { id: 'P6', x: 330, y: 230 },
    { id: 'P7', x: 200, y: 250 },
    { id: 'P8', x: 180, y: 140 },
    { id: 'P9', x: 250, y: 160 },
  ]

  const hullIndices = [0, 7, 6, 5, 4, 3, 2, 1]

  const steps = [
    {
      scanned: [],
      hull: [],
      current: null,
      checking: null,
      desc: '所有散佈的點，目標：找出最外圍的凸包',
    },
    {
      scanned: [],
      hull: [0],
      current: 0,
      checking: null,
      desc: '找到最下方的點 P0 作為起點（y 最大）',
    },
    {
      scanned: [0],
      hull: [0, 7],
      current: 7,
      checking: null,
      desc: '從 P0 出發，逆時針找到下一個凸包點 P7',
    },
    {
      scanned: [0, 7],
      hull: [0, 7, 6],
      current: 6,
      checking: null,
      desc: '從 P7 繼續，找到 P6',
    },
    {
      scanned: [0, 7, 6],
      hull: [0, 7, 6, 5],
      current: 5,
      checking: null,
      desc: '從 P6 繼續，找到 P5',
    },
    {
      scanned: [0, 7, 6, 5],
      hull: [0, 7, 6, 5, 4],
      current: 4,
      checking: null,
      desc: '從 P5 繼續，找到 P4',
    },
    {
      scanned: [0, 7, 6, 5, 4],
      hull: [0, 7, 6, 5, 4, 3],
      current: 3,
      checking: null,
      desc: '從 P4 繼續，找到 P3',
    },
    {
      scanned: [0, 7, 6, 5, 4, 3],
      hull: [0, 7, 6, 5, 4, 3, 2],
      current: 2,
      checking: null,
      desc: '從 P3 繼續，找到 P2',
    },
    {
      scanned: [0, 7, 6, 5, 4, 3, 2],
      hull: [0, 7, 6, 5, 4, 3, 2, 1],
      current: 1,
      checking: null,
      desc: '從 P2 繼續，找到 P1',
    },
    {
      scanned: [0, 7, 6, 5, 4, 3, 2, 1],
      hull: [0, 7, 6, 5, 4, 3, 2, 1],
      current: null,
      checking: null,
      desc: 'P1 回到 P0，凸包完成！共 8 個頂點，P8、P9 在內部',
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]
  $: hullSet = new Set(step.hull)
  $: currentIdx = step.current

  $: hullPath = step.hull.length > 1
    ? step.hull.map(i => `${points[i].x},${points[i].y}`).join(' ')
      + (step.hull.length === hullIndices.length ? ` ${points[step.hull[0]].x},${points[step.hull[0]].y}` : '')
    : ''
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="17" fill="#94a3b8" font-size="10" text-anchor="middle">凸包（Convex Hull）— 包住所有點的最小凸多邊形</text>

    <!-- hull polygon fill -->
    {#if step.hull.length === hullIndices.length}
      <polygon
        points={hullIndices.map(i => `${points[i].x},${points[i].y}`).join(' ')}
        fill="rgba(59, 130, 246, 0.08)"
        stroke="none"
      />
    {/if}

    <!-- hull edges -->
    {#if hullPath}
      <polyline
        points={hullPath}
        fill="none"
        stroke="#3b82f6"
        stroke-width="2"
      />
    {/if}

    <!-- points -->
    {#each points as pt, i}
      {@const isHull = hullSet.has(i)}
      {@const isCurrent = currentIdx === i}
      <circle cx={pt.x} cy={pt.y} r={isCurrent ? 7 : 5}
        fill={isCurrent ? '#f59e0b' : isHull ? '#166534' : '#1e293b'}
        stroke={isCurrent ? '#fcd34d' : isHull ? '#4ade80' : '#475569'}
        stroke-width="1.5"
      />
      <text x={pt.x} y={pt.y - 10} fill={isCurrent ? '#fcd34d' : isHull ? '#4ade80' : '#64748b'}
        font-size="8.5" text-anchor="middle">{pt.id}</text>
    {/each}

    <!-- legend -->
    <circle cx="20" cy="270" r="4" fill="#166534" stroke="#4ade80" stroke-width="1.5"/>
    <text x="28" y="273" fill="#94a3b8" font-size="8.5">凸包頂點</text>
    <circle cx="88" cy="270" r="4" fill="#f59e0b" stroke="#fcd34d" stroke-width="1.5"/>
    <text x="96" y="273" fill="#94a3b8" font-size="8.5">目前掃描</text>
    <circle cx="156" cy="270" r="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <text x="164" y="273" fill="#94a3b8" font-size="8.5">內部點</text>

    <!-- step desc -->
    <text x={W / 2} y="288" fill="#e2e8f0" font-size="10.5" text-anchor="middle">{step.desc}</text>
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
