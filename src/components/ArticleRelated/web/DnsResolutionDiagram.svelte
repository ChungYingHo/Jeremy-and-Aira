<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 320 420" class="w-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="dns-arrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6"/>
      </marker>
      <style>
        .node-label  { font-family: sans-serif; font-size: 11px; font-weight: 600; fill: #94a3b8; }
        .node-sub    { font-family: sans-serif; font-size: 9px; fill: #475569; }
        .step-num    { font-family: sans-serif; font-size: 12px; font-weight: 700; fill: #3b82f6; }
        .step-desc   { font-family: sans-serif; font-size: 9px; fill: #475569; }
      </style>
    </defs>

    <!-- Node 1: Browser -->
    <rect x="50" y="10" width="220" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="160" y="23" class="node-label" text-anchor="middle">你的瀏覽器</text>
    <text x="160" y="37" class="node-sub" text-anchor="middle">輸入 example.com</text>

    <!-- Arrow 1 -->
    <line x1="160" y1="44" x2="160" y2="72" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#dns-arrow)"/>
    <text x="38" y="61" class="step-num" text-anchor="middle">①</text>
    <text x="215" y="57" class="step-desc">問：這網址的 IP 是多少？</text>

    <!-- Node 2: Recursive Resolver -->
    <rect x="50" y="75" width="220" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="160" y="88" class="node-label" text-anchor="middle">Recursive Resolver</text>
    <text x="160" y="102" class="node-sub" text-anchor="middle">ISP / 8.8.8.8</text>

    <!-- Arrow 2 -->
    <line x1="160" y1="109" x2="160" y2="137" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#dns-arrow)"/>
    <text x="38" y="126" class="step-num" text-anchor="middle">②</text>
    <text x="215" y="122" class="step-desc">問：.com 在哪？</text>
    <text x="215" y="134" class="step-desc">回：去問 .com TLD</text>

    <!-- Node 3: Root Nameserver -->
    <rect x="50" y="140" width="220" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="160" y="153" class="node-label" text-anchor="middle">Root Nameserver</text>
    <text x="160" y="167" class="node-sub" text-anchor="middle">全球 13 組根伺服器</text>

    <!-- Arrow 3 -->
    <line x1="160" y1="174" x2="160" y2="202" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#dns-arrow)"/>
    <text x="38" y="191" class="step-num" text-anchor="middle">③</text>
    <text x="215" y="187" class="step-desc">問：example.com 的 IP？</text>
    <text x="215" y="199" class="step-desc">回：去問 Authoritative NS</text>

    <!-- Node 4: TLD Nameserver -->
    <rect x="50" y="205" width="220" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="160" y="218" class="node-label" text-anchor="middle">TLD Nameserver</text>
    <text x="160" y="232" class="node-sub" text-anchor="middle">.com 區段管理</text>

    <!-- Arrow 4 -->
    <line x1="160" y1="239" x2="160" y2="267" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#dns-arrow)"/>
    <text x="38" y="256" class="step-num" text-anchor="middle">④</text>
    <text x="215" y="252" class="step-desc">回傳：93.184.216.34</text>

    <!-- Node 5: Authoritative Nameserver -->
    <rect x="50" y="270" width="220" height="34" rx="4" fill="#0f172a" stroke="#1e3a5f" stroke-width="1"/>
    <text x="160" y="283" class="node-label" text-anchor="middle">Authoritative Nameserver</text>
    <text x="160" y="297" class="node-sub" text-anchor="middle">網域的最終答案來源</text>

    <!-- Final note -->
    <text x="160" y="340" font-family="sans-serif" font-size="10" fill="#3b82f6" text-anchor="middle" font-weight="600">⑤ 取得 IP 位址，回傳給瀏覽器</text>
    <line x1="160" y1="304" x2="160" y2="330" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3"/>
    <text x="160" y="360" font-family="sans-serif" font-size="9" fill="#475569" text-anchor="middle">結果通常會被快取，下次查詢更快</text>
  </svg>
</div>
