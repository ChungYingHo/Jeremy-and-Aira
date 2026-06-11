<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 480 210" class="w-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .layer-label { font-family: sans-serif; font-size: 11px; font-weight: 600; }
        .layer-sub   { font-family: sans-serif; font-size: 9px; }
        .proto       { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
      </style>
    </defs>

    <!-- Application Layer -->
    <rect x="10" y="10" width="460" height="44" rx="4" fill="#e6ece2" stroke="#5f7355" stroke-width="1"/>
    <text x="30" y="28" class="layer-label" fill="#3f5239">應用層</text>
    <text x="30" y="44" class="layer-sub" fill="#5f7355">Application Layer</text>
    <line x1="185" y1="10" x2="185" y2="54" stroke="#5f7355" stroke-width="1"/>
    <text x="200" y="31" class="proto" fill="#5d574d">HTTP · HTTPS · DNS · SMTP</text>

    <!-- Transport Layer -->
    <rect x="10" y="61" width="460" height="44" rx="4" fill="#e2eaf0" stroke="#6e94b5" stroke-width="1"/>
    <text x="30" y="79" class="layer-label" fill="#3f5f7a">傳輸層</text>
    <text x="30" y="95" class="layer-sub" fill="#6e94b5">Transport Layer</text>
    <line x1="185" y1="61" x2="185" y2="105" stroke="#6e94b5" stroke-width="1"/>
    <text x="200" y="82" class="proto" fill="#5d574d">TCP</text>
    <text x="230" y="82" class="layer-sub" fill="#8f8a80">（可靠）</text>
    <text x="200" y="98" class="proto" fill="#5d574d">UDP</text>
    <text x="230" y="98" class="layer-sub" fill="#8f8a80">（快速）</text>

    <!-- Internet Layer -->
    <rect x="10" y="112" width="460" height="44" rx="4" fill="#f4ecd4" stroke="#c9a64e" stroke-width="1"/>
    <text x="30" y="130" class="layer-label" fill="#8a6d23">網路層</text>
    <text x="30" y="146" class="layer-sub" fill="#c9a64e">Internet Layer</text>
    <line x1="185" y1="112" x2="185" y2="156" stroke="#c9a64e" stroke-width="1"/>
    <text x="200" y="138" class="proto" fill="#5d574d">IP · ICMP</text>

    <!-- Network Access Layer -->
    <rect x="10" y="163" width="460" height="44" rx="4" fill="#f3e3dc" stroke="#b3674a" stroke-width="1"/>
    <text x="30" y="181" class="layer-label" fill="#8a4a32">網路存取層</text>
    <text x="30" y="197" class="layer-sub" fill="#b3674a">Network Access Layer</text>
    <line x1="185" y1="163" x2="185" y2="207" stroke="#b3674a" stroke-width="1"/>
    <text x="200" y="189" class="proto" fill="#5d574d">乙太網路 · Wi-Fi · 光纖</text>
  </svg>
</div>
