<script>
  const nodes = {
    A: { x: 220, y: 55  },
    B: { x: 130, y: 145 },
    C: { x: 310, y: 145 },
    D: { x: 130, y: 225 },
  }

  const edges = [
    { u: 'A', v: 'B', w: 3, path: true  },
    { u: 'A', v: 'C', w: 5, path: false },
    { u: 'B', v: 'D', w: 2, path: true  },
  ]

  const R = 16

  function edgeLine(u, v) {
    const dx = nodes[v].x - nodes[u].x
    const dy = nodes[v].y - nodes[u].y
    const len = Math.sqrt(dx * dx + dy * dy)
    return {
      x1: nodes[u].x + (dx / len) * R,
      y1: nodes[u].y + (dy / len) * R,
      x2: nodes[v].x - (dx / len) * R,
      y2: nodes[v].y - (dy / len) * R,
    }
  }

  function midLabel(u, v, offset = 10) {
    const mx = (nodes[u].x + nodes[v].x) / 2
    const my = (nodes[u].y + nodes[v].y) / 2
    const dx = nodes[v].x - nodes[u].x
    const dy = nodes[v].y - nodes[u].y
    const len = Math.sqrt(dx * dx + dy * dy)
    return { x: mx - (dy / len) * offset, y: my + (dx / len) * offset }
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 440 275" class="w-full px-2 pt-2 pb-1" font-family="sans-serif">

    <!-- title -->
    <text x="220" y="18" fill="#94a3b8" font-size="10" text-anchor="middle">加權樹：任意兩節點間的路徑唯一</text>

    <!-- edges -->
    {#each edges as e}
      {@const ln = edgeLine(e.u, e.v)}
      {@const lp = midLabel(e.u, e.v)}
      <line
        x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
        stroke={e.path ? '#3b82f6' : '#475569'}
        stroke-width={e.path ? 2.5 : 1.5}
      />
      <text x={lp.x} y={lp.y} fill={e.path ? '#93c5fd' : '#64748b'} font-size="10" text-anchor="middle" dominant-baseline="middle">{e.w}</text>
    {/each}

    <!-- nodes -->
    {#each Object.entries(nodes) as [label, n]}
      <circle cx={n.x} cy={n.y} r={R} fill="#0f172a" stroke="#475569" stroke-width="1.5" />
      <text x={n.x} y={n.y} fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{label}</text>
    {/each}

    <!-- path annotation -->
    <text x="220" y="258" fill="#475569" font-size="9" text-anchor="middle">A → B → D 是 A 到 D 的唯一路徑，距離 = 3 + 2 = 5　｜　A → C 是 A 到 C 的唯一路徑，距離 = 5</text>
  </svg>
</div>
