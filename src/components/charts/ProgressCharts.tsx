import React from 'react';
import { useProgressStore } from '@/store/progressStore';
import ProgressOverTimeChart from './ProgressOverTimeChart';
import PagesPerDayChart from './PagesPerDayChart';
import './Charts.css';

interface ProgressChartsProps {
  className?: string;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ className }) => {
  const { logs, goal } = useProgressStore();

  if (!goal) {
    return (
      <div className={className}>
        <div className="chart-empty">
          <p>📊 Complete onboarding to see progress charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`charts-section ${className || ''}`}>
      <div className="charts-grid">
        <ProgressOverTimeChart logs={logs} totalPages={goal.mushaf.totalPages} />
        <PagesPerDayChart logs={logs} />
      </div>
    </div>
  );
};

export default ProgressCharts;
