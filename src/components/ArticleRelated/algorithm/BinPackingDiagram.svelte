<script>
  const items = [0.2, 0.5, 0.4, 0.7, 0.1, 0.3, 0.8]
  const itemColors = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7', '#ec4899', '#06b6d4']

  const strategies = {
    'Next Fit': computeNextFit(),
    'First Fit': computeFirstFit(),
    'First Fit Decreasing': computeFFD(),
  }

  function computeNextFit() {
    const bins = [[]]
    const binSums = [0]
    for (let i = 0; i < items.length; i++) {
      const last = bins.length - 1
      if (binSums[last] + items[i] <= 1) {
        bins[last].push(i)
        binSums[last] += items[i]
      } else {
        bins.push([i])
        binSums.push(items[i])
      }
    }
    return bins
  }

  function computeFirstFit() {
    const bins = []
    const binSums = []
    for (let i = 0; i < items.length; i++) {
      let placed = false
      for (let b = 0; b < bins.length; b++) {
        if (binSums[b] + items[i] <= 1) {
          bins[b].push(i)
          binSums[b] += items[i]
          placed = true
          break
        }
      }
      if (!placed) {
        bins.push([i])
        binSums.push(items[i])
      }
    }
    return bins
  }

  function computeFFD() {
    const sorted = items.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)
    const bins = []
    const binSums = []
    for (const { i } of sorted) {
      let placed = false
      for (let b = 0; b < bins.length; b++) {
        if (binSums[b] + items[i] <= 1) {
          bins[b].push(i)
          binSums[b] += items[i]
          placed = true
          break
        }
      }
      if (!placed) {
        bins.push([i])
        binSums.push(items[i])
      }
    }
    return bins
  }

  const strategyNames = Object.keys(strategies)
  let activeIdx = 0
  $: activeName = strategyNames[activeIdx]
  $: bins = strategies[activeName]

  const binW = 48
  const binH = 140
  const padL = 30
  const padT = 40
  const gap = 12
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="flex justify-center gap-2 pt-4 px-4">
    {#each strategyNames as name, i}
      <button
        on:click={() => activeIdx = i}
        class="px-3 py-1.5 text-xs rounded-lg border transition-all {activeIdx === i
          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
          : 'border-slate-700 text-slate-400 hover:border-slate-500'}"
      >{name}</button>
    {/each}
  </div>

  <svg viewBox="0 0 420 230" class="w-full" font-family="sans-serif">
    <text x="210" y="17" fill="#94a3b8" font-size="10" text-anchor="middle">
      物品：{items.map((v, i) => `${v}`).join(', ')}（箱子容量 = 1.0）
    </text>

    <text x="210" y="32" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">
      {activeName}：{bins.length} 個箱子
    </text>

    {#each bins as bin, b}
      {@const bx = padL + b * (binW + gap)}
      <!-- bin outline -->
      <rect x={bx} y={padT} width={binW} height={binH} rx="3"
        fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <!-- capacity line at top -->
      <line x1={bx} y1={padT} x2={bx + binW} y2={padT} stroke="#475569" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- bin label -->
      <text x={bx + binW / 2} y={padT + binH + 14} fill="#64748b" font-size="8.5" text-anchor="middle">Bin {b + 1}</text>

      <!-- items stacked from bottom -->
      {#each bin as itemIdx, stackPos}
        {@const h = items[itemIdx] * binH}
        {@const prevH = bin.slice(0, stackPos).reduce((s, idx) => s + items[idx] * binH, 0)}
        {@const iy = padT + binH - prevH - h}
        <rect x={bx + 3} y={iy} width={binW - 6} height={h - 1} rx="2"
          fill={itemColors[itemIdx]} opacity="0.7"/>
        <text x={bx + binW / 2} y={iy + h / 2} fill="white" font-size="8" font-weight="bold"
          text-anchor="middle" dominant-baseline="middle">{items[itemIdx]}</text>
      {/each}
    {/each}

    <!-- item legend -->
    <text x="210" y="210" fill="#475569" font-size="8.5" text-anchor="middle">
      每個色塊代表一個物品，高度 = 物品大小佔箱子容量的比例
    </text>
  </svg>
</div>
