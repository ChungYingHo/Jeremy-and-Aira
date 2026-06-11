<script>
  const KEYS = [15, 22, 8, 36, 29]
  const M = 7

  // precomputed: each key's hash and resulting chain at slot 1
  // step i means: first i keys inserted (step=0 → empty, step=5 → all in)
  let step = 0

  $: inserted = KEYS.slice(0, step)
  $: currentKey = step > 0 ? KEYS[step - 1] : null
  $: chains = (() => {
    const slots = Array.from({ length: M }, () => [])
    inserted.forEach(k => { slots[k % M].push(k) })
    return slots
  })()
  $: message = step === 0
    ? '尚未插入任何 key，點「下一步」開始'
    : `插入 ${currentKey}：${currentKey} mod ${M} = ${currentKey % M}，掛到 slot ${currentKey % M} 的串列尾端`

  function next() {
    if (step < KEYS.length) step += 1
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
    <p class="text-center text-xs text-ink-faint font-mono">
      鏈結法 · 表大小 m = {M} · hash 函式 h(k) = k mod {M} · 依序插入 [{KEYS.join(', ')}]
    </p>
  </div>

  <div class="px-4 py-3 space-y-1.5 font-mono text-sm">
    {#each chains as chain, i}
      <div class="flex items-center gap-3">
        <span class="w-14 text-right text-ink-faint text-xs">slot {i}</span>
        <span class="text-ink-faint">│</span>
        <div class="flex items-center gap-1.5 flex-wrap flex-1">
          {#if chain.length === 0}
            <span class="text-ink-faint text-xs italic">（空）</span>
          {:else}
            {#each chain as key, idx}
              {#if idx > 0}
                <span class="text-[#6e94b5] text-xs">→</span>
              {/if}
              <span
                class="inline-flex items-center justify-center min-w-[2.25rem] h-7 px-2 rounded border text-xs font-bold transition-colors
                  {key === currentKey && idx === chain.length - 1
                    ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]'
                    : 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]'}"
              >{key}</span>
            {/each}
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="px-4 pb-4">
    <p class="text-center text-xs font-mono min-h-[1.25rem] mb-3
      {currentKey !== null ? 'text-moss' : 'text-ink-faint'}">
      {message}
    </p>

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
        disabled={step === KEYS.length}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper
          {step === KEYS.length
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
              ? 'bg-[#e6ece2] text-[#3f5239] border-[#5f7355]'
              : i < step
              ? 'bg-[#e2eaf0] text-[#3f5f7a] border-[#6e94b5]'
              : 'bg-[#f0eee8] text-[#5d574d] border-[#d6d1c5]'}"
        >{k}</span>
      {/each}
    </div>
  </div>
</div>
