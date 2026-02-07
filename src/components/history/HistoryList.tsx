import React from 'react';
import { useProgressStore } from '@/store/progressStore';
import { ProgressLog } from '@/types/progress';
import { format, isSameDay } from 'date-fns';
import LogEntry from './LogEntry';
import './History.css';

const HistoryList: React.FC = () => {
  const { logs, updateLog, deleteLog } = useProgressStore();

  if (logs.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty__icon">📜</div>
        <h3>No reading logs yet</h3>
        <p>Start logging your progress to see your history here</p>
      </div>
    );
  }

  // Group logs by date
  const groupedLogs: { [key: string]: ProgressLog[] } = {};
  logs.forEach((log) => {
    const dateKey = format(log.timestamp, 'yyyy-MM-dd');
    if (!groupedLogs[dateKey]) {
      groupedLogs[dateKey] = [];
    }
    groupedLogs[dateKey].push(log);
  });

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  return (
    <div className="history-list">
      {sortedDates.map((dateKey) => {
        const logsForDate = groupedLogs[dateKey];
        const dateLabel = isSameDay(new Date(dateKey), new Date())
          ? 'Today'
          : format(new Date(dateKey), 'EEEE, MMM dd, yyyy');

        return (
          <div key={dateKey} className="history-group">
            <h3 className="history-group__date">{dateLabel}</h3>
            <div className="history-group__logs">
              {logsForDate.map((log) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  onEdit={updateLog}
                  onDelete={deleteLog}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
