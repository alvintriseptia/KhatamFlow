import React, { useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { exportToCSV, getExportSummary } from '@/core/export/csvExport';
import { format } from 'date-fns';
import './ExportData.css';

export const ExportData: React.FC = () => {
  const { logs, goal } = useProgressStore();
  const [isExporting, setIsExporting] = useState(false);

  const summary = getExportSummary(logs);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      exportToCSV({ logs, goal });

      // Show success (could be replaced with a toast notification)
      alert(
        `✅ Successfully exported ${summary.totalLogs} reading logs to CSV!`
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert(
        error instanceof Error
          ? `Export failed: ${error.message}`
          : 'Export failed. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (logs.length === 0) {
    return (
      <div className="setting-card">
        <div className="setting-header">
          <h3>📥 Export Data</h3>
          <p className="setting-description">Download your reading history</p>
        </div>
        <div className="export-empty">
          <p>No reading logs to export yet. Start logging your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="setting-card">
      <div className="setting-header">
        <h3>📥 Export Data</h3>
        <p className="setting-description">Download your reading history as CSV</p>
      </div>

      <div className="export-content">
        {/* Summary */}
        <div className="export-summary">
          <div className="export-stat">
            <span className="export-stat-label">Total Logs:</span>
            <span className="export-stat-value">{summary.totalLogs}</span>
          </div>
          <div className="export-stat">
            <span className="export-stat-label">Total Pages:</span>
            <span className="export-stat-value">{summary.totalPages}</span>
          </div>
          {summary.dateRange && (
            <div className="export-stat">
              <span className="export-stat-label">Date Range:</span>
              <span className="export-stat-value">
                {format(summary.dateRange.start, 'MMM d, yyyy')} -{' '}
                {format(summary.dateRange.end, 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <span className="export-spinner">⏳</span>
              Exporting...
            </>
          ) : (
            <>
              <span>📥</span>
              Export to CSV
            </>
          )}
        </button>

        {/* Info */}
        <p className="export-info">
          Your data will be exported as a CSV file that can be opened in Excel,
          Google Sheets, or any spreadsheet application.
        </p>
      </div>
    </div>
  );
};

export default ExportData;
