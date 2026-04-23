<script>
  const KEYS = [15, 22, 8, 36, 29]
  const M = 7

  // precomputed probe paths for each key under each mode.
  // probes[i] is array of slot indices visited in order (last = final placement, unless failed)
  // failed[i] = true means the key couldn't be placed
  const modes = {
    linear: {
      label: 'Linear 線性',
      formula: 'h(k, i) = (h(k) + i) mod 7',
      paths: [
        { probes: [1],                     failed: false }, // 15
        { probes: [1, 2],                  failed: false }, // 22
        { probes: [1, 2, 3],               failed: false }, // 8
        { probes: [1, 2, 3, 4],            failed: false }, // 36
        { probes: [1, 2, 3, 4, 5],         failed: false }, // 29
      ],
    },
    quadratic: {
      label: 'Quadratic 平方',
      formula: 'h(k, i) = (h(k) + i²) mod 7',
      paths: [
        { probes: [1],                     failed: false }, // 15
        { probes: [1, 2],                  failed: false }, // 22
        { probes: [1, 2, 5],               failed: false }, // 8
        { probes: [1, 2, 5, 3],            failed: false }, // 36
        { probes: [1, 2, 5, 3],            failed: true  }, // 29 cycles, fails
      ],
    },
    double: {
      label: 'Double 雙雜湊',
      formula: 'h(k, i) = (h₁(k) + i · h₂(k)) mod 7, h₂(k) = 1 + k mod 5',
      paths: [
        { probes: [1],                     failed: false }, // 15
        { probes: [1, 4],                  failed: false }, // 22
        { probes: [1, 5],                  failed: false }, // 8
        { probes: [1, 3],                  failed: false }, // 36
        { probes: [1, 6],                  failed: false }, // 29
      ],
    },
  }

  let activeMode = 'linear'
  let step = 0

  $: mode = modes[activeMode]
  $: maxStep = KEYS.length
  $: currentKey = step > 0 ? KEYS[step - 1] : null
  $: currentPath = step > 0 ? mode.paths[step - 1] : null

  // compute slot contents and probe highlights up to current step
  $: slots = (() => {
    const result = Array(M).fill(null)
    for (let i = 0; i < step; i++) {
      const path = mode.paths[i]
      if (!path.failed) {
        const finalSlot = path.probes[path.probes.length - 1]
        result[finalSlot] = KEYS[i]
      }
    }
    return result
  })()

  // highlights: current step's probe path
  $: highlights = (() => {
    if (!currentPath) return { tried: [], placed: null }
    const tried = [...currentPath.probes]
    const placed = currentPath.failed ? null : tried[tried.length - 1]
    return { tried, placed }
  })()

  $: message = (() => {
    if (step === 0) return '尚未插入任何 key，點「下一步」開始'
    if (currentPath.failed) {
      return `插入 ${currentKey}：探測過 ${currentPath.probes.join(' → ')} 全被占用，探測序列開始循環，插入失敗`
    }
    if (currentPath.probes.length === 1) {
      return `插入 ${currentKey}：slot ${currentPath.probes[0]} 是空的，直接放進去`
    }
    const path = currentPath.probes.slice(0, -1).map(p => `slot ${p} 被占`).join(' → ')
    const last = `slot ${currentPath.probes[currentPath.probes.length - 1]} 空，放進去`
    return `插入 ${currentKey}：${path} → ${last}`
  })()

  function selectMode(m) {
    activeMode = m
    step = 0
  }

  function next() {
    if (step < maxStep) step += 1
  }

  function prev() {
    if (step > 0) step -= 1
  }

  function reset() {
    step = 0
  }
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-slate-500 font-mono mb-3">
      開放定址法 · 表大小 m = {M} · 依序插入 [{KEYS.join(', ')}]（全部 hash 到 slot 1）
    </p>
    <div class="flex flex-wrap gap-2 justify-center">
      {#each Object.entries(modes) as [key, m]}
        <button
          on:click={() => selectMode(key)}
          class="px-3 py-1 rounded-lg text-xs font-medium transition-colors border
            {activeMode === key
              ? 'bg-violet-900/60 text-violet-200 border-violet-600'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'}"
        >
          {m.label}
        </button>
      {/each}
    </div>
    <p class="text-center text-[11px] text-slate-600 font-mono mt-2">{mode.formula}</p>
  </div>

  <div class="px-4 py-4">
    <div class="flex justify-center gap-1.5 flex-wrap">
      {#each slots as val, i}
        {@const isTried = highlights.tried.includes(i)}
        {@const isPlaced = highlights.placed === i}
        {@const probeOrder = highlights.tried.indexOf(i)}
        <div class="flex flex-col items-center gap-1">
          <span class="text-[10px] text-slate-600 font-mono">[{i}]</span>
          <div
            class="relative w-12 h-12 flex items-center justify-center rounded border text-sm font-bold font-mono transition-all
              {isPlaced
                ? 'bg-violet-900/60 border-violet-500 text-violet-200'
                : isTried
                ? 'bg-amber-900/40 border-amber-700 text-amber-300'
                : val !== null
                ? 'bg-[#1e3a5f] border-slate-600 text-blue-200'
                : 'bg-slate-900/50 border-slate-800 text-slate-700'}"
          >
            {val !== null ? val : '—'}
            {#if isTried && !isPlaced}
              <span class="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-700 text-[9px] text-amber-100 flex items-center justify-center">
                {probeOrder + 1}
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <p class="text-center text-xs font-mono mt-4 min-h-[2rem]
      {currentPath?.failed ? 'text-red-400' : currentKey !== null ? 'text-violet-300' : 'text-slate-500'}">
      {message}
    </p>
  </div>

  <div class="px-4 pb-4">
    <div class="flex items-center justify-center gap-2">
      <button
        on:click={prev}
        disabled={step === 0}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          {step === 0
            ? 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'}"
      >上一步</button>
      <button
        on:click={next}
        disabled={step === maxStep}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          {step === maxStep
            ? 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-blue-600'}"
      >下一步</button>
      <button
        on:click={reset}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
      >重置</button>
    </div>

    <div class="flex items-center justify-center gap-2 mt-3">
      <span class="text-slate-500 text-xs">進度：</span>
      {#each KEYS as k, i}
        <span
          class="w-7 h-7 flex items-center justify-center rounded text-xs font-bold font-mono border transition-all
            {i === step - 1
              ? (mode.paths[i].failed ? 'bg-red-900/60 text-red-200 border-red-600' : 'bg-violet-900/70 text-violet-200 border-violet-500')
              : i < step
              ? 'bg-blue-900/40 text-blue-300 border-blue-800/60'
              : 'bg-slate-800/60 text-slate-600 border-slate-700/50'}"
        >{k}</span>
      {/each}
    </div>

    <div class="flex items-center justify-center gap-3 mt-3 text-[10px] text-slate-500 font-mono">
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-amber-900/40 border border-amber-700"></span>探測過
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-violet-900/60 border border-violet-500"></span>本次放入
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-[#1e3a5f] border border-slate-600"></span>已占用
      </span>
    </div>
  </div>
</div>
