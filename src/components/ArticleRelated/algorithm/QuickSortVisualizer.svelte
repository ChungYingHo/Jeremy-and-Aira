<script>
  const INITIAL = [4, 1, 3, 1, 5, 2]

  function buildSteps(arr) {
    const steps = []
    const a = [...arr]
    const finalized = new Array(a.length).fill(false)

    function qs(lo, hi) {
      if (hi - lo <= 1) {
        if (hi - lo === 1) finalized[lo] = true
        return
      }

      const mid = Math.floor((lo + hi) / 2)
      const pivot = a[mid]

      steps.push({
        arr: [...a], lo, hi, pivotIdx: mid, pivot,
        scanning: -1, pivotStart: -1, pivotEnd: -1,
        finalized: [...finalized], phase: 'pivot',
        desc: `[${lo}..${hi - 1}] 選 pivot = ${pivot}`
      })

      for (let k = lo; k < hi; k++) {
        if (k === mid) continue
        steps.push({
          arr: [...a], lo, hi, pivotIdx: mid, pivot,
          scanning: k, pivotStart: -1, pivotEnd: -1,
          finalized: [...finalized], phase: 'scan',
          desc: `${a[k]} ${a[k] < pivot ? '<' : a[k] > pivot ? '>' : '='} ${pivot}，放${a[k] < pivot ? '左' : a[k] > pivot ? '右' : '中'}`
        })
      }

      const less = [], equal = [], greater = []
      for (let k = lo; k < hi; k++) {
        if (a[k] < pivot) less.push(a[k])
        else if (a[k] > pivot) greater.push(a[k])
        else equal.push(a[k])
      }

      let pos = lo
      for (const v of less) a[pos++] = v
      const pStart = pos
      for (const v of equal) { finalized[pos] = true; a[pos++] = v }
      const pEnd = pos
      for (const v of greater) a[pos++] = v

      steps.push({
        arr: [...a], lo, hi, pivotIdx: -1, pivot,
        scanning: -1, pivotStart: pStart, pivotEnd: pEnd,
        finalized: [...finalized], phase: 'partitioned',
        desc: `分區完成，${pivot} 就位`
      })

      qs(lo, pStart)
      qs(pEnd, hi)
    }

    qs(0, a.length)
    for (let i = 0; i < a.length; i++) finalized[i] = true
    steps.push({
      arr: [...a], lo: 0, hi: 0, pivotIdx: -1, pivot: -1,
      scanning: -1, pivotStart: -1, pivotEnd: -1,
      finalized: [...finalized], phase: 'done', desc: '排序完成'
    })
    return steps
  }

  const steps = buildSteps(INITIAL)
  let idx = -1, playing = false, timer = null

  const BAR_W = 50, BAR_STEP = 65, SCALE = 32, BASE_Y = 185
  const OFFSET_X = Math.round((500 - (INITIAL.length * BAR_STEP - (BAR_STEP - BAR_W))) / 2)

  $: state = idx >= 0
    ? steps[idx]
    : { arr: INITIAL, lo: 0, hi: INITIAL.length, pivotIdx: -1, pivot: -1, scanning: -1, pivotStart: -1, pivotEnd: -1, finalized: new Array(INITIAL.length).fill(false), phase: '', desc: '' }
  $: playLabel = playing ? '暫停' : (idx >= steps.length - 1 ? '重播' : '播放')

  $: bars = state.arr.map((v, i) => {
    const { lo, hi, pivotIdx, pivotStart, pivotEnd, scanning, finalized, phase } = state
    let fill, stroke, textFill
    if (phase === 'done' || finalized[i]) {
      fill = '#064e3b'; stroke = '#10b981'; textFill = '#6ee7b7'
    } else if (phase === 'partitioned' && i >= pivotStart && i < pivotEnd) {
      fill = '#1e3a5f'; stroke = '#3b82f6'; textFill = '#93c5fd'
    } else if (i === pivotIdx) {
      fill = '#1e3a5f'; stroke = '#3b82f6'; textFill = '#93c5fd'
    } else if (i === scanning) {
      fill = '#78350f'; stroke = '#d97706'; textFill = '#fef3c7'
    } else if (i >= lo && i < hi) {
      fill = '#1c1917'; stroke = '#44403c'; textFill = '#78716c'
    } else {
      fill = '#0f172a'; stroke = '#334155'; textFill = '#475569'
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
    }, 650)
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

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-1">
    <p class="text-center text-xs text-slate-500 mb-2 font-mono">陣列 [4, 1, 3, 1, 5, 2] 的快速排序過程</p>
    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#1e3a5f;border:1px solid #3b82f6"></span>
        <span class="text-slate-400">Pivot</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#78350f;border:1px solid #d97706"></span>
        <span class="text-slate-400">比較中</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#1c1917;border:1px solid #44403c"></span>
        <span class="text-slate-400">待分區</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#064e3b;border:1px solid #10b981"></span>
        <span class="text-slate-400">已排序</span>
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
      {state.phase === 'done' ? 'text-emerald-400' : state.phase === 'partitioned' ? 'text-blue-300' : state.scanning >= 0 ? 'text-amber-300' : 'text-slate-400'}">
      {idx < 0 ? '按下播放，觀察排序過程' : state.desc}
    </div>
    <div class="flex items-center justify-center gap-2">
      <button on:click={togglePlay}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500"
      >{playLabel}</button>
      <button on:click={nextStep} disabled={idx >= steps.length - 1}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-slate-800 border-slate-700
          {idx >= steps.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:border-slate-500'}"
      >下一步</button>
      <button on:click={reset}
        class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
      >重置</button>
    </div>
  </div>
</div>
