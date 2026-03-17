<!--
  Static SVG diagram showing the memory layout difference between
  Array (contiguous) and Linked List (non-contiguous).
-->

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 500 268" class="w-full px-2 pt-2" xmlns="http://www.w3.org/2000/svg">

    <!-- ── Array section ── -->
    <text x="250" y="18" text-anchor="middle" font-size="11" font-weight="bold"
      font-family="sans-serif" fill="#94a3b8">Array（陣列）— 連續記憶體</text>

    <!-- 5 adjacent boxes -->
    {#each [1,2,3,4,5] as val, i}
      <!-- box -->
      <rect x={90 + i * 64} y="28" width="64" height="44"
        fill="#0f172a" stroke="#334155" stroke-width="1.5" />
      <!-- value -->
      <text x={90 + i * 64 + 32} y="55" text-anchor="middle"
        font-size="18" font-weight="bold" font-family="'JetBrains Mono', monospace"
        fill="#94a3b8">{val}</text>
      <!-- address -->
      <text x={90 + i * 64 + 32} y="88" text-anchor="middle"
        font-size="9" font-family="'JetBrains Mono', monospace" fill="#475569">
        {`0x${(0x100 + i * 4).toString(16).toUpperCase().padStart(3,'0')}`}
      </text>
    {/each}

    <!-- bracket showing contiguous -->
    <line x1="90" y1="100" x2="410" y2="100" stroke="#1e40af" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="250" y="112" text-anchor="middle" font-size="9"
      font-family="sans-serif" fill="#3b82f6">連續分配，相鄰元素位址相差固定（此例為 4 bytes）</text>

    <!-- ── Divider ── -->
    <line x1="20" y1="122" x2="480" y2="122" stroke="#1e293b" stroke-width="1"/>

    <!-- ── Linked List section ── -->
    <text x="250" y="140" text-anchor="middle" font-size="11" font-weight="bold"
      font-family="sans-serif" fill="#94a3b8">Linked List（鏈結串列）— 非連續記憶體</text>

    <!-- scattered addresses for each node -->
    {#each [
      { val: 1, addr: '1A4', next: '08C' },
      { val: 2, addr: '08C', next: '33C' },
      { val: 3, addr: '33C', next: '1F8' },
      { val: 4, addr: '1F8', next: '268' },
      { val: 5, addr: '268', next: null  },
    ] as node, i}
      {@const nx = 14 + i * 94}
      {@const ny = 152}

      <!-- node outer box -->
      <rect x={nx} y={ny} width="70" height="44"
        fill="#0c1a2e" stroke="#1e3a5f" stroke-width="1.5" rx="2"/>
      <!-- divider between value and pointer halves -->
      <line x1={nx + 35} y1={ny} x2={nx + 35} y2={ny + 44}
        stroke="#1e3a5f" stroke-width="1"/>
      <!-- value -->
      <text x={nx + 17} y={ny + 26} text-anchor="middle"
        font-size="16" font-weight="bold" font-family="'JetBrains Mono', monospace"
        fill="#93c5fd">{node.val}</text>
      <!-- pointer symbol -->
      {#if node.next}
        <text x={nx + 52} y={ny + 26} text-anchor="middle"
          font-size="12" font-family="'JetBrains Mono', monospace"
          fill="#475569">→</text>
      {:else}
        <text x={nx + 52} y={ny + 26} text-anchor="middle"
          font-size="11" font-family="'JetBrains Mono', monospace"
          fill="#334155">null</text>
      {/if}
      <!-- address below node -->
      <text x={nx + 35} y={ny + 58} text-anchor="middle"
        font-size="9" font-family="'JetBrains Mono', monospace"
        fill="#334155">0x{node.addr}</text>

      <!-- arrow to next node -->
      {#if node.next}
        <line x1={nx + 70} y1={ny + 22} x2={nx + 88} y2={ny + 22}
          stroke="#334155" stroke-width="1.5" marker-end="url(#arr)"/>
      {/if}
    {/each}

    <!-- arrowhead marker -->
    <defs>
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="#334155"/>
      </marker>
    </defs>

    <!-- note about non-contiguity -->
    <text x="250" y="232" text-anchor="middle" font-size="9"
      font-family="sans-serif" fill="#3b82f6">各節點位址不連續，透過指標（→）串接，可分散在記憶體任意位置</text>

    <!-- legend -->
    <rect x="142" y="244" width="12" height="12" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="158" y="254" font-size="9" font-family="sans-serif" fill="#475569">Array 元素</text>
    <rect x="242" y="244" width="12" height="12" fill="#0c1a2e" stroke="#1e3a5f" stroke-width="1.5"/>
    <text x="258" y="254" font-size="9" font-family="sans-serif" fill="#475569">Linked List 節點（值 | 指標）</text>

  </svg>
</div>
