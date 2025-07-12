import React, { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  data: number[];
  rawScores?: string[];
  label: string;
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  rawScores,
  label,
  height = 96
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);

  const labels = data.map((_, index) => `Match ${index + 1}`);

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: 'rgba(90, 141, 238, 0.6)',
        borderColor: '#5A8DEE',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#B0B8D1',
          font: {
            size: 9,
          },
          maxTicksLimit: 5,
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#B0B8D1',
          font: {
            size: 9,
          },
        },
      },
    },
    animation: {
      onComplete: () => {
        if (chartRef.current) {
          const chart = chartRef.current;
          const points = chart.getDatasetMeta(0).data.map(bar => ({
            x: bar.x,
            y: bar.y
          }));
          setDataPoints(points);
        }
      }
    }
  };

  return (
    <div className="relative" style={{ height }}>
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
      {rawScores && dataPoints.length > 0 && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {rawScores.map((score, idx) => {
            const point = dataPoints[idx];
            if (!point) return null;

            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 
                  flex-shrink-0 rounded-lg p-1.5 text-center min-w-[29px] bg-[#1A2337] text-[#5A8DEE]"
                style={{
                  left: `${point.x}px`,
                  top: `${point.y - 15}px`,
                }}
              >
                <p className="text-[11px] font-semibold">{score}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PerformanceChart; 