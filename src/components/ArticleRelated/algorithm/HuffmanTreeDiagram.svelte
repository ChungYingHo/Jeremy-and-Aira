<script>
  const steps = [
    {
      nodes: [
        { id: 'A', freq: 5,  x: 40,  y: 40 },
        { id: 'B', freq: 9,  x: 110, y: 40 },
        { id: 'C', freq: 12, x: 180, y: 40 },
        { id: 'D', freq: 13, x: 250, y: 40 },
        { id: 'E', freq: 16, x: 320, y: 40 },
        { id: 'F', freq: 45, x: 390, y: 40 },
      ],
      edges: [],
      desc: '初始：每個字元是一棵獨立的樹，頻率分別為 A:5, B:9, C:12, D:13, E:16, F:45',
    },
    {
      nodes: [
        { id: '14',  freq: 14,  x: 75,  y: 40, internal: true },
        { id: 'A',   freq: 5,   x: 40,  y: 100 },
        { id: 'B',   freq: 9,   x: 110, y: 100 },
        { id: 'C',   freq: 12,  x: 180, y: 40 },
        { id: 'D',   freq: 13,  x: 250, y: 40 },
        { id: 'E',   freq: 16,  x: 320, y: 40 },
        { id: 'F',   freq: 45,  x: 390, y: 40 },
      ],
      edges: [['14','A','0'],['14','B','1']],
      desc: '取最小的兩個：A(5) + B(9) = 14，合併成新節點',
    },
    {
      nodes: [
        { id: '25',  freq: 25,  x: 215, y: 40, internal: true },
        { id: 'C',   freq: 12,  x: 180, y: 100 },
        { id: 'D',   freq: 13,  x: 250, y: 100 },
        { id: '14',  freq: 14,  x: 75,  y: 40, internal: true },
        { id: 'A',   freq: 5,   x: 40,  y: 100 },
        { id: 'B',   freq: 9,   x: 110, y: 100 },
        { id: 'E',   freq: 16,  x: 320, y: 40 },
        { id: 'F',   freq: 45,  x: 390, y: 40 },
      ],
      edges: [['14','A','0'],['14','B','1'],['25','C','0'],['25','D','1']],
      desc: '取最小的兩個：C(12) + D(13) = 25，合併成新節點',
    },
    {
      nodes: [
        { id: '30',  freq: 30,  x: 197, y: 40, internal: true },
        { id: '14',  freq: 14,  x: 145, y: 100, internal: true },
        { id: 'E',   freq: 16,  x: 250, y: 100 },
        { id: 'A',   freq: 5,   x: 110, y: 160 },
        { id: 'B',   freq: 9,   x: 180, y: 160 },
        { id: '25',  freq: 25,  x: 340, y: 40, internal: true },
        { id: 'C',   freq: 12,  x: 305, y: 100 },
        { id: 'D',   freq: 13,  x: 375, y: 100 },
        { id: 'F',   freq: 45,  x: 75,  y: 40 },
      ],
      edges: [['14','A','0'],['14','B','1'],['25','C','0'],['25','D','1'],['30','14','0'],['30','E','1']],
      desc: '取最小的兩個：14 + E(16) = 30，合併成新節點',
    },
    {
      nodes: [
        { id: '55',  freq: 55,  x: 197, y: 40, internal: true },
        { id: '25',  freq: 25,  x: 130, y: 100, internal: true },
        { id: '30',  freq: 30,  x: 265, y: 100, internal: true },
        { id: 'C',   freq: 12,  x: 95,  y: 160 },
        { id: 'D',   freq: 13,  x: 165, y: 160 },
        { id: '14',  freq: 14,  x: 230, y: 160, internal: true },
        { id: 'E',   freq: 16,  x: 300, y: 160 },
        { id: 'A',   freq: 5,   x: 200, y: 220 },
        { id: 'B',   freq: 9,   x: 260, y: 220 },
        { id: 'F',   freq: 45,  x: 370, y: 40 },
      ],
      edges: [['14','A','0'],['14','B','1'],['25','C','0'],['25','D','1'],['30','14','0'],['30','E','1'],['55','25','0'],['55','30','1']],
      desc: '取最小的兩個：25 + 30 = 55，合併成新節點',
    },
    {
      nodes: [
        { id: '100', freq: 100, x: 215, y: 20, internal: true },
        { id: 'F',   freq: 45,  x: 105, y: 75 },
        { id: '55',  freq: 55,  x: 325, y: 75, internal: true },
        { id: '25',  freq: 25,  x: 235, y: 130, internal: true },
        { id: '30',  freq: 30,  x: 375, y: 130, internal: true },
        { id: 'C',   freq: 12,  x: 195, y: 185 },
        { id: 'D',   freq: 13,  x: 275, y: 185 },
        { id: '14',  freq: 14,  x: 345, y: 185, internal: true },
        { id: 'E',   freq: 16,  x: 405, y: 185 },
        { id: 'A',   freq: 5,   x: 320, y: 235 },
        { id: 'B',   freq: 9,   x: 370, y: 235 },
      ],
      edges: [['14','A','0'],['14','B','1'],['25','C','0'],['25','D','1'],['30','14','0'],['30','E','1'],['55','25','0'],['55','30','1'],['100','F','0'],['100','55','1']],
      desc: '取最後兩個：F(45) + 55 = 100 — Huffman Tree 完成！',
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]

  function findNode(id) {
    return step.nodes.find(n => n.id === id)
  }

  const R = 16
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 440 280" class="w-full" font-family="sans-serif">
    <text x="220" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">Huffman 編碼 — 每次合併頻率最小的兩棵樹</text>

    {#each step.edges as [parentId, childId, label]}
      {@const p = findNode(parentId)}
      {@const c = findNode(childId)}
      {#if p && c}
        <line x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="#3b82f6" stroke-width="1.5"/>
        {@const mx = (p.x + c.x) / 2}
        {@const my = (p.y + c.y) / 2}
        {@const dx = c.x - p.x}
        {@const dy = c.y - p.y}
        {@const len = Math.sqrt(dx * dx + dy * dy)}
        {@const ox = (-dy / len) * 9}
        {@const oy = (dx / len) * 9}
        <text x={mx + ox} y={my + oy} fill="#fcd34d" font-size="9" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{label}</text>
      {/if}
    {/each}

    {#each step.nodes as node}
      {@const isLeaf = !node.internal}
      <circle cx={node.x} cy={node.y} r={R}
        fill={isLeaf ? '#166534' : '#1e293b'}
        stroke={isLeaf ? '#4ade80' : '#475569'}
        stroke-width="1.5"
      />
      {#if isLeaf}
        <text x={node.x} y={node.y - 3} fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{node.id}</text>
        <text x={node.x} y={node.y + 8} fill="#86efac" font-size="7" text-anchor="middle" dominant-baseline="middle">{node.freq}</text>
      {:else}
        <text x={node.x} y={node.y + 1} fill="#94a3b8" font-size="9" font-weight="bold" text-anchor="middle" dominant-baseline="middle">{node.freq}</text>
      {/if}
    {/each}

    <!-- step desc -->
    <text x="220" y="262" fill="#e2e8f0" font-size="10.5" text-anchor="middle">{step.desc}</text>
    <text x="220" y="276" fill="#475569" font-size="9.5" text-anchor="middle">步驟 {stepIdx + 1} / {steps.length}</text>
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
