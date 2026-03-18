<script>
  const VALUES = [3, 1, 4, 1, 5, 9, 2, 6]

  let stack = []  // [bottom, ..., top]
  let queue = []  // [front, ..., rear]
  let pushIdx = 0
  let enqueueIdx = 0
  let stackMsg = ''
  let queueMsg = ''

  $: nextPush = VALUES[pushIdx % VALUES.length]
  $: nextEnqueue = VALUES[enqueueIdx % VALUES.length]
  $: displayStack = [...stack].reverse()  // top first

  function push() {
    if (stack.length >= 6) { stackMsg = '已滿（上限 6 個）'; return }
    stack = [...stack, nextPush]
    pushIdx += 1
    stackMsg = `Push ${stack[stack.length - 1]}`
  }

  function pop() {
    if (!stack.length) { stackMsg = 'Stack 已空'; return }
    const val = stack[stack.length - 1]
    stack = stack.slice(0, -1)
    stackMsg = `Pop → ${val}`
  }

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

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="grid grid-cols-1 sm:grid-cols-2">

    <!-- Stack -->
    <div class="p-4 flex flex-col gap-3 border-b sm:border-b-0 sm:border-r border-slate-800">
      <div>
        <p class="text-center text-xs font-bold text-slate-300 font-mono">Stack</p>
        <p class="text-center text-xs text-slate-500">後進先出 (LIFO)</p>
      </div>

      <!-- visual: top at top, bottom at bottom -->
      <div class="flex flex-col items-center gap-1 h-[240px] justify-end relative overflow-hidden">
        {#if !stack.length}
          <p class="text-slate-700 text-xs absolute inset-0 flex items-center justify-center">（空）</p>
        {/if}
        {#each displayStack as item, i}
          <div class="relative w-14 h-9 flex items-center justify-center rounded
            bg-[#1e3a5f] border text-sm font-bold font-mono
            {i === 0 ? 'border-blue-400 text-blue-200' : 'border-slate-600 text-slate-400'}">
            {item}
            {#if i === 0}
              <span class="absolute -right-10 text-xs text-blue-500 font-normal font-sans">← top</span>
            {/if}
          </div>
        {/each}
      </div>

      <p class="text-center text-xs font-mono min-h-[1rem]
        {stackMsg.startsWith('Pop') ? 'text-violet-300' : stackMsg.startsWith('Push') ? 'text-blue-300' : 'text-slate-500'}">
        {stackMsg || ''}
      </p>

      <div class="flex gap-2 justify-center">
        <button
          on:click={push}
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-blue-600"
        >Push {nextPush}</button>
        <button
          on:click={pop}
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-violet-600"
        >Pop</button>
      </div>
    </div>

    <!-- Queue -->
    <div class="p-4 flex flex-col gap-3">
      <div>
        <p class="text-center text-xs font-bold text-slate-300 font-mono">Queue</p>
        <p class="text-center text-xs text-slate-500">先進先出 (FIFO)</p>
      </div>

      <!-- visual: front on left, rear on right -->
      <div class="flex flex-col justify-center gap-2 h-[240px]">
        <!-- direction labels -->
        <div class="flex justify-between text-xs text-slate-600 px-1">
          <span>front</span>
          <span>rear</span>
        </div>
        <!-- items row -->
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
            <span class="text-emerald-600">↑ dequeue</span>
            <span class="text-blue-600">enqueue ↑</span>
          {:else}
            <span></span><span></span>
          {/if}
        </div>
      </div>

      <p class="text-center text-xs font-mono min-h-[1rem]
        {queueMsg.startsWith('Dequeue') ? 'text-emerald-300' : queueMsg.startsWith('Enqueue') ? 'text-blue-300' : 'text-slate-500'}">
        {queueMsg || ''}
      </p>

      <div class="flex gap-2 justify-center">
        <button
          on:click={enqueue}
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-blue-600"
        >Enqueue {nextEnqueue}</button>
        <button
          on:click={dequeue}
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-emerald-600"
        >Dequeue</button>
      </div>
    </div>

  </div>
</div>
