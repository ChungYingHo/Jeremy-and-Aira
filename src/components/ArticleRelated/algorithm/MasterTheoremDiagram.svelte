<div class="w-full max-w-3xl mx-auto my-8 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <svg viewBox="0 0 480 230" class="w-full px-2 py-3" font-family="sans-serif">
    <!-- title -->
    <text x="240" y="18" fill="#5d574d" font-size="11" text-anchor="middle">
      T(n) = aT(n/b) + f(n)，令 c = log_b(a)
    </text>

    <!-- Case 1 -->
    <rect x="10" y="30" width="148" height="188" rx="4" fill="#e2eaf0" stroke="#6e94b5" stroke-width="1.5" />
    <rect x="10" y="30" width="148" height="5" rx="4" fill="#6e94b5" />

    <text x="84" y="56" fill="#3f5f7a" font-size="11" font-weight="bold" text-anchor="middle">Case 1</text>

    <text x="84" y="76" fill="#5d574d" font-size="9.5" text-anchor="middle" font-family="'JetBrains Mono', monospace">
      f(n) = O(n^(c-ε))
    </text>

    <text x="84" y="96" fill="#5d574d" font-size="9" text-anchor="middle">f(n) 比 n^c 成長慢</text>

    <rect x="24" y="108" width="120" height="1" fill="#6e94b5" />

    <text x="84" y="128" fill="#3f5f7a" font-size="10" font-weight="bold" text-anchor="middle">T(n) = Θ(n^c)</text>

    <rect x="24" y="140" width="120" height="1" fill="#6e94b5" />

    <text x="84" y="158" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">T(n)=8T(n/2)+O(n²)</text>
    <text x="84" y="172" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">a=8, b=2, c=3</text>
    <text x="84" y="186" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">f(n)=O(n²)=O(n^(c-1))</text>
    <text x="84" y="205" fill="#3f5f7a" font-size="9" text-anchor="middle">→ Θ(n³)</text>

    <!-- Case 2 -->
    <rect x="166" y="30" width="148" height="188" rx="4" fill="#e6ece2" stroke="#5f7355" stroke-width="1.5" />
    <rect x="166" y="30" width="148" height="5" rx="4" fill="#5f7355" />

    <text x="240" y="56" fill="#3f5239" font-size="11" font-weight="bold" text-anchor="middle">Case 2</text>

    <text x="240" y="76" fill="#5d574d" font-size="9.5" text-anchor="middle" font-family="'JetBrains Mono', monospace">
      f(n) = Θ(n^c)
    </text>

    <text x="240" y="96" fill="#5d574d" font-size="9" text-anchor="middle">f(n) 與 n^c 相當</text>

    <rect x="180" y="108" width="120" height="1" fill="#5f7355" />

    <text x="240" y="128" fill="#3f5239" font-size="10" font-weight="bold" text-anchor="middle">T(n) = Θ(n^c log n)</text>

    <rect x="180" y="140" width="120" height="1" fill="#5f7355" />

    <text x="240" y="158" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">Merge Sort</text>
    <text x="240" y="172" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">T(n)=2T(n/2)+O(n)</text>
    <text x="240" y="186" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">a=2, b=2, c=1</text>
    <text x="240" y="205" fill="#3f5239" font-size="9" text-anchor="middle">→ Θ(n log n)</text>

    <!-- Case 3 -->
    <rect x="322" y="30" width="148" height="188" rx="4" fill="#f4ecd4" stroke="#c9a64e" stroke-width="1.5" />
    <rect x="322" y="30" width="148" height="5" rx="4" fill="#c9a64e" />

    <text x="396" y="56" fill="#8a6d23" font-size="11" font-weight="bold" text-anchor="middle">Case 3</text>

    <text x="396" y="76" fill="#5d574d" font-size="9.5" text-anchor="middle" font-family="'JetBrains Mono', monospace">
      f(n) = Ω(n^(c+ε))
    </text>

    <text x="396" y="96" fill="#5d574d" font-size="9" text-anchor="middle">f(n) 比 n^c 成長快</text>

    <rect x="336" y="108" width="120" height="1" fill="#c9a64e" />

    <text x="396" y="128" fill="#8a6d23" font-size="10" font-weight="bold" text-anchor="middle">T(n) = Θ(f(n))</text>

    <rect x="336" y="140" width="120" height="1" fill="#c9a64e" />

    <text x="396" y="158" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">T(n)=T(n/2)+O(n)</text>
    <text x="396" y="172" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">a=1, b=2, c=0</text>
    <text x="396" y="186" fill="#8a8475" font-size="9" text-anchor="middle" font-family="'JetBrains Mono', monospace">f(n)=O(n)=Ω(n^(0+1))</text>
    <text x="396" y="205" fill="#8a6d23" font-size="9" text-anchor="middle">→ Θ(n)</text>
  </svg>
</div>
