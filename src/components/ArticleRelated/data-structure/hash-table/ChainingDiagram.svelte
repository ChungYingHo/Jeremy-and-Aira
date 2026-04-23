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

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-slate-500 font-mono">
      鏈結法 · 表大小 m = {M} · hash 函式 h(k) = k mod {M} · 依序插入 [{KEYS.join(', ')}]
    </p>
  </div>

  <div class="px-4 py-3 space-y-1.5 font-mono text-sm">
    {#each chains as chain, i}
      <div class="flex items-center gap-3">
        <span class="w-14 text-right text-slate-500 text-xs">slot {i}</span>
        <span class="text-slate-700">│</span>
        <div class="flex items-center gap-1.5 flex-wrap flex-1">
          {#if chain.length === 0}
            <span class="text-slate-700 text-xs italic">（空）</span>
          {:else}
            {#each chain as key, idx}
              {#if idx > 0}
                <span class="text-blue-500 text-xs">→</span>
              {/if}
              <span
                class="inline-flex items-center justify-center min-w-[2.25rem] h-7 px-2 rounded border text-xs font-bold transition-colors
                  {key === currentKey && idx === chain.length - 1
                    ? 'bg-violet-900/60 border-violet-500 text-violet-200'
                    : 'bg-[#1e3a5f] border-slate-600 text-blue-200'}"
              >{key}</span>
            {/each}
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="px-4 pb-4">
    <p class="text-center text-xs font-mono min-h-[1.25rem] mb-3
      {currentKey !== null ? 'text-violet-300' : 'text-slate-500'}">
      {message}
    </p>

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
        disabled={step === KEYS.length}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          {step === KEYS.length
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
              ? 'bg-violet-900/70 text-violet-200 border-violet-500'
              : i < step
              ? 'bg-blue-900/40 text-blue-300 border-blue-800/60'
              : 'bg-slate-800/60 text-slate-600 border-slate-700/50'}"
        >{k}</span>
      {/each}
    </div>
  </div>
</div>
