<script>
  import { onMount } from 'svelte'
  import Chart from 'chart.js/auto'
  // 引入標籤外掛
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  let canvas

  onMount(() => {
    // 註冊外掛
    Chart.register(ChartDataLabels);

    const maxN = 12;
    const yAxisMax = 120; // Y軸天花板

    // 🌟 核心魔法：計算數據，並在撞到 Y=120 天花板時精準截斷
    function generateData(calcFn) {
        const data = [];
        for (let x = 1; x <= maxN; x++) {
            const y = calcFn(x);
            
            // 如果這一步會衝破天花板
            if (y >= yAxisMax) {
                if (y === yAxisMax) {
                    data.push({ x: x, y: yAxisMax });
                } else {
                    // 線性插值：算出精準撞擊天花板的 X 座標
                    const prevX = x - 1;
                    const prevY = data[data.length - 1].y;
                    const fraction = (yAxisMax - prevY) / (y - prevY);
                    const exactX = prevX + fraction;
                    
                    data.push({ x: exactX, y: yAxisMax });
                }
                break; // 停止產生後續資料，讓線條完美停在邊界
            }
            data.push({ x: x, y: y });
        }
        return data;
    }

    // 階乘計算
    const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

    // 設定線條樣式與數據
    const datasets = [
      { label: 'O(1)', data: generateData(() => 3), borderColor: '#10b981' },
      { label: 'O(log n)', data: generateData(x => Math.log2(x) * 3 + 3), borderColor: '#3b82f6' },
      { label: 'O(n)', data: generateData(x => x * 2.5 + 2), borderColor: '#f59e0b' },
      { label: 'O(n log n)', data: generateData(x => x * Math.log2(x) * 2.5 + 2), borderColor: '#f97316' },
      { label: 'O(n²)', data: generateData(x => Math.pow(x, 2) * 1.2), borderColor: '#ef4444' },
      { label: 'O(2ⁿ)', data: generateData(x => Math.pow(2, x) * 0.5), borderColor: '#b91c1c' },
      { label: 'O(n!)', data: generateData(x => factorial(x) * 0.1), borderColor: '#7f1d1d' }
    ].map(ds => ({
        ...ds,
        cubicInterpolationMode: 'monotone', // 🌟 防止陡峭曲線產生不自然的扭曲 (overshoot)
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: false
    }));

    new Chart(canvas, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        layout: {
            padding: {
                right: 80, // 給右側標籤留空間
                top: 30,   // 🌟 給頂部標籤留空間，防止 O(2^n) 被切斷
                bottom: 10,
                left: 10
            }
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            color: (context) => context.dataset.borderColor,
            font: {
                weight: 'bold',
                size: 13,
                family: "'JetBrains Mono', monospace"
            },
            align: 'right', // 統一放在線條末端的右側
            anchor: 'center',
            offset: 6,
            clip: false, // 🌟 絕對不允許畫布切斷文字
            formatter: (value, context) => {
                const dataArray = context.dataset.data;
                // 🌟 只在陣列的「最後一個點」(也就是邊界點) 顯示標籤
                if (context.dataIndex === dataArray.length - 1) {
                    return context.dataset.label;
                }
                return null;
            }
          }
        },
        scales: {
          x: {
            type: 'linear', // 🌟 改用線性軸，才能支援帶有小數點的精準 X 座標
            min: 1,
            max: 12,
            title: { display: true, text: 'Elements (n)', color: '#94a3b8' },
            ticks: {
                stepSize: 1, // 刻度依然保持整數 1, 2, 3...
                color: '#94a3b8' 
            },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            title: { display: true, text: 'Operations (Time)', color: '#94a3b8' },
            max: yAxisMax, 
            min: 0,
            ticks: { display: false }, 
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    })
  })
</script>

<div class="w-full max-w-3xl mx-auto my-8 p-4 bg-[#0a0a0a] rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  <canvas bind:this={canvas}></canvas>
</div>