import React from 'react';
import HistoryList from '@/components/history/HistoryList';
import './Views.css';

export const History: React.FC = () => {
  return (
    <div className="view-container">
      <div className="history-container">
        <header className="history-header">
          <h1>Reading History</h1>
          <p className="subtitle">View and manage your reading logs</p>
        </header>
        <main className="history-content">
          <HistoryList />
        </main>
      </div>
    </div>
  );
};
