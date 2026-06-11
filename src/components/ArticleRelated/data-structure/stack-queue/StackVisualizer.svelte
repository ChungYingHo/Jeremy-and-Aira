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

<div class="w-full max-w-sm mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="p-4 flex flex-col gap-3">
    <div>
      <p class="text-center text-xs font-bold text-ink-soft font-mono">Stack</p>
      <p class="text-center text-xs text-ink-faint">後進先出 (LIFO)</p>
    </div>

    <div class="flex flex-col items-center gap-1 h-[240px] justify-end relative overflow-hidden">
      {#if !stack.length}
        <p class="text-ink-faint text-xs absolute inset-0 flex items-center justify-center">（空）</p>
      {/if}
      {#each displayStack as item, i}
        <div class="relative w-14 h-9 flex items-center justify-center rounded
          border text-sm font-bold font-mono
          {i === 0 ? 'bg-[#f3e3dc] border-[#b3674a] text-[#8a4a32]' : 'bg-[#e2eaf0] border-[#6e94b5] text-[#3f5f7a]'}">
          {item}
          {#if i === 0}
            <span class="absolute -right-10 text-xs text-clay font-normal font-sans">← top</span>
          {/if}
        </div>
      {/each}
    </div>

    <p class="text-center text-xs font-mono min-h-[1rem]
      {stackMsg.startsWith('Pop') ? 'text-clay' : stackMsg.startsWith('Push') ? 'text-[#3f5f7a]' : 'text-ink-faint'}">
      {stackMsg || ''}
    </p>

    <div class="flex gap-2 justify-center">
      <button
        on:click={push}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >Push {nextPush}</button>
      <button
        on:click={pop}
        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
          bg-paper text-ink-soft border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5"
      >Pop</button>
    </div>
  </div>
</div>
