import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsCharts({ difficultyStats, topTags }) {
  const difficultyChartData = {
    labels: difficultyStats.map(stat => stat.name),
    datasets: [
      {
        data: difficultyStats.map(stat => stat.count),
        backgroundColor: difficultyStats.map(stat => stat.chartColor),
        borderColor: difficultyStats.map(stat => stat.borderColor),
        borderWidth: 1,
      },
    ],
  };

  const tagsChartData = {
    labels: topTags.map(tag => tag.name),
    datasets: [
      {
        label: 'Problems Solved',
        data: topTags.map(tag => tag.count),
        backgroundColor: 'rgba(137, 180, 250, 0.8)',
        borderColor: 'rgb(137, 180, 250)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#CDD6F4',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 20,
        },
      },
      tooltip: {
        titleColor: '#CDD6F4',
        bodyColor: '#CDD6F4',
        backgroundColor: '#1E1E2E',
        borderColor: '#313244',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || ''}: ${Math.round(context.raw)}`;
          }
        }
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#CDD6F4',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
          stepSize: 1,
          callback: function(value) {
            return Math.round(value);
          }
        },
        grid: {
          color: '#313244',
          drawBorder: false,
        },
        border: {
          color: '#313244',
        },
      },
      x: {
        ticks: {
          color: '#CDD6F4',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 8,
        },
        grid: {
          color: '#313244',
          drawBorder: false,
        },
        border: {
          color: '#313244',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">Difficulty Distribution</h3>
        <div className="h-48">
          <Pie data={difficultyChartData} options={chartOptions} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">Top Tags</h3>
        <div className="h-48">
          <Bar data={tagsChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
} 