<script>
  const W = 480, H = 260
  const padL = 50, padR = 20, padT = 20, padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const maxN = 20
  const maxT = 120

  function toSVG(n, t, maxT) {
    const x = padL + (n / maxN) * plotW
    const y = padT + plotH - (t / maxT) * plotH
    return [x, y]
  }

  function makePath(fn, maxT) {
    const pts = []
    for (let n = 0.5; n <= maxN; n += 0.3) {
      const t = fn(n)
      if (t < 0 || t > maxT * 1.05) { if (pts.length) break; continue }
      const [x, y] = toSVG(n, t, maxT)
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  const fPath = makePath(n => 1.8 * n * Math.log2(n + 1) + 8, maxT)
  const upperPath = makePath(n => 3 * n * Math.log2(n + 1) + 5, maxT)
  const lowerPath = makePath(n => 0.9 * n * Math.log2(n + 1) + 12, maxT)

  const n0 = 4
  const [n0x] = toSVG(n0, 0, maxT)

  const axisY = padT + plotH
  const axisX = padL

  const labelY = {
    upper: toSVG(14, 3 * 14 * Math.log2(15) + 5, maxT)[1],
    lower: toSVG(16, 0.9 * 16 * Math.log2(17) + 12, maxT)[1],
    f: toSVG(15.5, 1.8 * 15.5 * Math.log2(16.5) + 8, maxT)[1],
  }
</script>

<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 480 272" class="w-full px-2 pt-2 pb-1" font-family="sans-serif">
    <!-- Y axis -->
    <line x1={axisX} y1={padT} x2={axisX} y2={axisY} stroke="#475569" stroke-width="1" />
    <!-- X axis -->
    <line x1={axisX} y1={axisY} x2={W - padR} y2={axisY} stroke="#475569" stroke-width="1" />

    <!-- Y axis label -->
    <text
      x={padL - 38}
      y={padT + plotH / 2}
      fill="#94a3b8"
      font-size="11"
      text-anchor="middle"
      transform={`rotate(-90, ${padL - 38}, ${padT + plotH / 2})`}
    >T(n)</text>

    <!-- X axis label -->
    <text x={W - padR + 4} y={axisY + 4} fill="#94a3b8" font-size="11" text-anchor="start" dominant-baseline="middle">n</text>

    <!-- n0 vertical dashed line -->
    <line
      x1={n0x} y1={padT}
      x2={n0x} y2={axisY}
      stroke="#475569"
      stroke-width="1"
      stroke-dasharray="3,3"
    />

    <!-- n0 label -->
    <text x={n0x} y={axisY + 12} fill="#475569" font-size="10" text-anchor="middle">n₀</text>

    <!-- upper bound path -->
    <path d={upperPath} fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6,3" />

    <!-- lower bound path -->
    <path d={lowerPath} fill="none" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="6,3" />

    <!-- f(n) path -->
    <path d={fPath} fill="none" stroke="#94a3b8" stroke-width="2" />

    <!-- curve labels -->
    <text x={W - padR - 2} y={labelY.upper - 4} fill="#3b82f6" font-size="10" text-anchor="end">c·g(n)</text>
    <text x={W - padR - 2} y={labelY.f - 4} fill="#94a3b8" font-size="10" text-anchor="end">f(n)</text>
    <text x={W - padR - 2} y={labelY.lower + 12} fill="#22c55e" font-size="10" text-anchor="end">c'·g(n)</text>

    <!-- legend -->
    <line x1="52" y1="248" x2="68" y2="248" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6,3" />
    <text x="72" y="252" fill="#94a3b8" font-size="9">O（漸進上界）</text>

    <line x1="150" y1="248" x2="166" y2="248" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="6,3" />
    <text x="170" y="252" fill="#94a3b8" font-size="9">Ω（漸進下界）</text>

    <line x1="252" y1="248" x2="268" y2="248" stroke="#94a3b8" stroke-width="2" />
    <text x="272" y="252" fill="#94a3b8" font-size="9">f(n)（實際函數）</text>

    <!-- theta explanation -->
    <text x="240" y="264" fill="#475569" font-size="8.5" text-anchor="middle">n₀ 後，c'·g(n) ≤ f(n) ≤ c·g(n)（此即 Θ 緊界成立的條件）</text>
  </svg>
</div>
