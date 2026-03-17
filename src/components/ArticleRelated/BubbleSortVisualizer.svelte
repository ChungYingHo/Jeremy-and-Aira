<script>
  const INITIAL = [4, 1, 3, 1, 5, 2]

  function buildSteps(arr) {
    const steps = []
    const a = [...arr]
    const n = a.length
    for (let i = 0; i < n; i++) {
      let anySwap = false
      const sortedFrom = n - i
      for (let j = 0; j < n - 1 - i; j++) {
        const lv = a[j], rv = a[j + 1]
        const didSwap = lv > rv
        if (didSwap) { const tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp }
        if (didSwap) anySwap = true
        steps.push({
          arr: [...a],
          cmp: [j, j + 1],
          swapped: didSwap,
          sortedFrom,
          pass: i + 1,
          desc: didSwap ? `${lv} > ${rv}，交換` : `${lv} ≤ ${rv}，不交換`,
        })
      }
      if (!anySwap) break
    }
    steps.push({ arr: [...a], cmp: [], swapped: false, sortedFrom: 0, pass: -1, desc: '排序完成' })
    return steps
  }

  const steps = buildSteps(INITIAL)

  let idx = -1
  let playing = false
  let timer = null

  const BAR_W = 50
  const BAR_STEP = 65
  const SCALE = 32
  const BASE_Y = 185
  const OFFSET_X = Math.round((500 - (INITIAL.length * BAR_STEP - (BAR_STEP - BAR_W))) / 2)

  $: state = idx >= 0
    ? steps[idx]
    : { arr: INITIAL, cmp: [], swapped: false, sortedFrom: INITIAL.length, pass: 0, desc: '' }
  $: playLabel = playing ? '暫停' : (idx >= steps.length - 1 ? '重播' : '播放')

  let bars = []
  $: {
    const { arr, cmp, swapped, sortedFrom } = state
    bars = arr.map((v, i) => {
      let fill, stroke, textFill
      if (i >= sortedFrom) {
        fill = '#064e3b'; stroke = '#10b981'; textFill = '#6ee7b7'
      } else if (cmp.includes(i) && swapped) {
        fill = '#4c1d95'; stroke = '#7c3aed'; textFill = '#ede9fe'
      } else if (cmp.includes(i)) {
        fill = '#78350f'; stroke = '#d97706'; textFill = '#fef3c7'
      } else {
        fill = '#0f172a'; stroke = '#334155'; textFill = '#475569'
      }
      return { x: OFFSET_X + i * BAR_STEP, y: BASE_Y - v * SCALE, w: BAR_W, h: v * SCALE, v, fill, stroke, textFill }
    })
  }

  function togglePlay() {
    if (playing) { clearInterval(timer); timer = null; playing = false; return }
    if (idx >= steps.length - 1) idx = -1
    playing = true
    timer = setInterval(() => {
      idx += 1
      if (idx >= steps.length - 1) { clearInterval(timer); timer = null; playing = false }
    }, 620)
  }

  function nextStep() {
    if (playing) { clearInterval(timer); timer = null; playing = false }
    if (idx < steps.length - 1) idx += 1
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null }
    playing = false
    idx = -1
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-1">
    <p class="text-center text-xs text-slate-500 mb-2 font-mono">陣列 [4, 1, 3, 1, 5, 2] 的泡泡排序過程</p>
    <div class="flex justify-center gap-4 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#78350f;border:1px solid #d97706"></span>
        <span class="text-slate-400">比較中（不交換）</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#4c1d95;border:1px solid #7c3aed"></span>
        <span class="text-slate-400">交換</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#064e3b;border:1px solid #10b981"></span>
        <span class="text-slate-400">已排序</span>
      </span>
    </div>
  </div>

  <svg viewBox="0 0 500 210" class="w-full" xmlns="http://www.w3.org/2000/svg">
    {#each bars as bar}
      <rect
        x={bar.x} y={bar.y}
        width={bar.w} height={bar.h}
        fill={bar.fill} stroke={bar.stroke} stroke-width="1.5" rx="3"
        style="transition: fill 0.3s, stroke 0.3s"
      />
      <text
        x={bar.x + bar.w / 2} y={bar.y + bar.h / 2 + 5}
        text-anchor="middle"
        font-size="16" font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill={bar.textFill}
        style="transition: fill 0.3s; user-select: none; pointer-events: none"
      >{bar.v}</text>
    {/each}
  </svg>

  <div class="px-4 pb-4">
    <div class="text-center text-xs font-mono min-h-[1.25rem] mb-3
      {state.sortedFrom === 0 ? 'text-emerald-400' : state.cmp.length > 0 ? (state.swapped ? 'text-violet-300' : 'text-amber-300') : 'text-slate-500'}">
      {#if idx < 0}
        按下播放，觀察排序過程
      {:else if state.pass > 0}
        第 {state.pass} 輪：{state.desc}
      {:else}
        {state.desc}
      {/if}
    </div>
    <div class="flex items-center justify-center gap-2">
      <button
        on:click={togglePlay}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
          bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500"
      >{playLabel}</button>
      <button
        on:click={nextStep}
        disabled={idx >= steps.length - 1}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
          bg-slate-800 border-slate-700
          {idx >= steps.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:border-slate-500'}"
      >下一步</button>
      <button
        on:click={reset}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
          bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
      >重置</button>
    </div>
  </div>
</div>
