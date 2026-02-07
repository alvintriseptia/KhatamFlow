import React from 'react';
import { ProgressLog } from '@/types/progress';
import { format } from 'date-fns';
import { Button } from '../common/Button';

interface LogEntryProps {
  log: ProgressLog;
  onDelete: (id: string) => void;
}

const LogEntry: React.FC<LogEntryProps> = ({ log, onDelete }) => {
  const formattedDate = format(log.timestamp, 'MMM dd, yyyy');
  const formattedTime = format(log.timestamp, 'h:mm a');


  return (
    <div className="log-entry">
      <div className="log-entry__content">
        <div className="log-entry__main">
          <span className="log-entry__page">Page {log.pageNumber}</span>
          <span className="log-entry__pages-read">
            {log.pagesRead} {log.pagesRead === 1 ? 'page' : 'pages'}
          </span>
        </div>
        <div className="log-entry__meta">
          <span className="log-entry__date">{formattedDate}</span>
          <span className="log-entry__time">{formattedTime}</span>
        </div>
        {log.notes && (
          <div className="log-entry__notes">{log.notes}</div>
        )}
      </div>
      <div className="log-entry__actions">
        <Button
          variant="danger"
          size="small"
          onClick={() => {
            if (confirm(`Delete this entry and all entries from page ${log.pageNumber} onwards?`)) {
              onDelete(log.id);
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default LogEntry;
