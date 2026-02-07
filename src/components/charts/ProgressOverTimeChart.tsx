import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ProgressLog } from '@/types/progress';
import './Charts.css';

interface ProgressOverTimeChartProps {
  logs: ProgressLog[];
  totalPages: number;
}

interface ChartData {
  date: string;
  page: number;
  percentage: number;
}

export const ProgressOverTimeChart: React.FC<ProgressOverTimeChartProps> = React.memo(({
  logs,
  totalPages,
}) => {
  const chartData = useMemo<ChartData[]>(() => {
    if (!logs || logs.length === 0) return [];

    // Sort logs by timestamp
    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

    // Map to chart data
    return sortedLogs.map((log) => ({
      date: format(new Date(log.timestamp), 'MMM d'),
      page: log.pageNumber,
      percentage: Math.round((log.pageNumber / totalPages) * 100),
    }));
  }, [logs, totalPages]);

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>📊 Start logging progress to see your reading trend</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              if (name === 'percentage') return [`${value || 0}%`, 'Progress'];
              if (name === 'page') return [value || 0, 'Page'];
              return [value || 0, name || ''];
            }}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProgress)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

ProgressOverTimeChart.displayName = 'ProgressOverTimeChart';

export default ProgressOverTimeChart;
