<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 500 270" class="w-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="cdn-arrow-solid" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8"/>
      </marker>
      <marker id="cdn-arrow-fast" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22c55e"/>
      </marker>
      <marker id="cdn-arrow-dashed" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#475569"/>
      </marker>
      <style>
        .section-title { font-family: sans-serif; font-size: 10px; font-weight: 700; }
        .node-label    { font-family: sans-serif; font-size: 10px; font-weight: 600; fill: #94a3b8; }
        .node-sub      { font-family: sans-serif; font-size: 8px; fill: #475569; }
        .edge-label    { font-family: sans-serif; font-size: 9px; }
      </style>
    </defs>

    <!-- Section title: No CDN -->
    <text x="14" y="22" class="section-title" fill="#475569">沒有 CDN</text>

    <!-- User node (no CDN) -->
    <rect x="20" y="30" width="90" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="65" y="44" class="node-label" text-anchor="middle">使用者</text>
    <text x="65" y="57" class="node-sub" text-anchor="middle">台灣</text>

    <!-- Arrow: user → origin (solid, long) -->
    <line x1="110" y1="47" x2="368" y2="47" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#cdn-arrow-solid)"/>
    <text x="239" y="41" class="edge-label" fill="#f59e0b" text-anchor="middle">距離遠 · 延遲高</text>
    <text x="239" y="61" class="edge-label" fill="#475569" text-anchor="middle">2000km+</text>

    <!-- Origin server node (no CDN) -->
    <rect x="370" y="30" width="110" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="425" y="44" class="node-label" text-anchor="middle">原始伺服器</text>
    <text x="425" y="57" class="node-sub" text-anchor="middle">美國東岸</text>

    <!-- Divider -->
    <line x1="0" y1="115" x2="500" y2="115" stroke="#1e293b" stroke-width="1"/>

    <!-- Section title: With CDN -->
    <text x="14" y="137" class="section-title" fill="#475569">有 CDN</text>

    <!-- User node (CDN) -->
    <rect x="20" y="145" width="90" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="65" y="159" class="node-label" text-anchor="middle">使用者</text>
    <text x="65" y="172" class="node-sub" text-anchor="middle">台灣</text>

    <!-- Arrow: user → edge (solid, short, green) -->
    <line x1="110" y1="162" x2="178" y2="162" stroke="#22c55e" stroke-width="1.5" marker-end="url(#cdn-arrow-fast)"/>
    <text x="144" y="155" class="edge-label" fill="#22c55e" text-anchor="middle">距離近</text>
    <text x="144" y="175" class="edge-label" fill="#22c55e" text-anchor="middle">延遲低</text>

    <!-- CDN Edge Node -->
    <rect x="180" y="145" width="110" height="34" rx="4" fill="#0c1a2e" stroke="#1e3a5f" stroke-width="1"/>
    <text x="235" y="159" class="node-label" text-anchor="middle">CDN Edge Node</text>
    <text x="235" y="172" class="node-sub" text-anchor="middle">新加坡 / 東京</text>

    <!-- Arrow: edge → origin (dashed) -->
    <line x1="290" y1="162" x2="368" y2="162" stroke="#475569" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#cdn-arrow-dashed)"/>
    <text x="329" y="155" class="edge-label" fill="#475569" text-anchor="middle">cache miss</text>
    <text x="329" y="168" class="edge-label" fill="#475569" text-anchor="middle">才走</text>

    <!-- Origin server node (CDN) -->
    <rect x="370" y="145" width="110" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="425" y="159" class="node-label" text-anchor="middle">原始伺服器</text>
    <text x="425" y="172" class="node-sub" text-anchor="middle">美國東岸</text>

    <!-- Cache hit legend -->
    <text x="14" y="220" font-family="sans-serif" font-size="9" fill="#475569">Cache Hit：Edge Node 直接回應，不回原始伺服器</text>
    <text x="14" y="235" font-family="sans-serif" font-size="9" fill="#475569">Cache Miss：Edge Node 無快取，向原始伺服器取得後再回傳並快取</text>
  </svg>
</div>
