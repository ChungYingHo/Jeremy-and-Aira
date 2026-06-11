<script>
  const VALUES = [3, 1, 4, 1, 5, 9, 2, 6]

  let queue = []
  let enqueueIdx = 0
  let queueMsg = ''

  $: nextEnqueue = VALUES[enqueueIdx % VALUES.length]

  function enqueue() {
    if (queue.length >= 6) { queueMsg = '已滿（上限 6 個）'; return }
    queue = [...queue, nextEnqueue]
    enqueueIdx += 1
    queueMsg = `Enqueue ${queue[queue.length - 1]}`
  }

  function dequeue() {
    if (!queue.length) { queueMsg = 'Queue 已空'; return }
    const val = queue[0]
    queue = queue.slice(1)
    queueMsg = `Dequeue → ${val}`
  }
</script>

<div class="w-full max-w-sm mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="p-4 flex flex-col gap-3">
    <div>
      <p class="text-center text-xs font-bold text-ink-soft font-mono">Queue</p>
      <p class="text-center text-xs text-ink-faint">先進先出 (FIFO)</p>
    </div>

    <div class="flex flex-col justify-center gap-2 h-[240px]">
      <div class="flex justify-between text-xs text-ink-faint px-1">
        <span>front</span>
        <span>rear</span>
      </div>
      <div class="flex flex-wrap gap-1 justify-center min-h-[36px] items-center">
        {#if !queue.length}
          <p class="text-ink-faint text-xs">（空）</p>
        {/if}
        {#each queue as item, i}
          <div class="w-9 h-9 flex items-center justify-center rounded
            border text-sm font-bold font-mono
            {i === 0 ? 'bg-[#e6ece2] border-[#5f7355] text-[#3f5239]' : i === queue.length - 1 ? 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]' : 'bg-[#f0eee8] border-[#d6d1c5] text-[#5d574d]'}">
            {item}
          </div>
        {/each}
      </div>
      <div class="flex justify-between text-xs px-1">
        {#if queue.length}
          <span class="text-moss">↑ dequeue (pop)</span>
          <span class="text-[#3f5f7a]">enqueue (push) ↑</span>
        {:else}
          <span></span><span></span>
        {/if}
      </div>
    </div>

    <p class="text-center text-xs font-mono min-h-[1rem]
      {queueMsg.startsWith('Dequeue') ? 'text-moss' : queueMsg.startsWith('Enqueue') ? 'text-[#3f5f7a]' : 'text-ink-faint'}">
      {queueMsg || ''}
    </p>

    <div class="flex flex-wrap gap-2 justify-center">
      <button
        on:click={enqueue}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >Enqueue (push) {nextEnqueue}</button>
      <button
        on:click={dequeue}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >Dequeue (pop)</button>
    </div>
  </div>
</div>
