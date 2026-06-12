<script>
  const arr = [3, 7, 12, 18, 25, 31, 42, 56, 64, 78, 85, 91]
  const target = 56

  function buildSteps() {
    const out = []
    let lo = 0, hi = arr.length - 1
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      const cmp = arr[mid] === target ? 'eq' : arr[mid] < target ? 'lt' : 'gt'
      out.push({ lo, hi, mid, cmp })
      if (cmp === 'eq') break
      if (cmp === 'lt') lo = mid + 1
      else hi = mid - 1
    }
    return out
  }

  const steps = buildSteps()
  let stepIdx = 0
  $: step = steps[stepIdx]

  const W = 480, H = 170
  const cellW = 32
  const cellH = 32
  const startX = (W - arr.length * cellW) / 2
  const startY = 60

  $: cells = arr.map((v, i) => {
    const isMid = i === step.mid
    const isPruned = i < step.lo || i > step.hi
    let fill, stroke
    if (isMid) {
      fill = step.cmp === 'eq' ? '#e6ece2' : '#f3e3dc'
      stroke = step.cmp === 'eq' ? '#5f7355' : '#b3674a'
    } else if (isPruned) {
      fill = '#f0eee8'
      stroke = '#e4e1da'
    } else {
      fill = '#f0eee8'
      stroke = '#d6d1c5'
    }
    const textFill = isPruned ? '#8f8a80' : '#2d2a25'
    return { v, i, x: startX + i * cellW, fill, stroke, textFill }
  })
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="flex justify-center gap-2 pt-4 px-4 flex-wrap">
    {#each steps as _, i}
      <button
        on:click={() => (stepIdx = i)}
        class="px-3 py-1.5 text-xs rounded-lg border transition-all {stepIdx === i
          ? 'border-moss/40 bg-moss/10 text-moss'
          : 'bg-paper border-line text-ink-soft hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
      >Step {i + 1}</button>
    {/each}
  </div>

  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={W / 2} y="20" fill="#8f8a80" font-size="10" text-anchor="middle">在排序好的陣列中尋找 target = {target}</text>
    <text x={W / 2} y="38" fill="#2d2a25" font-size="11" font-weight="bold" text-anchor="middle">
      lo = {step.lo}，hi = {step.hi}，mid = {step.mid}（值 = {arr[step.mid]}）
      {#if step.cmp === 'eq'}→ 找到了！{:else if step.cmp === 'lt'}→ 太小，淘汰左半{:else}→ 太大，淘汰右半{/if}
    </text>

    {#each cells as cell (cell.i)}
      <rect x={cell.x + 1} y={startY} width={cellW - 2} height={cellH} rx="3"
        fill={cell.fill} stroke={cell.stroke} stroke-width="1.5"
        style="transition: fill 0.2s, stroke 0.2s" />
      <text x={cell.x + cellW / 2} y={startY + cellH / 2 + 4} fill={cell.textFill} font-size="11" text-anchor="middle" font-weight="bold"
        style="transition: fill 0.2s">{cell.v}</text>
      <text x={cell.x + cellW / 2} y={startY + cellH + 12} fill="#8f8a80" font-size="8" text-anchor="middle">{cell.i}</text>
    {/each}

    <text x={startX + step.lo * cellW + cellW / 2} y={startY - 6} fill="#3f5f7a" font-size="9" text-anchor="middle" font-weight="bold">lo</text>
    <text x={startX + step.hi * cellW + cellW / 2} y={startY - 6} fill="#5f5078" font-size="9" text-anchor="middle" font-weight="bold">hi</text>

    <text x={W / 2} y={H - 8} fill="#8f8a80" font-size="9" text-anchor="middle">淡色 = 已淘汰，亮框 = 搜尋區間，磚紅 = mid 比較中，綠 = 命中</text>
  </svg>
</div>
