<script>
  const W = 460, H = 360

  const ox = 50, oy = 290
  const sx = 46, sy = 44
  const toX = x => ox + (x - 1) * sx
  const toY = y => oy - (y - 1) * sy

  const points = [
    { id: 'A', x: 1, y: 3 },
    { id: 'B', x: 2, y: 1 },
    { id: 'C', x: 3, y: 4 },
    { id: 'D', x: 5, y: 2 },
    { id: 'E', x: 6, y: 5 },
    { id: 'F', x: 8, y: 3 },
  ]

  const xm = 4
  const d = Math.sqrt(5)

  const dist = (i, j) => {
    const p = points[i], q = points[j]
    return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2).toFixed(2)
  }

  const steps = [
    {
      divider: null,
      strip: false,
      leftHi: [],
      rightHi: [],
      bestLeft: null,
      bestRight: null,
      checking: null,
      final: null,
      desc: '6 個點散佈平面。目標：找出距離最近的一對點',
    },
    {
      divider: xm,
      strip: false,
      leftHi: [0, 1, 2],
      rightHi: [3, 4, 5],
      bestLeft: null,
      bestRight: null,
      checking: null,
      final: null,
      desc: `Divide：中位 x ≈ ${xm}，切成左半 {A,B,C} 與右半 {D,E,F}`,
    },
    {
      divider: xm,
      strip: false,
      leftHi: [0, 1, 2],
      rightHi: [],
      bestLeft: [0, 1],
      bestRight: null,
      checking: null,
      final: null,
      desc: `Conquer 左半：兩兩比對 → 最近為 A–B = √5 ≈ 2.24（d_L）`,
    },
    {
      divider: xm,
      strip: false,
      leftHi: [],
      rightHi: [3, 4, 5],
      bestLeft: [0, 1],
      bestRight: [4, 5],
      checking: null,
      final: null,
      desc: `Conquer 右半：兩兩比對 → 最近為 E–F = √8 ≈ 2.83（d_R）`,
    },
    {
      divider: xm,
      strip: true,
      leftHi: [],
      rightHi: [],
      bestLeft: [0, 1],
      bestRight: [4, 5],
      checking: null,
      final: null,
      desc: `d = min(d_L, d_R) = 2.24。以中垂線為中心，取寬 2d 的帶狀區域（strip）`,
    },
    {
      divider: xm,
      strip: true,
      leftHi: [1, 2],
      rightHi: [3, 4],
      bestLeft: [0, 1],
      bestRight: [4, 5],
      checking: null,
      final: null,
      desc: `篩出 strip 內的點：左 B, C；右 D, E。依 y 排序：B(1) → D(2) → C(4) → E(5)`,
    },
    {
      divider: xm,
      strip: true,
      leftHi: [1, 2],
      rightHi: [3, 4],
      bestLeft: [0, 1],
      bestRight: [4, 5],
      checking: { a: 1, b: 3, d: dist(1, 3) },
      final: null,
      desc: `Combine：B–D 距離 ${dist(1, 3)} > 2.24，未更新`,
    },
    {
      divider: xm,
      strip: true,
      leftHi: [1, 2],
      rightHi: [3, 4],
      bestLeft: [0, 1],
      bestRight: [4, 5],
      checking: { a: 3, b: 2, d: dist(3, 2) },
      final: null,
      desc: `Combine：D–C 距離 ${dist(3, 2)} > 2.24，未更新（每點只需檢查 y 在 d 內的鄰居，最多 7 個）`,
    },
    {
      divider: null,
      strip: false,
      leftHi: [],
      rightHi: [],
      bestLeft: null,
      bestRight: null,
      checking: null,
      final: [0, 1],
      desc: `最終最近距離 = √5 ≈ 2.24，點對為 A–B`,
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]
  $: leftSet = new Set(step.leftHi)
  $: rightSet = new Set(step.rightHi)
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="18" fill="#8f8a80" font-size="10" text-anchor="middle">
      最接近兩點（Closest Pair）分治法
    </text>

    <!-- grid -->
    {#each Array(8) as _, i}
      <line x1={toX(i + 1)} y1={toY(1)} x2={toX(i + 1)} y2={toY(6)} stroke="#e4e1da" stroke-width="0.5"/>
    {/each}
    {#each Array(6) as _, i}
      <line x1={toX(1)} y1={toY(i + 1)} x2={toX(8)} y2={toY(i + 1)} stroke="#e4e1da" stroke-width="0.5"/>
    {/each}

    <!-- strip (draw before axes so axis lines render on top) -->
    {#if step.strip}
      <rect x={toX(xm - d)} y={toY(6) - 6} width={2 * d * sx} height={(oy + 6) - (toY(6) - 6)}
        fill="#6e94b5" opacity="0.12"/>
      <line x1={toX(xm - d)} y1={toY(1)} x2={toX(xm - d)} y2={toY(6) - 6}
        stroke="#6e94b5" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.6"/>
      <line x1={toX(xm + d)} y1={toY(1)} x2={toX(xm + d)} y2={toY(6) - 6}
        stroke="#6e94b5" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.6"/>
      <text x={toX(xm + d) + 4} y={toY(6) + 2} fill="#3f5f7a" font-size="8">
        strip（寬 2d）
      </text>
    {/if}

    <!-- axes -->
    <line x1={toX(1) - 10} y1={toY(1)} x2={toX(8) + 10} y2={toY(1)} stroke="#d6d1c5" stroke-width="1"/>
    <line x1={toX(1)} y1={toY(1) + 10} x2={toX(1)} y2={toY(6) - 10} stroke="#d6d1c5" stroke-width="1"/>
    <text x={toX(8) + 18} y={toY(1) + 3} fill="#8f8a80" font-size="9">x</text>
    <text x={toX(1) - 4} y={toY(6) - 14} fill="#8f8a80" font-size="9">y</text>

    <!-- axis ticks -->
    {#each [1, 2, 3, 4, 5, 6, 7, 8] as v}
      <text x={toX(v)} y={toY(1) + 14} fill="#8f8a80" font-size="8" text-anchor="middle">{v}</text>
    {/each}
    {#each [1, 2, 3, 4, 5] as v}
      <text x={toX(1) - 10} y={toY(v) + 3} fill="#8f8a80" font-size="8" text-anchor="middle">{v}</text>
    {/each}

    <!-- divider vertical line (中垂線) -->
    {#if step.divider != null}
      <line x1={toX(step.divider)} y1={toY(1) - 5} x2={toX(step.divider)} y2={toY(6)}
        stroke="#6e94b5" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.85"/>
      <text x={toX(step.divider) - 18} y={toY(6) - 4} fill="#3f5f7a" font-size="8">L</text>
      <text x={toX(step.divider) + 8} y={toY(6) - 4} fill="#3f5f7a" font-size="8">R</text>
      <text x={toX(step.divider)} y={toY(1) - 10} fill="#3f5f7a" font-size="8" text-anchor="middle">
        x = {step.divider}
      </text>
    {/if}

    <!-- best pair left (d_L) -->
    {#if step.bestLeft}
      {@const p = points[step.bestLeft[0]]}
      {@const q = points[step.bestLeft[1]]}
      <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(q.x)} y2={toY(q.y)}
        stroke="#5f7355" stroke-width="1.5" opacity="0.9"/>
    {/if}

    <!-- best pair right (d_R) -->
    {#if step.bestRight}
      {@const p = points[step.bestRight[0]]}
      {@const q = points[step.bestRight[1]]}
      <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(q.x)} y2={toY(q.y)}
        stroke="#c9a64e" stroke-width="1.5" opacity="0.9"/>
    {/if}

    <!-- checking pair -->
    {#if step.checking}
      {@const p = points[step.checking.a]}
      {@const q = points[step.checking.b]}
      <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(q.x)} y2={toY(q.y)}
        stroke="#c46a5c" stroke-width="1.3" stroke-dasharray="3 2" opacity="0.85"/>
      <text x={(toX(p.x) + toX(q.x)) / 2 + 6} y={(toY(p.y) + toY(q.y)) / 2 - 4}
        fill="#9c4a3d" font-size="8">{step.checking.d}</text>
    {/if}

    <!-- final best pair -->
    {#if step.final}
      {@const p = points[step.final[0]]}
      {@const q = points[step.final[1]]}
      <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(q.x)} y2={toY(q.y)}
        stroke="#5f7355" stroke-width="2" opacity="1"/>
      <text x={(toX(p.x) + toX(q.x)) / 2 - 4} y={(toY(p.y) + toY(q.y)) / 2 - 6}
        fill="#3f5239" font-size="9">√5</text>
    {/if}

    <!-- points -->
    {#each points as pt, i}
      {@const isLeft = leftSet.has(i)}
      {@const isRight = rightSet.has(i)}
      {@const isFinal = step.final && (step.final[0] === i || step.final[1] === i)}
      <circle cx={toX(pt.x)} cy={toY(pt.y)} r={isLeft || isRight || isFinal ? 5.5 : 4.5}
        fill={isFinal ? '#e6ece2' : isLeft ? '#e2eaf0' : isRight ? '#f4ecd4' : '#f0eee8'}
        stroke={isFinal ? '#5f7355' : isLeft ? '#6e94b5' : isRight ? '#c9a64e' : '#d6d1c5'}
        stroke-width="1.5"/>
      <text x={toX(pt.x) + 9} y={toY(pt.y) - 7}
        fill={isFinal ? '#3f5239' : isLeft ? '#3f5f7a' : isRight ? '#8a6d23' : '#5d574d'}
        font-size="9">{pt.id}</text>
    {/each}

    <!-- legend -->
    <line x1="16" y1="326" x2="34" y2="326" stroke="#6e94b5" stroke-width="1.2" stroke-dasharray="4 3"/>
    <text x="38" y="329" fill="#5d574d" font-size="8.5">中垂線</text>
    <rect x="84" y="322" width="14" height="8" fill="#6e94b5" opacity="0.3"/>
    <text x="102" y="329" fill="#5d574d" font-size="8.5">strip</text>
    <line x1="132" y1="326" x2="150" y2="326" stroke="#5f7355" stroke-width="1.5"/>
    <text x="154" y="329" fill="#5d574d" font-size="8.5">d_L</text>
    <line x1="180" y1="326" x2="198" y2="326" stroke="#c9a64e" stroke-width="1.5"/>
    <text x="202" y="329" fill="#5d574d" font-size="8.5">d_R</text>
    <line x1="228" y1="326" x2="246" y2="326" stroke="#c46a5c" stroke-width="1.3" stroke-dasharray="3 2"/>
    <text x="250" y="329" fill="#5d574d" font-size="8.5">比對中</text>
    <line x1="290" y1="326" x2="308" y2="326" stroke="#5f7355" stroke-width="2"/>
    <text x="312" y="329" fill="#5d574d" font-size="8.5">最近對</text>

    <!-- step desc -->
    <text x={W / 2} y="352" fill="#2d2a25" font-size="10" text-anchor="middle">{step.desc}</text>
  </svg>

  <div class="flex justify-center gap-3 pb-4 px-4">
    <button
      on:click={() => { if (stepIdx > 0) stepIdx-- }}
      disabled={stepIdx === 0}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 disabled:text-ink-faint/50 disabled:border-line disabled:cursor-not-allowed transition-all"
    >上一步</button>
    <button
      on:click={() => { if (stepIdx < steps.length - 1) stepIdx++ }}
      disabled={stepIdx === steps.length - 1}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 disabled:text-ink-faint/50 disabled:border-line disabled:cursor-not-allowed transition-all"
    >下一步</button>
    <button
      on:click={() => stepIdx = 0}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 transition-all"
    >重置</button>
  </div>
</div>
