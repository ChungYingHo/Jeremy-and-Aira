<script>
  const HEAP = [null, 6, 5, 4, 1, 2, 3]
  const N = HEAP.length - 1

  const POS = {
    1: { x: 250, y: 55  },
    2: { x: 150, y: 135 },
    3: { x: 350, y: 135 },
    4: { x: 85,  y: 215 },
    5: { x: 215, y: 215 },
    6: { x: 285, y: 215 },
    7: { x: 415, y: 215 },
  }

  const EDGES = [
    [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]
  ].filter(([_, c]) => c <= N)

  let selected = 1

  $: parent = selected > 1 ? Math.floor(selected / 2) : null
  $: left   = 2 * selected <= N     ? 2 * selected     : null
  $: right  = 2 * selected + 1 <= N ? 2 * selected + 1 : null

  $: nodes = HEAP.slice(1).map((val, idx) => {
    const i = idx + 1
    let fill, stroke, text
    if (i === selected)                 { fill = '#f3e3dc'; stroke = '#b3674a'; text = '#8a4a32' }
    else if (i === parent)              { fill = '#e2eaf0'; stroke = '#6e94b5'; text = '#3f5f7a' }
    else if (i === left || i === right) { fill = '#e6ece2'; stroke = '#5f7355'; text = '#3f5239' }
    else                                { fill = '#f0eee8'; stroke = '#d6d1c5'; text = '#5d574d' }
    return { val, i, x: POS[i].x, y: POS[i].y, fill, stroke, text }
  })
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="px-4 pt-4 pb-2">
    <p class="text-center text-xs text-ink-faint font-mono">
      Max-heap 陣列對應 · 1-indexed · 點擊任一節點查看 parent / left / right
    </p>
  </div>

  <svg viewBox="0 0 500 255" class="w-full px-1" xmlns="http://www.w3.org/2000/svg">
    {#each EDGES as [a, b]}
      <line
        x1={POS[a].x} y1={POS[a].y}
        x2={POS[b].x} y2={POS[b].y}
        stroke="#d6d1c5"
        stroke-width="2"
        stroke-linecap="round"
      />
    {/each}
    {#each nodes as n (n.i)}
      <g on:click={() => selected = n.i} style="cursor: pointer">
        <circle
          cx={n.x} cy={n.y} r="22"
          fill={n.fill}
          stroke={n.stroke}
          stroke-width="2"
          style="transition: fill 0.25s, stroke 0.25s"
        />
        <text
          x={n.x} y={n.y + 5}
          text-anchor="middle"
          font-size="15"
          font-weight="bold"
          font-family="'JetBrains Mono', monospace"
          fill={n.text}
          style="user-select: none; pointer-events: none; transition: fill 0.25s"
        >{n.val}</text>
        <text
          x={n.x} y={n.y - 30}
          text-anchor="middle"
          font-size="10"
          font-family="'JetBrains Mono', monospace"
          fill="#8f8a80"
          style="user-select: none; pointer-events: none"
        >idx {n.i}</text>
      </g>
    {/each}
  </svg>

  <div class="px-4 pb-2">
    <p class="text-center text-[11px] text-ink-faint font-mono mb-2">陣列表示（index 0 保留不用）</p>
    <div class="flex justify-center gap-0">
      {#each HEAP as val, i}
        <button
          on:click={() => { if (i > 0) selected = i }}
          disabled={i === 0}
          class="w-11 h-11 flex flex-col items-center justify-center border-r last:border-r-0 first:rounded-l last:rounded-r transition-colors
            {i === selected
              ? 'bg-[#f3e3dc] border-[#b3674a] text-[#8a4a32]'
              : i === parent
              ? 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]'
              : (i === left || i === right)
              ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]'
              : i === 0
              ? 'bg-paper border-line text-ink-faint/50'
              : 'bg-[#f0eee8] border-[#d6d1c5] text-[#5d574d] hover:text-ink'}"
        >
          <span class="text-[10px] opacity-60">[{i}]</span>
          <span class="text-sm font-bold font-mono">{val ?? '—'}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="px-4 pb-4 mt-3">
    <div class="bg-paper border border-line rounded-lg px-4 py-3 font-mono text-xs">
      <p class="text-ink-soft mb-2">
        選中 <span class="text-[#8a4a32] font-bold">idx {selected}</span>，值 =
        <span class="text-[#8a4a32] font-bold">{HEAP[selected]}</span>
      </p>
      <div class="space-y-1 text-ink-faint">
        <p>
          parent = ⌊{selected} / 2⌋ =
          {#if parent !== null}
            <span class="text-[#3f5f7a] font-bold">{parent}</span>（值 =
            <span class="text-[#3f5f7a] font-bold">{HEAP[parent]}</span>）
          {:else}
            <span class="text-ink-faint">—（根節點無父）</span>
          {/if}
        </p>
        <p>
          left = 2 × {selected} =
          {#if left !== null}
            <span class="text-[#3f5239] font-bold">{left}</span>（值 =
            <span class="text-[#3f5239] font-bold">{HEAP[left]}</span>）
          {:else}
            <span class="text-ink-faint">—（超出範圍，無左子）</span>
          {/if}
        </p>
        <p>
          right = 2 × {selected} + 1 =
          {#if right !== null}
            <span class="text-[#3f5239] font-bold">{right}</span>（值 =
            <span class="text-[#3f5239] font-bold">{HEAP[right]}</span>）
          {:else}
            <span class="text-ink-faint">—（超出範圍，無右子）</span>
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>
