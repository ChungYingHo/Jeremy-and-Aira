<script>
  import { onMount } from 'svelte'
  import Chart from 'chart.js/auto'
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  let canvas

  onMount(() => {
    Chart.register(ChartDataLabels);

    const maxN = 12;
    const yAxisMax = 120;

    function generateData(calcFn) {
        const data = [];
        for (let x = 1; x <= maxN; x++) {
            const y = calcFn(x);
            
            if (y >= yAxisMax) {
                if (y === yAxisMax) {
                    data.push({ x: x, y: yAxisMax });
                } else {
                    const prevX = x - 1;
                    const prevY = data[data.length - 1].y;
                    const fraction = (yAxisMax - prevY) / (y - prevY);
                    const exactX = prevX + fraction;
                    
                    data.push({ x: exactX, y: yAxisMax });
                }
                break; 
            }
            data.push({ x: x, y: y });
        }
        return data;
    }

    const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

    const datasets = [
      { label: 'O(1)', data: generateData(() => 3), borderColor: '#5f7355' },
      { label: 'O(log n)', data: generateData(x => Math.log2(x) * 3 + 3), borderColor: '#6e94b5' },
      { label: 'O(n)', data: generateData(x => x * 2.5 + 2), borderColor: '#8ba07e' },
      { label: 'O(n log n)', data: generateData(x => x * Math.log2(x) * 2.5 + 2), borderColor: '#c9a64e' },
      { label: 'O(n²)', data: generateData(x => Math.pow(x, 2) * 1.2), borderColor: '#d0833e' },
      { label: 'O(2ⁿ)', data: generateData(x => Math.pow(2, x) * 0.5), borderColor: '#c46a5c' },
      { label: 'O(n!)', data: generateData(x => factorial(x) * 0.1), borderColor: '#9c3f33' }
    ].map(ds => ({
        ...ds,
        cubicInterpolationMode: 'monotone',
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
        maintainAspectRatio: false, 
        layout: {
            padding: {
                // 右邊距加大以容納最長的曲線標籤，避免被切斷
                right: window.innerWidth < 640 ? 90 : 120,
                top: 30,
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
                size: window.innerWidth < 640 ? 11 : 13, 
                family: "'JetBrains Mono', monospace"
            },
            align: 'right',
            anchor: 'center',
            offset: 4,
            clip: false,
            formatter: (value, context) => {
                const dataArray = context.dataset.data;
                if (context.dataIndex === dataArray.length - 1) {
                    return context.dataset.label;
                }
                return null;
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 1,
            max: 12,
            title: { display: true, text: 'Elements (n)', color: '#8f8a80' },
            ticks: {
                stepSize: 1,
                color: '#8f8a80'
            },
            grid: { color: 'rgba(45,42,37,0.06)' }
          },
          y: {
            title: { display: true, text: 'Operations (Time)', color: '#8f8a80' },
            max: yAxisMax,
            min: 0,
            ticks: { display: false },
            grid: { color: 'rgba(45,42,37,0.06)' }
          }
        }
      }
    })
  })
</script>

<div class="w-full max-w-3xl mx-auto my-8 p-2 md:p-4 bg-cream rounded-xl border border-line shadow-sm overflow-hidden">
  <div class="relative w-full h-[350px] md:h-[500px]">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>