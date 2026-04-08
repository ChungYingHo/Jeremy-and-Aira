<script>
  // 25 elements, split into 5 groups of 5
  const data = [
    [12, 3, 17, 8, 5],
    [21, 14, 9, 2, 19],
    [7, 25, 11, 16, 4],
    [22, 1, 18, 10, 13],
    [6, 23, 15, 20, 24],
  ]
  // medians of each sorted group
  $: sortedGroups = data.map((g) => [...g].sort((a, b) => a - b))
  $: medians = sortedGroups.map((g) => g[2])
  $: pivot = [...medians].sort((a, b) => a - b)[2]

  const W = 480, H = 260
  const cellW = 30
  const cellH = 22
  const startX = 60
  const startY = 50
  const rowGap = 8
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="20" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">
      Median of Medians：25 個元素分成 5 組（每組 5 個）
    </text>
    <text x={W / 2} y="36" fill="#94a3b8" font-size="9" text-anchor="middle">
      每組排序後取中位數，再從中位數中取中位數作為 pivot
    </text>

    {#each sortedGroups as g, gi}
      {@const y = startY + gi * (cellH + rowGap)}
      <text x={startX - 8} y={y + cellH / 2 + 4} fill="#64748b" font-size="9" text-anchor="end">G{gi + 1}</text>
      {#each g as v, vi}
        {@const x = startX + vi * cellW}
        {@const isMedian = vi === 2}
        <rect x={x + 1} y={y} width={cellW - 2} height={cellH} rx="3"
          fill={isMedian ? '#7c2d12' : '#1e293b'}
          stroke={isMedian ? '#fb923c' : '#475569'} stroke-width="1.5" />
        <text x={x + cellW / 2} y={y + cellH / 2 + 4} fill="#e2e8f0" font-size="10" text-anchor="middle" font-weight={isMedian ? 'bold' : 'normal'}>{v}</text>
      {/each}
      <text x={startX + 5 * cellW + 10} y={y + cellH / 2 + 4} fill="#fb923c" font-size="9">中位數 = {g[2]}</text>
    {/each}

    <!-- arrow / pivot -->
    <text x={W / 2} y={H - 28} fill="#94a3b8" font-size="10" text-anchor="middle">
      取 5 個中位數 [{medians.join(', ')}] 的中位數
    </text>
    <text x={W / 2} y={H - 10} fill="#22c55e" font-size="11" font-weight="bold" text-anchor="middle">
      pivot = {pivot}
    </text>
  </svg>
</div>
