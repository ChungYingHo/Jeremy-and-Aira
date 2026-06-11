<!--
  Static SVG diagram showing the memory layout difference between
  Array (contiguous) and Linked List (non-contiguous).
-->

<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 320 234" class="w-full px-2 pt-2" xmlns="http://www.w3.org/2000/svg">

    <!-- ── Array section ── -->
    <text x="160" y="18" text-anchor="middle" font-size="11" font-weight="bold"
      font-family="sans-serif" fill="#5d574d">Array（陣列）— 連續記憶體</text>

    <!-- 5 adjacent boxes, 44px wide each, x_start=50 -->
    {#each [1,2,3,4,5] as val, i}
      <rect x={50 + i * 44} y="28" width="44" height="42"
        fill="#f0eee8" stroke="#d6d1c5" stroke-width="1.5" />
      <text x={50 + i * 44 + 22} y="54" text-anchor="middle"
        font-size="15" font-weight="bold" font-family="'JetBrains Mono', monospace"
        fill="#5d574d">{val}</text>
      <text x={50 + i * 44 + 22} y="80" text-anchor="middle"
        font-size="8" font-family="'JetBrains Mono', monospace" fill="#8f8a80">
        {`0x${(0x100 + i * 4).toString(16).toUpperCase().padStart(3,'0')}`}
      </text>
    {/each}

    <!-- bracket showing contiguous -->
    <line x1="50" y1="88" x2="270" y2="88" stroke="#6e94b5" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="160" y="100" text-anchor="middle" font-size="8.5"
      font-family="sans-serif" fill="#3f5f7a">連續分配，相鄰元素位址相差固定（此例為 4 bytes）</text>

    <!-- ── Divider ── -->
    <line x1="10" y1="110" x2="310" y2="110" stroke="#d6d1c5" stroke-width="1"/>

    <!-- ── Linked List section ── -->
    <text x="160" y="128" text-anchor="middle" font-size="11" font-weight="bold"
      font-family="sans-serif" fill="#5d574d">Linked List（鏈結串列）— 非連續記憶體</text>

    <!--
      5 nodes × 36px wide + 4 arrows × 18px gap = 252px total
      x_start = (320 - 252) / 2 = 34 → symmetric margins
      nx = 34 + i * 54
    -->
    {#each [
      { val: 1, next: true },
      { val: 2, next: true },
      { val: 3, next: true },
      { val: 4, next: true },
      { val: 5, next: false },
    ] as node, i}
      {@const nx = 34 + i * 54}
      {@const ny = 138}

      <!-- node outer box -->
      <rect x={nx} y={ny} width="36" height="42"
        fill="#e2eaf0" stroke="#6e94b5" stroke-width="1.5" rx="2"/>
      <!-- divider between value and pointer halves -->
      <line x1={nx + 18} y1={ny} x2={nx + 18} y2={ny + 42}
        stroke="#6e94b5" stroke-width="1"/>
      <!-- value -->
      <text x={nx + 9} y={ny + 25} text-anchor="middle"
        font-size="13" font-weight="bold" font-family="'JetBrains Mono', monospace"
        fill="#3f5f7a">{node.val}</text>
      <!-- pointer -->
      {#if node.next}
        <text x={nx + 27} y={ny + 26} text-anchor="middle"
          font-size="10" font-family="'JetBrains Mono', monospace"
          fill="#6e94b5">→</text>
        <line x1={nx + 36} y1={ny + 21} x2={nx + 52} y2={ny + 21}
          stroke="#6e94b5" stroke-width="1.5" marker-end="url(#arr)"/>
      {:else}
        <text x={nx + 27} y={ny + 26} text-anchor="middle"
          font-size="9" font-family="'JetBrains Mono', monospace"
          fill="#6e94b5">∅</text>
      {/if}
    {/each}

    <!-- arrowhead marker -->
    <defs>
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="#6e94b5"/>
      </marker>
    </defs>

    <!-- note about non-contiguity -->
    <text x="160" y="202" text-anchor="middle" font-size="8.5"
      font-family="sans-serif" fill="#3f5f7a">各節點位址不連續，透過指標（→）串接，可分散在記憶體任意位置</text>

    <!-- legend -->
    <rect x="54" y="214" width="10" height="10" fill="#f0eee8" stroke="#d6d1c5" stroke-width="1.5"/>
    <text x="67" y="223" font-size="8.5" font-family="sans-serif" fill="#8f8a80">Array 元素</text>
    <rect x="158" y="214" width="10" height="10" fill="#e2eaf0" stroke="#6e94b5" stroke-width="1.5"/>
    <text x="171" y="223" font-size="8.5" font-family="sans-serif" fill="#8f8a80">Linked List 節點（值 | 指標）</text>

  </svg>
</div>
