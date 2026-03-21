<script>
  const VALUES = [3, 1, 4, 1, 5, 9, 2, 6]

  let stack = []
  let pushIdx = 0
  let stackMsg = ''

  $: nextPush = VALUES[pushIdx % VALUES.length]
  $: displayStack = [...stack].reverse()

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
</script>

<div class="w-full max-w-sm mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="p-4 flex flex-col gap-3">
    <div>
      <p class="text-center text-xs font-bold text-slate-300 font-mono">Stack</p>
      <p class="text-center text-xs text-slate-500">後進先出 (LIFO)</p>
    </div>

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
</div>
