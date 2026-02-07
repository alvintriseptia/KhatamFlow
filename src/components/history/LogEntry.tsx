import React, { useState } from 'react';
import { ProgressLog } from '@/types/progress';
import { format } from 'date-fns';
import { Button } from '../common/Button';
import './History.css';

interface LogEntryProps {
  log: ProgressLog;
  onEdit: (log: ProgressLog) => void;
  onDelete: (id: string) => void;
}

const LogEntry: React.FC<LogEntryProps> = ({ log, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPage, setEditedPage] = useState(log.pageNumber);
  const [editedNotes, setEditedNotes] = useState(log.notes || '');

  const formattedDate = format(log.timestamp, 'MMM dd, yyyy');
  const formattedTime = format(log.timestamp, 'h:mm a');

  const handleSave = () => {
    onEdit({
      ...log,
      pageNumber: editedPage,
      notes: editedNotes || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPage(log.pageNumber);
    setEditedNotes(log.notes || '');
    setIsEditing(false);
  };

  return (
    <div className="log-entry">
      {isEditing ? (
        <div className="log-entry__edit">
          <div className="log-entry__edit-field">
            <label htmlFor={`page-${log.id}`}>Page Number</label>
            <input
              id={`page-${log.id}`}
              type="number"
              min="1"
              max="604"
              value={editedPage}
              onChange={(e) => setEditedPage(Number(e.target.value))}
              className="log-entry__input"
            />
          </div>
          <div className="log-entry__edit-field">
            <label htmlFor={`notes-${log.id}`}>Notes (optional)</label>
            <input
              id={`notes-${log.id}`}
              type="text"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Add notes..."
              className="log-entry__input"
            />
          </div>
          <div className="log-entry__actions">
            <Button variant="secondary" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
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
              variant="secondary"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => {
                if (confirm('Delete this log entry?')) {
                  onDelete(log.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogEntry;
