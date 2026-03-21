<script>
  const W = 480, H = 222
  const padL = 32, padR = 12, padT = 28, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const maxTime = 12
  const meetings = [
    { id: 'A', start: 1, end: 4,  selected: true },
    { id: 'B', start: 3, end: 5,  selected: false },
    { id: 'C', start: 0, end: 6,  selected: false },
    { id: 'D', start: 5, end: 7,  selected: true },
    { id: 'E', start: 3, end: 9,  selected: false },
    { id: 'F', start: 6, end: 10, selected: false },
    { id: 'G', start: 8, end: 11, selected: true },
  ]
  const rowH = plotH / meetings.length
  const barH = 13

  function tx(t) { return padL + (t / maxTime) * plotW }
  function ty(i) { return padT + i * rowH + rowH / 2 }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 {W} {H}" class="w-full px-2 pt-2 pb-1" font-family="sans-serif">

    <!-- title -->
    <text x={W / 2} y="17" fill="#94a3b8" font-size="10" text-anchor="middle">活動選擇問題（貪婪：按結束時間排序）</text>

    <!-- grid lines -->
    {#each Array.from({ length: maxTime + 1 }, (_, i) => i) as t}
      <line
        x1={tx(t)} y1={padT}
        x2={tx(t)} y2={padT + plotH}
        stroke="#1e293b" stroke-width="1"
      />
    {/each}

    <!-- meeting bars -->
    {#each meetings as m, i}
      {@const x1 = tx(m.start)}
      {@const x2 = tx(m.end)}
      {@const cy = ty(i)}
      {@const fill = m.selected ? '#166534' : '#1e293b'}
      {@const stroke = m.selected ? '#22c55e' : '#334155'}
      {@const textFill = m.selected ? '#22c55e' : '#64748b'}

      <!-- meeting label -->
      <text x={padL - 6} y={cy + 4} fill={textFill} font-size="10" text-anchor="end" font-weight={m.selected ? '700' : '400'}>{m.id}</text>

      <!-- bar -->
      <rect x={x1} y={cy - barH / 2} width={x2 - x1} height={barH} rx="2" fill={fill} stroke={stroke} stroke-width="1" />

      <!-- time labels inside bar -->
      <text x={(x1 + x2) / 2} y={cy + 4} fill={m.selected ? '#86efac' : '#475569'} font-size="8.5" text-anchor="middle">{m.start}–{m.end}</text>
    {/each}

    <!-- X axis -->
    <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#475569" stroke-width="1" />

    <!-- time ticks & labels -->
    {#each Array.from({ length: maxTime + 1 }, (_, i) => i) as t}
      <line x1={tx(t)} y1={padT + plotH} x2={tx(t)} y2={padT + plotH + 4} stroke="#475569" stroke-width="1" />
      <text x={tx(t)} y={padT + plotH + 13} fill="#475569" font-size="8.5" text-anchor="middle">{t}</text>
    {/each}

    <!-- legend -->
    <rect x={padL} y={H - 10} width="10" height="8" rx="1" fill="#166534" stroke="#22c55e" stroke-width="1" />
    <text x={padL + 13} y={H - 3} fill="#94a3b8" font-size="8.5">選中</text>
    <rect x={padL + 42} y={H - 10} width="10" height="8" rx="1" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x={padL + 55} y={H - 3} fill="#94a3b8" font-size="8.5">未選</text>
  </svg>
</div>
