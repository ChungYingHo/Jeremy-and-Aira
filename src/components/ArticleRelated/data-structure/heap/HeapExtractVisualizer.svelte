<script>
  // start: max-heap [_, 6, 5, 4, 1, 2, 3]; extract-max repeatedly.
  // each frame = state after one complete extract (pop root + move last + full sift-down)
  const FRAMES = [
    { heap: [null, 6, 5, 4, 1, 2, 3], extracted: [], justExtracted: null,
      message: '初始 max-heap' },
    { heap: [null, 5, 3, 4, 1, 2], extracted: [6], justExtracted: 6,
      message: '取走根 6；把尾端 3 搬到根；sift-down：3 與較大子 5 交換 → 5 升根' },
    { heap: [null, 4, 3, 2, 1], extracted: [6, 5], justExtracted: 5,
      message: '取走根 5；把尾端 2 搬到根；sift-down：2 與較大子 4 交換' },
    { heap: [null, 3, 1, 2], extracted: [6, 5, 4], justExtracted: 4,
      message: '取走根 4；把尾端 1 搬到根；sift-down：1 與較大子 3 交換' },
    { heap: [null, 2, 1], extracted: [6, 5, 4, 3], justExtracted: 3,
      message: '取走根 3；把尾端 2 搬到根；無較大子節點，停' },
    { heap: [null, 1], extracted: [6, 5, 4, 3, 2], justExtracted: 2,
      message: '取走根 2；只剩 1 個節點' },
    { heap: [null], extracted: [6, 5, 4, 3, 2, 1], justExtracted: 1,
      message: '取走根 1；heap 已清空（注意取出順序恰為遞減，等同排序）' },
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
      Max-heap Extract（sift-down）· 初始 [_, 6, 5, 4, 1, 2, 3]
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
      {@const isRoot = i === 1}
      <circle
        cx={POS[i].x} cy={POS[i].y} r="22"
        fill={isRoot ? '#f3e3dc' : '#f0eee8'}
        stroke={isRoot ? '#b3674a' : '#d6d1c5'}
        stroke-width="2"
        style="transition: fill 0.3s, stroke 0.3s"
      />
      <text
        x={POS[i].x} y={POS[i].y + 5}
        text-anchor="middle"
        font-size="15"
        font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill={isRoot ? '#8a4a32' : '#5d574d'}
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
            {i === 1 && val !== null && val !== undefined
              ? 'bg-[#f3e3dc] border-[#b3674a] text-[#8a4a32]'
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

  <div class="px-4 pt-3 pb-2">
    <div class="flex items-center justify-center gap-1.5 flex-wrap min-h-[2rem]">
      <span class="text-ink-faint text-xs mr-1">已取出：</span>
      {#if frame.extracted.length === 0}
        <span class="text-ink-faint text-xs italic">（還沒取出任何元素）</span>
      {:else}
        {#each frame.extracted as val, i}
          <span
            class="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded border text-xs font-bold font-mono transition-all
              {val === frame.justExtracted
                ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]'
                : 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]'}"
          >{val}</span>
        {/each}
      {/if}
    </div>
  </div>

  <div class="px-4 pt-1 pb-4">
    <p class="text-center text-xs font-mono min-h-[2rem] mb-3
      {step === 0 ? 'text-ink-faint' : 'text-clay'}">
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
  </div>
</div>
