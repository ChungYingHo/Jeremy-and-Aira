<script>
  const arr = [3, 7, 12, 18, 25, 31, 42, 56, 64, 78, 85, 91]
  const target = 56

  // build steps
  function buildSteps() {
    const steps = []
    let lo = 0, hi = arr.length - 1
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      const cmp = arr[mid] === target ? 'eq' : arr[mid] < target ? 'lt' : 'gt'
      steps.push({ lo, hi, mid, cmp })
      if (cmp === 'eq') break
      if (cmp === 'lt') lo = mid + 1
      else hi = mid - 1
    }
    return steps
  }

  const steps = buildSteps()
  let stepIdx = 0
  $: step = steps[stepIdx]

  const W = 480, H = 170
  const cellW = 32
  const cellH = 32
  const startX = (W - arr.length * cellW) / 2
  const startY = 60

  function cellFill(i) {
    if (i === step.mid) return step.cmp === 'eq' ? '#166534' : '#7c2d12'
    if (i < step.lo || i > step.hi) return '#0f172a'
    return '#1e293b'
  }
  function cellStroke(i) {
    if (i === step.mid) return step.cmp === 'eq' ? '#22c55e' : '#fb923c'
    if (i < step.lo || i > step.hi) return '#1e293b'
    return '#475569'
  }
  function cellText(i) {
    if (i < step.lo || i > step.hi) return '#475569'
    return '#e2e8f0'
  }
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="flex justify-center gap-2 pt-4 px-4 flex-wrap">
    {#each steps as _, i}
      <button
        on:click={() => (stepIdx = i)}
        class="px-3 py-1.5 text-xs rounded-lg border transition-all {stepIdx === i
          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
          : 'border-slate-700 text-slate-400 hover:border-slate-500'}"
      >Step {i + 1}</button>
    {/each}
  </div>

  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="20" fill="#94a3b8" font-size="10" text-anchor="middle">在排序好的陣列中尋找 target = {target}</text>
    <text x={W / 2} y="38" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">
      lo = {step.lo}，hi = {step.hi}，mid = {step.mid}（值 = {arr[step.mid]}）
      {#if step.cmp === 'eq'}→ 找到了！{:else if step.cmp === 'lt'}→ 太小，淘汰左半{:else}→ 太大，淘汰右半{/if}
    </text>

    {#each arr as v, i}
      {@const x = startX + i * cellW}
      <rect x={x + 1} y={startY} width={cellW - 2} height={cellH} rx="3"
        fill={cellFill(i)} stroke={cellStroke(i)} stroke-width="1.5" />
      <text x={x + cellW / 2} y={startY + cellH / 2 + 4} fill={cellText(i)} font-size="11" text-anchor="middle" font-weight="bold">{v}</text>
      <text x={x + cellW / 2} y={startY + cellH + 12} fill="#475569" font-size="8" text-anchor="middle">{i}</text>
    {/each}

    <!-- lo / hi markers -->
    {#if step.cmp !== 'eq' || true}
      <text x={startX + step.lo * cellW + cellW / 2} y={startY - 6} fill="#3b82f6" font-size="9" text-anchor="middle" font-weight="bold">lo</text>
      <text x={startX + step.hi * cellW + cellW / 2} y={startY - 6} fill="#a855f7" font-size="9" text-anchor="middle" font-weight="bold">hi</text>
    {/if}

    <text x={W / 2} y={H - 8} fill="#64748b" font-size="9" text-anchor="middle">深色 = 已淘汰，亮框 = 搜尋區間，橘 = mid 比較中，綠 = 命中</text>
  </svg>
</div>
