<!--
  Static side-by-side comparison: undirected vs directed graph.
  Same 4 vertices and edges, showing how direction affects traversal.
-->

<script>
  const r = 22

  const verts = [
    { id: 'A', x: 80,  y: 30  },
    { id: 'B', x: 160, y: 90  },
    { id: 'C', x: 80,  y: 150 },
    { id: 'D', x: 0,   y: 90  },
  ]

  const vertMap = Object.fromEntries(verts.map(v => [v.id, v]))

  function shortenEnd(x1, y1, x2, y2) {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    return {
      ex: x2 - (dx / len) * (r + 4),
      ey: y2 - (dy / len) * (r + 4),
    }
  }

  const undirEdges = [['A','B'],['B','C'],['C','D'],['A','D']]
  const dirEdges   = [['A','B'],['B','C'],['C','D'],['D','A']]
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="grid grid-cols-1 sm:grid-cols-2">

    <!-- Undirected -->
    <div class="p-5 flex flex-col items-center gap-3 border-b sm:border-b-0 sm:border-r border-line">
      <div class="text-center">
        <p class="text-xs font-bold text-ink font-mono">無向圖</p>
        <p class="text-xs text-ink-faint mt-0.5">邊沒有方向，A↔B 雙向皆可走</p>
      </div>
      <svg viewBox="-30 0 220 185" class="w-full max-w-[200px]" xmlns="http://www.w3.org/2000/svg">
        {#each undirEdges as [u, v]}
          <line
            x1={vertMap[u].x} y1={vertMap[u].y}
            x2={vertMap[v].x} y2={vertMap[v].y}
            stroke="#d6d1c5" stroke-width="2" stroke-linecap="round"
          />
        {/each}
        {#each verts as v}
          <circle cx={v.x} cy={v.y} r={r} fill="#f0eee8" stroke="#d6d1c5" stroke-width="2" />
          <text x={v.x} y={v.y + 5} text-anchor="middle"
            font-size="13" font-weight="bold" font-family="'JetBrains Mono', monospace"
            fill="#5d574d" style="user-select:none;pointer-events:none">{v.id}</text>
        {/each}
      </svg>
      <pre class="text-xs font-mono text-ink-soft bg-paper border border-line px-3 py-2 rounded w-full leading-relaxed">matrix[u][v] = 1
matrix[v][u] = 1</pre>
    </div>

    <!-- Directed -->
    <div class="p-5 flex flex-col items-center gap-3">
      <div class="text-center">
        <p class="text-xs font-bold text-ink font-mono">有向圖</p>
        <p class="text-xs text-ink-faint mt-0.5">邊有方向，只能沿箭頭走</p>
      </div>
      <svg viewBox="-30 0 220 185" class="w-full max-w-[200px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-dir" viewBox="0 0 8 8" refX="7" refY="4"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#6e94b5"/>
          </marker>
        </defs>
        {#each dirEdges as [u, v]}
          {@const { ex, ey } = shortenEnd(vertMap[u].x, vertMap[u].y, vertMap[v].x, vertMap[v].y)}
          <line
            x1={vertMap[u].x} y1={vertMap[u].y} x2={ex} y2={ey}
            stroke="#6e94b5" stroke-width="2" stroke-linecap="round"
            marker-end="url(#arrow-dir)"
          />
        {/each}
        {#each verts as v}
          <circle cx={v.x} cy={v.y} r={r} fill="#e2eaf0" stroke="#6e94b5" stroke-width="2" />
          <text x={v.x} y={v.y + 5} text-anchor="middle"
            font-size="13" font-weight="bold" font-family="'JetBrains Mono', monospace"
            fill="#3f5f7a" style="user-select:none;pointer-events:none">{v.id}</text>
        {/each}
      </svg>
      <pre class="text-xs font-mono text-[#3f5f7a] bg-paper border border-line px-3 py-2 rounded w-full leading-relaxed">matrix[u][v] = 1
<span class="text-ink-faint line-through">matrix[v][u] = 1</span></pre>
    </div>

  </div>
</div>
