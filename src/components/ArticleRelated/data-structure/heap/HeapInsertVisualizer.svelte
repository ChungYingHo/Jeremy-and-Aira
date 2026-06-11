<script>
  // precomputed frames for inserting [3, 1, 6, 5, 2, 4] into empty max-heap
  // each frame = state after one complete insert (place at bottom + full sift-up)
  // 1-indexed arrays; index 0 is null placeholder
  const FRAMES = [
    { heap: [null],                       newKey: null, finalIdx: null, message: '空 heap' },
    { heap: [null, 3],                    newKey: 3, finalIdx: 1,
      message: 'Insert 3 → 放 idx 1（根節點）' },
    { heap: [null, 3, 1],                 newKey: 1, finalIdx: 2,
      message: 'Insert 1 → 放 idx 2；1 < 父 3，不動' },
    { heap: [null, 6, 1, 3],              newKey: 6, finalIdx: 1,
      message: 'Insert 6 → 放 idx 3；6 > 父 3，swap → 6 上到 idx 1' },
    { heap: [null, 6, 5, 3, 1],           newKey: 5, finalIdx: 2,
      message: 'Insert 5 → 放 idx 4；5 > 父 1，swap → 5 上到 idx 2；5 < 父 6，停' },
    { heap: [null, 6, 5, 3, 1, 2],        newKey: 2, finalIdx: 5,
      message: 'Insert 2 → 放 idx 5；2 < 父 5，不動' },
    { heap: [null, 6, 5, 4, 1, 2, 3],     newKey: 4, finalIdx: 3,
      message: 'Insert 4 → 放 idx 6；4 > 父 3，swap → 4 上到 idx 3；4 < 父 6，停' },
  ]

  const POS = {
    1: { x: 250, y: 55  },
    2: { x: 150, y: 135 },
    3: { x: 350, y: 135 },
    4: { x: 85,  y: 215 },
    5: { x: 215, y: 215 },
    6: { x: 285, y: 215 },
    7: { x: 415, y: 215 },
  }

  let step = 0

  $: frame = FRAMES[step]
  $: heap = frame.heap
  $: n = heap.length - 1
  $: edges = (() => {
    const out = []
    for (let i = 2; i <= n; i++) {
      out.push([Math.floor(i / 2), i])
    }
    return out
  })()

  function next() { if (step < FRAMES.length - 1) step += 1 }
  function prev() { if (step > 0) step -= 1 }
  function reset() { step = 0 }
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-ink-faint font-mono">
      Max-heap Insert（sift-up）· 依序插入 [3, 1, 6, 5, 2, 4]
    </p>
  </div>

  <svg viewBox="0 0 500 255" class="w-full px-1" xmlns="http://www.w3.org/2000/svg">
    {#each edges as [a, b]}
      <line
        x1={POS[a].x} y1={POS[a].y}
        x2={POS[b].x} y2={POS[b].y}
        stroke="#d6d1c5"
        stroke-width="2"
        stroke-linecap="round"
      />
    {/each}
    {#each heap.slice(1) as val, idx}
      {@const i = idx + 1}
      {@const isNew = i === frame.finalIdx}
      <circle
        cx={POS[i].x} cy={POS[i].y} r="22"
        fill={isNew ? '#e6ece2' : '#f0eee8'}
        stroke={isNew ? '#5f7355' : '#d6d1c5'}
        stroke-width="2"
        style="transition: fill 0.3s, stroke 0.3s"
      />
      <text
        x={POS[i].x} y={POS[i].y + 5}
        text-anchor="middle"
        font-size="15"
        font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill={isNew ? '#3f5239' : '#5d574d'}
        style="user-select: none; pointer-events: none"
      >{val}</text>
      <text
        x={POS[i].x} y={POS[i].y - 30}
        text-anchor="middle"
        font-size="10"
        font-family="'JetBrains Mono', monospace"
        fill="#8f8a80"
        style="user-select: none; pointer-events: none"
      >idx {i}</text>
    {/each}
    {#if n === 0}
      <text
        x="250" y="130"
        text-anchor="middle"
        font-size="14"
        font-family="'JetBrains Mono', monospace"
        fill="#8f8a80"
      >（空 heap）</text>
    {/if}
  </svg>

  <div class="px-4 pb-2">
    <p class="text-center text-[11px] text-ink-faint font-mono mb-2">陣列表示</p>
    <div class="flex justify-center gap-0 flex-wrap">
      {#each heap as val, i}
        <div
          class="w-10 h-10 flex flex-col items-center justify-center border-r last:border-r-0 first:rounded-l last:rounded-r transition-colors
            {i === frame.finalIdx
              ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]'
              : i === 0
              ? 'bg-[#f0eee8] border-[#d6d1c5] text-ink-faint'
              : 'bg-[#f0eee8] border-[#d6d1c5] text-[#5d574d]'}"
        >
          <span class="text-[9px] opacity-60">[{i}]</span>
          <span class="text-xs font-bold font-mono">{val ?? '—'}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="px-4 pt-3 pb-4">
    <p class="text-center text-xs font-mono min-h-[2rem] mb-3
      {frame.newKey !== null ? 'text-moss' : 'text-ink-faint'}">
      {frame.message}
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
        disabled={step === FRAMES.length - 1}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper
          {step === FRAMES.length - 1
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
      {#each [3, 1, 6, 5, 2, 4] as k, i}
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
