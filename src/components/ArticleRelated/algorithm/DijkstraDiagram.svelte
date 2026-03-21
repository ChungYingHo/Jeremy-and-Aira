<script>
  const nodes = {
    A: { x: 80,  y: 90,  dist: 0 },
    B: { x: 220, y: 90,  dist: 2 },
    D: { x: 360, y: 90,  dist: 5 },
    C: { x: 80,  y: 190, dist: 4 },
    E: { x: 220, y: 190, dist: 9 },
  }

  // edges in shortest-path tree (highlighted)
  const edges = [
    { u: 'A', v: 'B', w: 2,  spt: true  },
    { u: 'A', v: 'C', w: 4,  spt: true  },
    { u: 'B', v: 'D', w: 3,  spt: true  },
    { u: 'C', v: 'E', w: 5,  spt: true  },
    { u: 'E', v: 'D', w: 1,  spt: false },
  ]

  const R = 16

  function arrowLine(u, v) {
    const nx = nodes[u].x, ny = nodes[u].y
    const ex = nodes[v].x, ey = nodes[v].y
    const dx = ex - nx, dy = ey - ny
    const len = Math.sqrt(dx * dx + dy * dy)
    // shorten endpoints by node radius
    const sx = nx + (dx / len) * R
    const sy = ny + (dy / len) * R
    const tx = ex - (dx / len) * R
    const ty = ey - (dy / len) * R
    return { sx, sy, tx, ty }
  }

  function midLabel(u, v) {
    const mx = (nodes[u].x + nodes[v].x) / 2
    const my = (nodes[u].y + nodes[v].y) / 2
    const dx = nodes[v].x - nodes[u].x
    const dy = nodes[v].y - nodes[u].y
    const len = Math.sqrt(dx * dx + dy * dy)
    const ox = -dy / len * 11
    const oy = dx / len * 11
    return { x: mx + ox, y: my + oy }
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 460 250" class="w-full px-2 pt-2 pb-1" font-family="sans-serif">
    <defs>
      <marker id="dijk-arrow-spt" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#3b82f6" />
      </marker>
      <marker id="dijk-arrow-other" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#475569" />
      </marker>
    </defs>

    <!-- title -->
    <text x="230" y="18" fill="#94a3b8" font-size="10" text-anchor="middle">Dijkstra 最短路徑（從 A 出發，括號內為最短距離）</text>

    <!-- edges -->
    {#each edges as e}
      {@const al = arrowLine(e.u, e.v)}
      {@const lp = midLabel(e.u, e.v)}
      <line
        x1={al.sx} y1={al.sy} x2={al.tx} y2={al.ty}
        stroke={e.spt ? '#3b82f6' : '#475569'}
        stroke-width={e.spt ? 2 : 1.5}
        stroke-dasharray={e.spt ? 'none' : '5,3'}
        marker-end={e.spt ? 'url(#dijk-arrow-spt)' : 'url(#dijk-arrow-other)'}
      />
      <text x={lp.x} y={lp.y} fill={e.spt ? '#93c5fd' : '#64748b'} font-size="9.5" text-anchor="middle" dominant-baseline="middle">{e.w}</text>
    {/each}

    <!-- nodes -->
    {#each Object.entries(nodes) as [label, n]}
      <circle cx={n.x} cy={n.y} r={R} fill={label === 'A' ? '#1e3a5f' : '#0f172a'} stroke={label === 'A' ? '#3b82f6' : '#475569'} stroke-width="1.5" />
      <text x={n.x} y={n.y - 2} fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{label}</text>
      <!-- distance badge -->
      <text x={n.x} y={n.y + R + 11} fill="#22c55e" font-size="9" text-anchor="middle">({n.dist})</text>
    {/each}

    <!-- legend -->
    <line x1="24" y1="236" x2="44" y2="236" stroke="#3b82f6" stroke-width="2" marker-end="url(#dijk-arrow-spt)" />
    <text x="48" y="240" fill="#94a3b8" font-size="9">最短路徑樹邊</text>
    <line x1="138" y1="236" x2="158" y2="236" stroke="#475569" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#dijk-arrow-other)" />
    <text x="162" y="240" fill="#94a3b8" font-size="9">其他邊</text>
    <text x="230" y="240" fill="#22c55e" font-size="9" text-anchor="middle">括號 = 從 A 出發的最短距離</text>
  </svg>
</div>
