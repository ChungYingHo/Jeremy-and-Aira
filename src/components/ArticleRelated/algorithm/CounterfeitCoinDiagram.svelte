<script>
  // 9 coins, fake = index 5 (lighter)
  const fakeIdx = 5

  const steps = [
    {
      label: 'Step 1：9 枚分三組 (3,3,3)，左盤 {0,1,2}、右盤 {3,4,5}',
      left: [0, 1, 2],
      right: [3, 4, 5],
      pool: [6, 7, 8],
      result: '右盤較輕 → 偽幣在 {3,4,5}',
      tilt: 'right',
    },
    {
      label: 'Step 2：再分三組 (1,1,1)，左盤 {3}、右盤 {4}',
      left: [3],
      right: [4],
      pool: [5],
      result: '兩盤平衡 → 偽幣是未上秤的 5',
      tilt: 'balance',
    },
    {
      label: 'Step 3：找到偽幣',
      left: [],
      right: [],
      pool: [5],
      result: '只用 2 次秤，從 9 枚找出偽幣',
      tilt: 'balance',
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]

  const W = 460, H = 250
  const cx = W / 2
  const beamY = 75
  const beamLen = 180
  const panW = 80
  const panH = 8
  const coinR = 7

  function tiltAngle(t) {
    return t === 'left' ? -8 : t === 'right' ? 8 : 0
  }

  function isFake(i) {
    return i === fakeIdx
  }
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="flex justify-center gap-2 pt-4 px-4">
    {#each steps as _, i}
      <button
        on:click={() => (stepIdx = i)}
        class="px-3 py-1.5 text-xs rounded-lg border transition-all {stepIdx === i
          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
          : 'border-slate-700 text-slate-400 hover:border-slate-500'}"
      >Step {i + 1}</button>
    {/each}
  </div>

  <svg viewBox="0 0 {W} {H}" class="w-full" font-family="sans-serif">
    <text x={cx} y="22" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">{step.label}</text>

    {#if step.left.length > 0 || step.right.length > 0}
      {@const a = tiltAngle(step.tilt)}
      <line x1={cx} y1={beamY + 60} x2={cx} y2={beamY} stroke="#64748b" stroke-width="2" />
      <polygon points="{cx - 10},{beamY + 60} {cx + 10},{beamY + 60} {cx},{beamY + 75}" fill="#475569" />

      <g transform="rotate({a} {cx} {beamY})">
        <line x1={cx - beamLen / 2} y1={beamY} x2={cx + beamLen / 2} y2={beamY} stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />

        <line x1={cx - beamLen / 2} y1={beamY} x2={cx - beamLen / 2} y2={beamY + 25} stroke="#64748b" stroke-width="1.5" />
        <rect x={cx - beamLen / 2 - panW / 2} y={beamY + 25} width={panW} height={panH} rx="2" fill="#334155" stroke="#64748b" stroke-width="1" />
        {#each step.left as c, j}
          {@const lx = cx - beamLen / 2 - panW / 2 + 16 + j * 20}
          <circle cx={lx} cy={beamY + 25 - coinR - 1} r={coinR} fill={isFake(c) ? '#f59e0b' : '#cbd5e1'} stroke={isFake(c) ? '#d97706' : '#94a3b8'} stroke-width="1" />
          <text x={lx} y={beamY + 25 - coinR + 1} fill={isFake(c) ? '#0a0a0a' : '#1e293b'} font-size="8" text-anchor="middle" font-weight="bold">{c}</text>
        {/each}

        <line x1={cx + beamLen / 2} y1={beamY} x2={cx + beamLen / 2} y2={beamY + 25} stroke="#64748b" stroke-width="1.5" />
        <rect x={cx + beamLen / 2 - panW / 2} y={beamY + 25} width={panW} height={panH} rx="2" fill="#334155" stroke="#64748b" stroke-width="1" />
        {#each step.right as c, j}
          {@const rx = cx + beamLen / 2 - panW / 2 + 16 + j * 20}
          <circle cx={rx} cy={beamY + 25 - coinR - 1} r={coinR} fill={isFake(c) ? '#f59e0b' : '#cbd5e1'} stroke={isFake(c) ? '#d97706' : '#94a3b8'} stroke-width="1" />
          <text x={rx} y={beamY + 25 - coinR + 1} fill={isFake(c) ? '#0a0a0a' : '#1e293b'} font-size="8" text-anchor="middle" font-weight="bold">{c}</text>
        {/each}
      </g>
    {/if}

    <text x={cx} y={H - 50} fill="#94a3b8" font-size="9" text-anchor="middle">未上秤：</text>
    {#each step.pool as c, j}
      {@const px = cx - (step.pool.length * 20) / 2 + j * 20 + 10}
      <circle cx={px} cy={H - 35} r={coinR} fill={isFake(c) ? '#f59e0b' : '#cbd5e1'} stroke={isFake(c) ? '#d97706' : '#94a3b8'} stroke-width="1" />
      <text x={px} y={H - 32} fill={isFake(c) ? '#0a0a0a' : '#1e293b'} font-size="8" text-anchor="middle" font-weight="bold">{c}</text>
    {/each}

    <text x={cx} y={H - 10} fill="#22c55e" font-size="10" text-anchor="middle">{step.result}</text>
  </svg>
</div>
