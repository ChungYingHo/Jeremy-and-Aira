<script>
  const INITIAL = [4, 1, 3, 1, 5, 2]

  function buildSteps(arr) {
    const steps = []
    const a = [...arr]
    const done = new Array(a.length).fill(false)

    function merge(lo, mid, hi) {
      steps.push({
        arr: [...a], lo, mid, hi, placing: -1, done: [...done],
        phase: 'start', desc: `合併 [${lo}..${mid - 1}] 和 [${mid}..${hi - 1}]`
      })

      const left = a.slice(lo, mid)
      const right = a.slice(mid, hi)
      let i = 0, j = 0, k = lo

      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) { a[k++] = left[i++] }
        else { a[k++] = right[j++] }
        steps.push({
          arr: [...a], lo, mid, hi, placing: k - 1, done: [...done],
          phase: 'placing', desc: `放入 ${a[k - 1]}`
        })
      }
      while (i < left.length) a[k++] = left[i++]
      while (j < right.length) a[k++] = right[j++]

      for (let x = lo; x < hi; x++) done[x] = true
      steps.push({
        arr: [...a], lo, mid, hi, placing: -1, done: [...done],
        phase: 'merged', desc: `[${lo}..${hi - 1}] 合併完成`
      })
    }

    function mergeSort(lo, hi) {
      if (hi - lo <= 1) return
      const mid = Math.floor((lo + hi) / 2)
      mergeSort(lo, mid)
      mergeSort(mid, hi)
      merge(lo, mid, hi)
    }

    mergeSort(0, a.length)
    steps.push({
      arr: [...a], lo: 0, mid: 0, hi: 0, placing: -1,
      done: new Array(a.length).fill(true), phase: 'done', desc: '排序完成'
    })
    return steps
  }

  const steps = buildSteps(INITIAL)
  let idx = -1, playing = false, timer = null

  const BAR_W = 50, BAR_STEP = 65, SCALE = 32, BASE_Y = 185
  const OFFSET_X = Math.round((500 - (INITIAL.length * BAR_STEP - (BAR_STEP - BAR_W))) / 2)

  $: state = idx >= 0
    ? steps[idx]
    : { arr: INITIAL, lo: 0, mid: 0, hi: 0, placing: -1, done: new Array(INITIAL.length).fill(false), phase: '', desc: '' }
  $: playLabel = playing ? '暫停' : (idx >= steps.length - 1 ? '重播' : '播放')

  $: bars = state.arr.map((v, i) => {
    const { lo, mid, hi, placing, done, phase } = state
    let fill, stroke, textFill
    if (phase === 'done' || done[i]) {
      fill = '#064e3b'; stroke = '#10b981'; textFill = '#6ee7b7'
    } else if (phase === 'placing' && i < placing) {
      fill = '#064e3b'; stroke = '#10b981'; textFill = '#6ee7b7'
    } else if (i === placing) {
      fill = '#0e7490'; stroke = '#22d3ee'; textFill = '#a5f3fc'
    } else if (phase === 'start' && i >= lo && i < mid) {
      fill = '#1e3a5f'; stroke = '#3b82f6'; textFill = '#93c5fd'
    } else if (phase === 'start' && i >= mid && i < hi) {
      fill = '#78350f'; stroke = '#d97706'; textFill = '#fef3c7'
    } else if (phase === 'placing' && i >= lo && i < hi) {
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
    }, 700)
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
    <p class="text-center text-xs text-slate-500 mb-2 font-mono">陣列 [4, 1, 3, 1, 5, 2] 的合併排序過程</p>
    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#1e3a5f;border:1px solid #3b82f6"></span>
        <span class="text-slate-400">左半部</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#78350f;border:1px solid #d97706"></span>
        <span class="text-slate-400">右半部</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#0e7490;border:1px solid #22d3ee"></span>
        <span class="text-slate-400">剛放入</span>
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
      {state.phase === 'done' || state.phase === 'merged' ? 'text-emerald-400' : state.phase === 'placing' ? 'text-cyan-300' : 'text-slate-400'}">
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
