/**
 * CSV Export Utility
 * Exports reading history to CSV format
 */

import { format } from 'date-fns';
import { ProgressLog } from '@/types/progress';
import { Goal } from '@/types/goal';

interface ExportData {
  logs: ProgressLog[];
  goal: Goal | null;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(logs: ProgressLog[], goal: Goal | null): string {
  const headers = [
    'Date',
    'Time',
    'Page Number',
    'Pages Read',
    'Notes',
    'Timestamp',
  ];

  const rows = logs.map((log) => {
    const date = new Date(log.timestamp);
    return [
      format(date, 'yyyy-MM-dd'),
      format(date, 'HH:mm:ss'),
      log.pageNumber.toString(),
      log.pagesRead.toString(),
      log.notes ? `"${log.notes.replace(/"/g, '""')}"` : '',
      log.timestamp.toString(),
    ];
  });

  // Add metadata as comments at the top
  const metadata: string[] = [];
  if (goal) {
    const mushafName = goal.mushaf.type === 'madinah-604' ? 'Madinah Mushaf' : goal.mushaf.type;
    metadata.push(`# KhatamFlow Export`);
    metadata.push(`# Mushaf: ${mushafName} (${goal.mushaf.totalPages} pages)`);
    metadata.push(`# Target Date: ${format(new Date(goal.targetDate), 'yyyy-MM-dd')}`);
    metadata.push(`# Start Page: ${goal.startPage}`);
    metadata.push(`# Export Date: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
    metadata.push('');
  }

  // Combine metadata, headers, and rows
  const csvContent = [
    ...metadata,
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export reading history to CSV
 */
export function exportToCSV(data: ExportData): void {
  try {
    const { logs, goal } = data;

    if (logs.length === 0) {
      throw new Error('No reading logs to export');
    }

    // Sort logs by timestamp
    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

    // Convert to CSV
    const csvContent = convertToCSV(sortedLogs, goal);

    // Generate filename with current date
    const filename = `khatamflow-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;

    // Download
    downloadCSV(csvContent, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

/**
 * Get summary statistics for export preview
 */
export function getExportSummary(logs: ProgressLog[]): {
  totalLogs: number;
  totalPages: number;
  dateRange: { start: Date; end: Date } | null;
} {
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      totalPages: 0,
      dateRange: null,
    };
  }

  const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);
  const totalPages = logs.reduce((sum, log) => sum + log.pagesRead, 0);

  return {
    totalLogs: logs.length,
    totalPages,
    dateRange: {
      start: new Date(sortedLogs[0].timestamp),
      end: new Date(sortedLogs[sortedLogs.length - 1].timestamp),
    },
  };
}
