<div class="w-full max-w-3xl mx-auto my-8 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <svg viewBox="0 0 480 210" class="w-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .layer-label { font-family: sans-serif; font-size: 11px; font-weight: 600; }
        .layer-sub   { font-family: sans-serif; font-size: 9px; }
        .proto       { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
      </style>
    </defs>

    <!-- Application Layer -->
    <rect x="10" y="10" width="460" height="44" rx="4" fill="#0c1a2e" stroke="#1e3a5f" stroke-width="1"/>
    <text x="30" y="28" class="layer-label" fill="#3b82f6">應用層</text>
    <text x="30" y="44" class="layer-sub" fill="#60a5fa">Application Layer</text>
    <line x1="185" y1="10" x2="185" y2="54" stroke="#1e3a5f" stroke-width="1"/>
    <text x="200" y="31" class="proto" fill="#94a3b8">HTTP · HTTPS · DNS · SMTP</text>

    <!-- Transport Layer -->
    <rect x="10" y="61" width="460" height="44" rx="4" fill="#0f1f0f" stroke="#14532d" stroke-width="1"/>
    <text x="30" y="79" class="layer-label" fill="#22c55e">傳輸層</text>
    <text x="30" y="95" class="layer-sub" fill="#4ade80">Transport Layer</text>
    <line x1="185" y1="61" x2="185" y2="105" stroke="#14532d" stroke-width="1"/>
    <text x="200" y="82" class="proto" fill="#94a3b8">TCP</text>
    <text x="230" y="82" class="layer-sub" fill="#475569">（可靠）</text>
    <text x="200" y="98" class="proto" fill="#94a3b8">UDP</text>
    <text x="230" y="98" class="layer-sub" fill="#475569">（快速）</text>

    <!-- Internet Layer -->
    <rect x="10" y="112" width="460" height="44" rx="4" fill="#1c1200" stroke="#78350f" stroke-width="1"/>
    <text x="30" y="130" class="layer-label" fill="#f59e0b">網路層</text>
    <text x="30" y="146" class="layer-sub" fill="#fbbf24">Internet Layer</text>
    <line x1="185" y1="112" x2="185" y2="156" stroke="#78350f" stroke-width="1"/>
    <text x="200" y="138" class="proto" fill="#94a3b8">IP · ICMP</text>

    <!-- Network Access Layer -->
    <rect x="10" y="163" width="460" height="44" rx="4" fill="#130f1e" stroke="#4c1d95" stroke-width="1"/>
    <text x="30" y="181" class="layer-label" fill="#a78bfa">網路存取層</text>
    <text x="30" y="197" class="layer-sub" fill="#c4b5fd">Network Access Layer</text>
    <line x1="185" y1="163" x2="185" y2="207" stroke="#4c1d95" stroke-width="1"/>
    <text x="200" y="189" class="proto" fill="#94a3b8">乙太網路 · Wi-Fi · 光纖</text>
  </svg>
</div>
