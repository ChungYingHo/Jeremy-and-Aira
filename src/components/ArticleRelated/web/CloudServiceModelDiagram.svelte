<script>
  const layers = [
    '應用程式',
    '資料',
    'Runtime / 中介軟體',
    'OS',
    '虛擬化',
    '硬體 / 網路',
  ]

  // true = 你管, false = 平台管
  const models = [
    { label: 'IaaS', managed: [true, true, true, true, false, false] },
    { label: 'PaaS', managed: [true, true, false, false, false, false] },
    { label: 'SaaS', managed: [false, false, false, false, false, false] },
  ]

  const ROW_H = 38
  const COL_W = 118
  const LABEL_W = 130
  const HEADER_Y = 28
  const ROWS_Y = 52
  const PAD = 4

  const FOOTER_Y = ROWS_Y + ROW_H * 6 + 16
  const examples = [
    ['AWS EC2', 'Google Compute Engine'],
    ['Heroku', 'Google App Engine'],
    ['Gmail', 'GitHub'],
  ]
</script>

<div class="w-full max-w-2xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <div class="px-4 pt-4 pb-1">
    <p class="text-center text-xs text-slate-500 mb-3 font-mono">雲端服務模型：誰管哪一層？</p>
    <div class="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs mb-1">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#78350f;border:1px solid #d97706"></span>
        <span class="text-slate-400">你管</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm inline-block" style="background:#1e3a5f;border:1px solid #3b82f6"></span>
        <span class="text-slate-400">平台管</span>
      </span>
    </div>
  </div>

  <svg
    viewBox="0 0 {LABEL_W + COL_W * 3 + PAD * 2} {FOOTER_Y + 42}"
    class="w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each models as model, ci}
      {@const cx = LABEL_W + ci * COL_W + PAD + (COL_W - PAD * 2) / 2}
      <text
        x={cx}
        y={HEADER_Y}
        text-anchor="middle"
        font-size="13"
        font-weight="bold"
        font-family="'JetBrains Mono', monospace"
        fill="#94a3b8"
      >{model.label}</text>
    {/each}

    {#each layers as layer, ri}
      {@const y = ROWS_Y + ri * ROW_H}
      <text
        x={LABEL_W - 10}
        y={y + ROW_H / 2 + 4}
        text-anchor="end"
        font-size="11"
        font-family="ui-sans-serif, system-ui, sans-serif"
        fill="#64748b"
      >{layer}</text>

      {#each models as model, ci}
        {@const x = LABEL_W + ci * COL_W + PAD}
        {@const isUser = model.managed[ri]}
        <rect
          x={x}
          y={y + 2}
          width={COL_W - PAD * 2}
          height={ROW_H - 4}
          fill={isUser ? '#78350f' : '#1e3a5f'}
          stroke={isUser ? '#d97706' : '#3b82f6'}
          stroke-width="1"
          rx="4"
        />
        <text
          x={x + (COL_W - PAD * 2) / 2}
          y={y + ROW_H / 2 + 4}
          text-anchor="middle"
          font-size="10"
          font-family="ui-sans-serif, system-ui, sans-serif"
          fill={isUser ? '#fde68a' : '#93c5fd'}
        >{isUser ? '你' : '平台'}</text>
      {/each}
    {/each}

    {#each models as model, ci}
      {@const cx = LABEL_W + ci * COL_W + PAD + (COL_W - PAD * 2) / 2}
      <text x={cx} y={FOOTER_Y} text-anchor="middle" font-size="11" font-weight="bold" font-family="'JetBrains Mono', monospace" fill="#94a3b8">{model.label}</text>
      {#each examples[ci] as ex, ei}
        <text x={cx} y={FOOTER_Y + 13 + ei * 13} text-anchor="middle" font-size="9.5" font-family="'JetBrains Mono', monospace" fill="#475569">{ex}</text>
      {/each}
    {/each}
  </svg>
</div>
