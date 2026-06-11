<script>
  const INITIAL = [4, 1, 3, 1, 5, 2]

  function buildSteps(arr) {
    const steps = []
    const a = [...arr]
    const n = a.length

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        const isNew = a[j] < a[minIdx]
        steps.push({
          arr: [...a], sortedTo: i, scanning: j, minIdx,
          phase: 'scan',
          desc: isNew ? `${a[j]} < ${a[minIdx]}，更新最小值` : `${a[j]} ≥ ${a[minIdx]}，繼續`
        })
        if (isNew) minIdx = j
      }

      steps.push({
        arr: [...a], sortedTo: i, scanning: -1, minIdx,
        swapA: i, swapB: minIdx, phase: 'swap',
        desc: minIdx !== i ? `最小值 ${a[minIdx]} 與 ${a[i]} 交換` : `${a[i]} 已在正確位置`
      })

      if (minIdx !== i) { const t = a[i]; a[i] = a[minIdx]; a[minIdx] = t }

      steps.push({
        arr: [...a], sortedTo: i + 1, scanning: -1, minIdx: i,
        phase: 'placed', desc: `${a[i]} 就位`
      })
    }

    steps.push({ arr: [...a], sortedTo: n, scanning: -1, minIdx: -1, phase: 'done', desc: '排序完成' })
    return steps
  }

  const steps = buildSteps(INITIAL)
  let idx = -1, playing = false, timer = null

  const BAR_W = 50, BAR_STEP = 65, SCALE = 32, BASE_Y = 185
  const OFFSET_X = Math.round((500 - (INITIAL.length * BAR_STEP - (BAR_STEP - BAR_W))) / 2)

  $: state = idx >= 0
    ? steps[idx]
    : { arr: INITIAL, sortedTo: INITIAL.length, scanning: -1, minIdx: -1, phase: '', desc: '' }
  $: playLabel = playing ? '暫停' : (idx >= steps.length - 1 ? '重播' : '播放')

  $: bars = state.arr.map((v, i) => {
    const { sortedTo, scanning, minIdx, swapA, swapB, phase } = state
    let fill, stroke, textFill
    if (phase === 'done' || i < sortedTo) {
      fill = '#e6ece2'; stroke = '#5f7355'; textFill = '#3f5239'
    } else if (phase === 'swap' && (i === swapA || i === swapB)) {
      fill = '#f3ddd8'; stroke = '#c46a5c'; textFill = '#9c4a3d'
    } else if (i === minIdx && phase === 'scan') {
      fill = '#e2eaf0'; stroke = '#6e94b5'; textFill = '#3f5f7a'
    } else if (i === scanning) {
      fill = '#f4ecd4'; stroke = '#c9a64e'; textFill = '#8a6d23'
    } else {
      fill = '#f0eee8'; stroke = '#d6d1c5'; textFill = '#5d574d'
    }
    return { x: OFFSET_X + i * BAR_STEP, y: BASE_Y - v * SCALE, w: BAR_W, h: v * SCALE, v, fill, stroke, textFill }
  })

  function togglePlay() {
    if (playing) { clearInterval(timer); timer = null; playing = false; return }
    if (idx >= steps.length - 1) idx = -1
    playing = true
    timer = setInterval(() => {
      idx += 1
      if (idx >= steps.length - 1) { clearInterval(timer); timer = null; playing = false }
    }, 600)
  }
  function nextStep() {
    if (playing) { clearInterval(timer); timer = null; playing = false }
    if (idx < steps.length - 1) idx += 1
  }
  function reset() {
    if (timer) { clearInterval(timer); timer = null }
    playing = false; idx = -1
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="px-4 pt-4 pb-1">
    <p class="text-center text-xs text-ink-faint mb-2 font-mono">陣列 [4, 1, 3, 1, 5, 2] 的選擇排序過程</p>
    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#e2eaf0;border:1px solid #6e94b5"></span>
        <span class="text-ink-soft">目前最小值</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#f4ecd4;border:1px solid #c9a64e"></span>
        <span class="text-ink-soft">掃描中</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#f3ddd8;border:1px solid #c46a5c"></span>
        <span class="text-ink-soft">交換</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#e6ece2;border:1px solid #5f7355"></span>
        <span class="text-ink-soft">已排序</span>
      </span>
    </div>
  </div>

  <svg viewBox="0 0 500 210" class="w-full" xmlns="http://www.w3.org/2000/svg">
    {#each bars as bar}
      <rect x={bar.x} y={bar.y} width={bar.w} height={bar.h}
        fill={bar.fill} stroke={bar.stroke} stroke-width="1.5" rx="3"
        style="transition: fill 0.3s, stroke 0.3s" />
      <text x={bar.x + bar.w / 2} y={bar.y + bar.h / 2 + 5}
        text-anchor="middle" font-size="16" font-weight="bold"
        font-family="'JetBrains Mono', monospace" fill={bar.textFill}
        style="transition: fill 0.3s; user-select: none; pointer-events: none"
      >{bar.v}</text>
    {/each}
  </svg>

  <div class="px-4 pb-4">
    <div class="text-center text-xs font-mono min-h-[1.25rem] mb-3
      {state.phase === 'done' ? 'text-moss' : state.phase === 'swap' ? 'text-[#9c4a3d]' : state.scanning >= 0 ? 'text-[#8a6d23]' : 'text-ink-faint'}">
      {#if idx < 0}按下播放，觀察排序過程
      {:else}{state.desc}{/if}
    </div>
    <div class="flex items-center justify-center gap-2">
      <button on:click={togglePlay}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >{playLabel}</button>
      <button on:click={nextStep} disabled={idx >= steps.length - 1}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-paper
          {idx >= steps.length - 1 ? 'text-ink-faint/50 border-line cursor-not-allowed' : 'text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
      >下一步</button>
      <button on:click={reset}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >重置</button>
    </div>
  </div>
</div>
