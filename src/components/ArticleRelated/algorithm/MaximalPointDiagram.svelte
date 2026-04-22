<script>
  const W = 440, H = 340

  const ox = 60, oy = 280
  const sx = 44, sy = 30
  const toX = x => ox + (x - 1) * sx
  const toY = y => oy - (y - 1) * sy

  const points = [
    { id: 'P1', x: 1, y: 6 },
    { id: 'P2', x: 2, y: 8 },
    { id: 'P3', x: 3, y: 4 },
    { id: 'P4', x: 4, y: 7 },
    { id: 'P5', x: 5, y: 3 },
    { id: 'P6', x: 6, y: 5 },
    { id: 'P7', x: 7, y: 1 },
    { id: 'P8', x: 8, y: 2 },
  ]

  const maximalIdx = [1, 3, 5, 7]

  const dominates = [
    { from: 0, to: 1 },
    { from: 2, to: 3 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
  ]

  const steps = [
    {
      divider: null,
      highlight: [],
      maximal: [],
      dominated: [],
      arrows: [],
      staircase: false,
      desc: '8 個點散佈平面。目標：找出沒有被任何點宰制的「極點」',
    },
    {
      divider: 4.5,
      highlight: [],
      maximal: [],
      dominated: [],
      arrows: [],
      staircase: false,
      desc: 'Divide：依 x 中位數切半，L = {P1,P2,P3,P4}，R = {P5,P6,P7,P8}',
    },
    {
      divider: 4.5,
      highlight: [0, 1, 2, 3],
      maximal: [1, 3],
      dominated: [0, 2],
      arrows: [{ from: 0, to: 1 }, { from: 2, to: 3 }],
      staircase: false,
      desc: '遞迴 L：P1 被 P2 宰制（2>1 且 8>6），P3 被 P4 宰制（4>3 且 7>4）→ L_max = {P2, P4}',
    },
    {
      divider: 4.5,
      highlight: [4, 5, 6, 7],
      maximal: [5, 7],
      dominated: [4, 6],
      arrows: [{ from: 4, to: 5 }, { from: 6, to: 7 }],
      staircase: false,
      desc: '遞迴 R：P5 被 P6 宰制，P7 被 P8 宰制 → R_max = {P6, P8}',
    },
    {
      divider: 4.5,
      highlight: [],
      maximal: [1, 3, 5, 7],
      dominated: [0, 2, 4, 6],
      arrows: [],
      staircase: false,
      threshold: 5,
      desc: 'Combine：R_max 中最大 y 為 y* = 5（P6）。L_max 裡 P2.y=8、P4.y=7 皆 > 5，全保留',
    },
    {
      divider: null,
      highlight: [],
      maximal: [1, 3, 5, 7],
      dominated: [0, 2, 4, 6],
      arrows: [],
      staircase: true,
      desc: '最終極點 = {P2, P4, P6, P8}，連起來是一條往右下的階梯',
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]
  $: maxSet = new Set(step.maximal)
  $: domSet = new Set(step.dominated)
  $: hiSet = new Set(step.highlight)
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="18" fill="#94a3b8" font-size="10" text-anchor="middle">
      二維平面上的極點（Maximal Points）
    </text>

    <!-- grid -->
    {#each Array(8) as _, i}
      <line x1={toX(i + 1)} y1={toY(1)} x2={toX(i + 1)} y2={toY(8)} stroke="#1e293b" stroke-width="0.5"/>
      <line x1={toX(1)} y1={toY(i + 1)} x2={toX(8)} y2={toY(i + 1)} stroke="#1e293b" stroke-width="0.5"/>
    {/each}

    <!-- axes -->
    <line x1={toX(1) - 10} y1={toY(1)} x2={toX(8) + 10} y2={toY(1)} stroke="#475569" stroke-width="1"/>
    <line x1={toX(1)} y1={toY(1) + 10} x2={toX(1)} y2={toY(8) - 10} stroke="#475569" stroke-width="1"/>
    <text x={toX(8) + 18} y={toY(1) + 3} fill="#64748b" font-size="9">x</text>
    <text x={toX(1) - 4} y={toY(8) - 14} fill="#64748b" font-size="9">y</text>

    <!-- axis ticks -->
    {#each [1, 2, 3, 4, 5, 6, 7, 8] as v}
      <text x={toX(v)} y={toY(1) + 14} fill="#64748b" font-size="8" text-anchor="middle">{v}</text>
      <text x={toX(1) - 10} y={toY(v) + 3} fill="#64748b" font-size="8" text-anchor="middle">{v}</text>
    {/each}

    <!-- threshold y* line -->
    {#if step.threshold != null}
      <line x1={toX(1)} y1={toY(step.threshold)} x2={toX(8)} y2={toY(step.threshold)}
        stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>
      <text x={toX(8) + 4} y={toY(step.threshold) + 3} fill="#fcd34d" font-size="8">y*={step.threshold}</text>
    {/if}

    <!-- divider vertical line -->
    {#if step.divider != null}
      <line x1={toX(step.divider)} y1={toY(1) - 5} x2={toX(step.divider)} y2={toY(8) + 5}
        stroke="#60a5fa" stroke-width="1" stroke-dasharray="4 3" opacity="0.6"/>
      <text x={toX(step.divider) - 14} y={toY(8) - 4} fill="#60a5fa" font-size="8">L</text>
      <text x={toX(step.divider) + 6} y={toY(8) - 4} fill="#60a5fa" font-size="8">R</text>
    {/if}

    <!-- dominance arrows -->
    <defs>
      <marker id="dom-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
      </marker>
    </defs>
    {#each step.arrows as arr}
      {@const p = points[arr.from]}
      {@const q = points[arr.to]}
      <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(q.x)} y2={toY(q.y)}
        stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.8"
        marker-end="url(#dom-arrow)"/>
    {/each}

    <!-- staircase connecting maximal points -->
    {#if step.staircase}
      {@const mps = maximalIdx.map(i => points[i])}
      <polyline
        points={mps.map(p => `${toX(p.x)},${toY(p.y)}`).join(' ')}
        fill="none" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.7"/>
    {/if}

    <!-- points -->
    {#each points as pt, i}
      {@const isMax = maxSet.has(i)}
      {@const isDom = domSet.has(i)}
      {@const isHi = hiSet.has(i)}
      {#if isMax}
        <rect x={toX(pt.x) - 7} y={toY(pt.y) - 7} width="14" height="14"
          fill="rgba(74, 222, 128, 0.15)" stroke="#4ade80" stroke-width="1.5"/>
      {/if}
      <circle cx={toX(pt.x)} cy={toY(pt.y)} r={isHi ? 5.5 : 4.5}
        fill={isMax ? '#166534' : isDom ? '#7f1d1d' : '#1e293b'}
        stroke={isMax ? '#4ade80' : isDom ? '#ef4444' : isHi ? '#93c5fd' : '#475569'}
        stroke-width="1.5"/>
      <text x={toX(pt.x) + 9} y={toY(pt.y) - 7}
        fill={isMax ? '#4ade80' : isDom ? '#fca5a5' : '#94a3b8'}
        font-size="9">{pt.id}</text>
    {/each}

    <!-- legend -->
    <rect x="16" y="307" width="10" height="10" fill="rgba(74, 222, 128, 0.15)" stroke="#4ade80" stroke-width="1.2"/>
    <text x="30" y="316" fill="#94a3b8" font-size="8.5">極點</text>
    <circle cx="72" cy="312" r="4" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.2"/>
    <text x="80" y="316" fill="#94a3b8" font-size="8.5">被宰制</text>
    <line x1="124" y1="312" x2="142" y2="312" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 2"/>
    <text x="146" y="316" fill="#94a3b8" font-size="8.5">宰制關係</text>

    <!-- step desc -->
    <text x={W / 2} y="334" fill="#e2e8f0" font-size="10" text-anchor="middle">{step.desc}</text>
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
