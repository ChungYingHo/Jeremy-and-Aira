<script>
  const nodes = {
    A: { x: 65,  y: 100, label: 'A' },
    B: { x: 195, y: 100, label: 'B' },
    C: { x: 335, y: 100, label: 'C' },
    D: { x: 65,  y: 200, label: 'D' },
    E: { x: 195, y: 200, label: 'E' },
    F: { x: 335, y: 200, label: 'F' },
  }

  const edges = [
    { u: 'A', v: 'B', w: 4,  mst: true  },
    { u: 'B', v: 'C', w: 3,  mst: true  },
    { u: 'D', v: 'E', w: 7,  mst: false },
    { u: 'E', v: 'F', w: 9,  mst: false },
    { u: 'A', v: 'D', w: 1,  mst: true  },
    { u: 'B', v: 'E', w: 2,  mst: true  },
    { u: 'C', v: 'F', w: 6,  mst: true  },
    { u: 'A', v: 'E', w: 8,  mst: false },
    { u: 'C', v: 'E', w: 5,  mst: false },
  ]

  const R = 14

  function midLabel(u, v) {
    const mx = (nodes[u].x + nodes[v].x) / 2
    const my = (nodes[u].y + nodes[v].y) / 2
    // offset label perpendicular to edge so it doesn't sit on the line
    const dx = nodes[v].x - nodes[u].x
    const dy = nodes[v].y - nodes[u].y
    const len = Math.sqrt(dx * dx + dy * dy)
    const ox = -dy / len * 10
    const oy = dx / len * 10
    return { x: mx + ox, y: my + oy }
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 420 250" class="w-full px-2 pt-2 pb-1" font-family="sans-serif">

    <!-- title -->
    <text x="210" y="18" fill="#94a3b8" font-size="10" text-anchor="middle">加權無向圖與最小生成樹（MST 邊以藍色標示，總權重 16）</text>

    <!-- edges -->
    {#each edges as e}
      {@const lp = midLabel(e.u, e.v)}
      <line
        x1={nodes[e.u].x} y1={nodes[e.u].y}
        x2={nodes[e.v].x} y2={nodes[e.v].y}
        stroke={e.mst ? '#3b82f6' : '#334155'}
        stroke-width={e.mst ? 2.5 : 1.5}
        stroke-dasharray={e.mst ? 'none' : '5,3'}
      />
      <text
        x={lp.x} y={lp.y}
        fill={e.mst ? '#93c5fd' : '#64748b'}
        font-size="9.5"
        text-anchor="middle"
        dominant-baseline="middle"
      >{e.w}</text>
    {/each}

    <!-- nodes -->
    {#each Object.values(nodes) as n}
      <circle cx={n.x} cy={n.y} r={R} fill="#0f172a" stroke="#475569" stroke-width="1.5" />
      <text x={n.x} y={n.y} fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{n.label}</text>
    {/each}

    <!-- legend -->
    <line x1="24" y1="236" x2="44" y2="236" stroke="#3b82f6" stroke-width="2.5" />
    <text x="48" y="240" fill="#94a3b8" font-size="9">MST 邊</text>
    <line x1="96" y1="236" x2="116" y2="236" stroke="#334155" stroke-width="1.5" stroke-dasharray="5,3" />
    <text x="120" y="240" fill="#94a3b8" font-size="9">非 MST 邊</text>
  </svg>
</div>
