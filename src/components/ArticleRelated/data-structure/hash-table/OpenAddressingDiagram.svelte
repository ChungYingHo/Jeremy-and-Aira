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

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-ink-faint font-mono mb-3">
      開放定址法 · 表大小 m = {M} · 依序插入 [{KEYS.join(', ')}]（全部 hash 到 slot 1）
    </p>
    <div class="flex flex-wrap gap-2 justify-center">
      {#each Object.entries(modes) as [key, m]}
        <button
          on:click={() => selectMode(key)}
          class="px-3 py-1 rounded-lg text-xs font-medium transition-colors border
            {activeMode === key
              ? 'bg-moss/10 text-moss border-moss/40'
              : 'bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
        >
          {m.label}
        </button>
      {/each}
    </div>
    <p class="text-center text-[11px] text-ink-faint font-mono mt-2">{mode.formula}</p>
  </div>

  <div class="px-4 py-4">
    <div class="flex justify-center gap-1.5 flex-wrap">
      {#each slots as val, i}
        {@const isTried = highlights.tried.includes(i)}
        {@const isPlaced = highlights.placed === i}
        {@const probeOrder = highlights.tried.indexOf(i)}
        <div class="flex flex-col items-center gap-1">
          <span class="text-[10px] text-ink-faint font-mono">[{i}]</span>
          <div
            class="relative w-12 h-12 flex items-center justify-center rounded border text-sm font-bold font-mono transition-all
              {isPlaced
                ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]'
                : isTried
                ? 'bg-[#f4ecd4] border-[#c9a64e] text-[#8a6d23]'
                : val !== null
                ? 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]'
                : 'bg-[#f0eee8] border-[#d6d1c5] text-[#5d574d]'}"
          >
            {val !== null ? val : '—'}
            {#if isTried && !isPlaced}
              <span class="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c9a64e] text-[9px] text-[#f4ecd4] flex items-center justify-center">
                {probeOrder + 1}
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <p class="text-center text-xs font-mono mt-4 min-h-[2rem]
      {currentPath?.failed ? 'text-[#9c4a3d]' : currentKey !== null ? 'text-moss' : 'text-ink-faint'}">
      {message}
    </p>
  </div>

  <div class="px-4 pb-4">
    <div class="flex items-center justify-center gap-2">
      <button
        on:click={prev}
        disabled={step === 0}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper
          {step === 0
            ? 'text-ink-faint/50 border-line cursor-not-allowed'
            : 'text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
      >上一步</button>
      <button
        on:click={next}
        disabled={step === maxStep}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper
          {step === maxStep
            ? 'text-ink-faint/50 border-line cursor-not-allowed'
            : 'text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5'}"
      >下一步</button>
      <button
        on:click={reset}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >重置</button>
    </div>

    <div class="flex items-center justify-center gap-2 mt-3">
      <span class="text-ink-faint text-xs">進度：</span>
      {#each KEYS as k, i}
        <span
          class="w-7 h-7 flex items-center justify-center rounded text-xs font-bold font-mono border transition-all
            {i === step - 1
              ? (mode.paths[i].failed ? 'bg-[#f3ddd8] text-[#9c4a3d] border-[#c46a5c]' : 'bg-[#e6ece2] text-[#3f5239] border-[#5f7355]')
              : i < step
              ? 'bg-[#e2eaf0] text-[#3f5f7a] border-[#6e94b5]'
              : 'bg-[#f0eee8] text-[#5d574d] border-[#d6d1c5]'}"
        >{k}</span>
      {/each}
    </div>

    <div class="flex items-center justify-center gap-3 mt-3 text-[10px] text-ink-faint font-mono">
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-[#f4ecd4] border border-[#c9a64e]"></span>探測過
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-[#e6ece2] border border-[#5f7355]"></span>本次放入
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-[#e2eaf0] border border-[#6e94b5]"></span>已占用
      </span>
    </div>
  </div>
</div>
