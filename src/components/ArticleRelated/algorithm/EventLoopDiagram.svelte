<script>
  const steps = [
    {
      callStack: [],
      taskQueue: [],
      microtaskQueue: [],
      log: [],
      desc: '初始狀態：Call Stack、Task Queue、Microtask Queue 都是空的',
    },
    {
      callStack: ['console.log("1")'],
      taskQueue: [],
      microtaskQueue: [],
      log: [],
      desc: 'console.log("1") 進入 Call Stack',
    },
    {
      callStack: [],
      taskQueue: [],
      microtaskQueue: [],
      log: ['1'],
      desc: '執行完畢，印出 1，從 Call Stack 彈出',
    },
    {
      callStack: ['setTimeout(cb, 0)'],
      taskQueue: [],
      microtaskQueue: [],
      log: ['1'],
      desc: 'setTimeout 進入 Call Stack，交給瀏覽器計時',
    },
    {
      callStack: [],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: [],
      log: ['1'],
      desc: 'setTimeout 彈出，計時結束後 callback 被放進 Task Queue',
    },
    {
      callStack: ['Promise.then(cb)'],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: [],
      log: ['1'],
      desc: 'Promise.resolve().then() 進入 Call Stack',
    },
    {
      callStack: [],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: ['cb: log("4")'],
      log: ['1'],
      desc: 'Promise 彈出，.then callback 被放進 Microtask Queue',
    },
    {
      callStack: ['console.log("2")'],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: ['cb: log("4")'],
      log: ['1'],
      desc: 'console.log("2") 進入 Call Stack',
    },
    {
      callStack: [],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: ['cb: log("4")'],
      log: ['1', '2'],
      desc: '執行完畢，印出 2 — 同步程式碼全部跑完了',
    },
    {
      callStack: ['cb: log("4")'],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: [],
      log: ['1', '2'],
      desc: 'Event Loop：先清空 Microtask Queue → Promise callback 進入 Call Stack',
    },
    {
      callStack: [],
      taskQueue: ['cb: log("3")'],
      microtaskQueue: [],
      log: ['1', '2', '4'],
      desc: '執行完畢，印出 4 — Microtask 清空了',
    },
    {
      callStack: ['cb: log("3")'],
      taskQueue: [],
      microtaskQueue: [],
      log: ['1', '2', '4'],
      desc: 'Event Loop：再從 Task Queue 取出 setTimeout callback',
    },
    {
      callStack: [],
      taskQueue: [],
      microtaskQueue: [],
      log: ['1', '2', '4', '3'],
      desc: '執行完畢，印出 3 — 全部完成！順序：1, 2, 4, 3',
    },
  ]

  let stepIdx = 0
  $: step = steps[stepIdx]

  const boxW = 120
  const itemH = 20
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 440 290" class="w-full" font-family="sans-serif">
    <text x="220" y="16" fill="#8f8a80" font-size="10" text-anchor="middle">Event Loop 運作流程</text>

    <!-- Call Stack -->
    <rect x="20" y="28" width={boxW} height="100" rx="4" fill="#f6f4f0" stroke="#d6d1c5" stroke-width="1"/>
    <text x={20 + boxW / 2} y="42" fill="#5d574d" font-size="9" font-weight="bold" text-anchor="middle">Call Stack</text>
    {#each step.callStack as item, i}
      <rect x="26" y={108 - i * (itemH + 2)} width={boxW - 12} height={itemH} rx="2" fill="#e2eaf0" stroke="#6e94b5" stroke-width="1"/>
      <text x={20 + boxW / 2} y={108 - i * (itemH + 2) + 13} fill="#3f5f7a" font-size="7.5" text-anchor="middle">{item}</text>
    {/each}

    <!-- Task Queue (macrotask) -->
    <rect x="160" y="28" width={boxW} height="100" rx="4" fill="#f6f4f0" stroke="#d6d1c5" stroke-width="1"/>
    <text x={160 + boxW / 2} y="42" fill="#5d574d" font-size="9" font-weight="bold" text-anchor="middle">Task Queue</text>
    {#each step.taskQueue as item, i}
      <rect x="166" y={50 + i * (itemH + 2)} width={boxW - 12} height={itemH} rx="2" fill="#f4ecd4" stroke="#c9a64e" stroke-width="1"/>
      <text x={160 + boxW / 2} y={50 + i * (itemH + 2) + 13} fill="#8a6d23" font-size="7.5" text-anchor="middle">{item}</text>
    {/each}

    <!-- Microtask Queue -->
    <rect x="300" y="28" width={boxW} height="100" rx="4" fill="#f6f4f0" stroke="#d6d1c5" stroke-width="1"/>
    <text x={300 + boxW / 2} y="42" fill="#5d574d" font-size="9" font-weight="bold" text-anchor="middle">Microtask Queue</text>
    {#each step.microtaskQueue as item, i}
      <rect x="306" y={50 + i * (itemH + 2)} width={boxW - 12} height={itemH} rx="2" fill="#e6ece2" stroke="#5f7355" stroke-width="1"/>
      <text x={300 + boxW / 2} y={50 + i * (itemH + 2) + 13} fill="#3f5239" font-size="7.5" text-anchor="middle">{item}</text>
    {/each}

    <!-- Event Loop arrow -->
    <path d="M 150 145 C 150 160, 290 160, 290 145" fill="none" stroke="#9181a8" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="220" y="170" fill="#5f5078" font-size="8" text-anchor="middle">← Event Loop →</text>

    <!-- Console output -->
    <rect x="20" y="182" width="400" height="40" rx="4" fill="#f6f4f0" stroke="#d6d1c5" stroke-width="1"/>
    <text x="30" y="196" fill="#8f8a80" font-size="8">Console 輸出：</text>
    <text x="30" y="213" fill="#2d2a25" font-size="11" font-weight="bold">
      {step.log.length > 0 ? step.log.join(', ') : '(空)'}
    </text>

    <!-- step desc -->
    <text x="220" y="242" fill="#2d2a25" font-size="10" text-anchor="middle">{step.desc}</text>
    <text x="220" y="258" fill="#8f8a80" font-size="9.5" text-anchor="middle">步驟 {stepIdx + 1} / {steps.length}</text>

    <!-- code reference -->
    <text x="220" y="276" fill="#8f8a80" font-size="7.5" text-anchor="middle">
      log("1") → setTimeout(()=>log("3"), 0) → Promise.resolve().then(()=>log("4")) → log("2")
    </text>
  </svg>

  <div class="flex justify-center gap-3 pb-4 px-4">
    <button
      on:click={() => { if (stepIdx > 0) stepIdx-- }}
      disabled={stepIdx === 0}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 disabled:text-ink-faint/50 disabled:border-line disabled:cursor-not-allowed transition-all"
    >上一步</button>
    <button
      on:click={() => { if (stepIdx < steps.length - 1) stepIdx++ }}
      disabled={stepIdx === steps.length - 1}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 disabled:text-ink-faint/50 disabled:border-line disabled:cursor-not-allowed transition-all"
    >下一步</button>
    <button
      on:click={() => stepIdx = 0}
      class="px-4 py-1.5 text-xs rounded-lg bg-paper text-ink-soft border border-line hover:text-ink hover:border-moss/50 hover:bg-moss/5 transition-all"
    >重置</button>
  </div>
</div>
