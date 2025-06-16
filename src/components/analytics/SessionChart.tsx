import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useAppStore } from '../../store/useAppStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SessionChartProps {
  type?: 'bar' | 'line';
  period?: 'week' | 'month' | 'year';
  height?: number;
}

const SessionChart: React.FC<SessionChartProps> = ({ 
  type = 'bar', 
  period = 'month',
  height = 300 
}) => {
  const { sessions } = useAppStore();

  // Generate chart data based on period
  const generateChartData = () => {
    const now = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    if (period === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const sessionsCount = sessions.filter(session => 
          session.date === dateStr && session.status === 'completed'
        ).length;
        data.push(sessionsCount);
      }
    } else if (period === 'month') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (i + 1) * 7);
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - i * 7);
        
        labels.push(`Week ${4 - i}`);
        
        const sessionsCount = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= startDate && sessionDate < endDate && session.status === 'completed';
        }).length;
        data.push(sessionsCount);
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        
        const sessionsCount = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate.getMonth() === date.getMonth() && 
                 sessionDate.getFullYear() === date.getFullYear() &&
                 session.status === 'completed';
        }).length;
        data.push(sessionsCount);
      }
    }

    return { labels, data };
  };

  const { labels, data } = generateChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completed Sessions',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: type === 'bar' ? 4 : 0,
        tension: type === 'line' ? 0.4 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Sessions - ${period.charAt(0).toUpperCase() + period.slice(1)}ly View`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
        },
        grid: {
          color: '#F3F4F6',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div style={{ height: `${height}px` }}>
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SessionChart;