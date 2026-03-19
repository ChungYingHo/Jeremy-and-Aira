<!--
  Static SVG diagram showing the four types of binary trees:
  Full, Complete, Perfect, and Balanced.
-->

<script>
  const EDGE_COLOR  = '#334155'
  const NODE_FILL   = '#0f172a'
  const NODE_STROKE = '#334155'
  const r = 13

  function node(x, y) { return { x, y } }

  function edges(pairs, ns) {
    return pairs.map(([a, b]) => ({ x1: ns[a].x, y1: ns[a].y, x2: ns[b].x, y2: ns[b].y }))
  }

  const fullNodes     = [node(75,22), node(38,65), node(112,65), node(18,105), node(58,105)]
  const fullEdges     = edges([[0,1],[0,2],[1,3],[1,4]], fullNodes)

  const completeNodes = [node(75,22), node(38,65), node(112,65), node(18,105), node(58,105), node(92,105)]
  const completeEdges = edges([[0,1],[0,2],[1,3],[1,4],[2,5]], completeNodes)

  const perfectNodes  = [node(75,22), node(38,65), node(112,65), node(18,105), node(58,105), node(92,105), node(132,105)]
  const perfectEdges  = edges([[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]], perfectNodes)

  const balancedNodes = [node(75,22), node(38,65), node(112,65), node(18,105), node(132,105)]
  const balancedEdges = edges([[0,1],[0,2],[1,3],[2,4]], balancedNodes)

  const panels = [
    { title: 'Full Binary Tree',     desc: '每個節點恰好有 0 或 2 個子節點',          nodes: fullNodes,     edges: fullEdges     },
    { title: 'Complete Binary Tree', desc: '除最後一層外每層填滿，最後一層靠左排列',    nodes: completeNodes, edges: completeEdges },
    { title: 'Perfect Binary Tree',  desc: '每一層完全填滿，所有葉節點在同一層',        nodes: perfectNodes,  edges: perfectEdges  },
    { title: 'Balanced Binary Tree', desc: '任意節點左右子樹的高度差不超過 1',          nodes: balancedNodes, edges: balancedEdges },
  ]
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="grid grid-cols-2">
    {#each panels as panel, i}
      <div class="p-4 flex flex-col items-center gap-2
        {i % 2 === 0 ? 'border-r border-slate-800' : ''}
        {i < 2       ? 'border-b border-slate-800' : ''}">
        <p class="text-xs font-bold text-slate-300 font-mono text-center leading-snug">{panel.title}</p>
        <p class="text-xs text-slate-500 text-center leading-relaxed">{panel.desc}</p>
        <svg viewBox="0 0 150 125" class="w-full max-w-[140px]" xmlns="http://www.w3.org/2000/svg">
          {#each panel.edges as e}
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={EDGE_COLOR} stroke-width="1.5" stroke-linecap="round" />
          {/each}
          {#each panel.nodes as n}
            <circle cx={n.x} cy={n.y} r={r} fill={NODE_FILL} stroke={NODE_STROKE} stroke-width="1.5" />
          {/each}
        </svg>
      </div>
    {/each}
  </div>
</div>
