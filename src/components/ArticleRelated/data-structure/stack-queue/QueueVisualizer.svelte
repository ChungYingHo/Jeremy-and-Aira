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

<div class="w-full max-w-sm mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="p-4 flex flex-col gap-3">
    <div>
      <p class="text-center text-xs font-bold text-slate-300 font-mono">Queue</p>
      <p class="text-center text-xs text-slate-500">先進先出 (FIFO)</p>
    </div>

    <div class="flex flex-col justify-center gap-2 h-[240px]">
      <div class="flex justify-between text-xs text-slate-600 px-1">
        <span>front</span>
        <span>rear</span>
      </div>
      <div class="flex flex-wrap gap-1 justify-center min-h-[36px] items-center">
        {#if !queue.length}
          <p class="text-slate-700 text-xs">（空）</p>
        {/if}
        {#each queue as item, i}
          <div class="w-9 h-9 flex items-center justify-center rounded
            bg-[#1e3a5f] border text-sm font-bold font-mono
            {i === 0 ? 'border-emerald-500 text-emerald-200' : i === queue.length - 1 ? 'border-blue-400 text-blue-200' : 'border-slate-600 text-slate-400'}">
            {item}
          </div>
        {/each}
      </div>
      <div class="flex justify-between text-xs px-1">
        {#if queue.length}
          <span class="text-emerald-600">↑ dequeue (pop)</span>
          <span class="text-blue-600">enqueue (push) ↑</span>
        {:else}
          <span></span><span></span>
        {/if}
      </div>
    </div>

    <p class="text-center text-xs font-mono min-h-[1rem]
      {queueMsg.startsWith('Dequeue') ? 'text-emerald-300' : queueMsg.startsWith('Enqueue') ? 'text-blue-300' : 'text-slate-500'}">
      {queueMsg || ''}
    </p>

    <div class="flex flex-wrap gap-2 justify-center">
      <button
        on:click={enqueue}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-blue-600"
      >Enqueue (push) {nextEnqueue}</button>
      <button
        on:click={dequeue}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-emerald-600"
      >Dequeue (pop)</button>
    </div>
  </div>
</div>
