import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ProgressLog } from '@/types/progress';
import './Charts.css';

interface PagesPerDayChartProps {
  logs: ProgressLog[];
}

interface ChartData {
  date: string;
  pages: number;
  fullDate: Date;
}

export const PagesPerDayChart: React.FC<PagesPerDayChartProps> = React.memo(({ logs }) => {
  const chartData = useMemo<ChartData[]>(() => {
    if (!logs || logs.length === 0) return [];

    // Group logs by day
    const dailyPages: Map<string, number> = new Map();

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');

      const existing = dailyPages.get(dateKey) || 0;
      dailyPages.set(dateKey, existing + log.pagesRead);
    });

    // Convert to array and sort by date
    const data = Array.from(dailyPages.entries()).map(([dateKey, pages]) => ({
      date: format(new Date(dateKey), 'MMM d'),
      pages,
      fullDate: new Date(dateKey),
    }));

    return data.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  }, [logs]);

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>📊 Start logging progress to see daily statistics</p>
      </div>
    );
  }

  // Calculate average
  const totalPages = chartData.reduce((sum, day) => sum + day.pages, 0);
  const avgPages = Math.round(totalPages / chartData.length);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Pages Per Day</h3>
        <span className="chart-stat">Avg: {avgPages} pages/day</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            formatter={(value: number | undefined) => [`${value || 0} pages`, 'Read']}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Bar
            dataKey="pages"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

PagesPerDayChart.displayName = 'PagesPerDayChart';

export default PagesPerDayChart;
