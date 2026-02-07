import React, { useState } from 'react';
import { Button } from '../common/Button';
import './Dashboard.css';

interface FastLogButtonProps {
  currentPage: number;
  totalPages: number;
  onLogProgress: (page: number) => void;
  onLogProgressRange?: (startPage: number, endPage: number) => void;
  isDisabled?: boolean;
}

export const FastLogButton: React.FC<FastLogButtonProps> = ({
  currentPage,
  totalPages,
  onLogProgress,
  onLogProgressRange,
  isDisabled
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeError, setRangeError] = useState('');

  const nextPage = currentPage + 1;

  const handleClick = async () => {
    setIsLogging(true);
    try {
      await onLogProgress(nextPage);
      // Brief delay for user feedback
      setTimeout(() => setIsLogging(false), 500);
    } catch (error) {
      setIsLogging(false);
      console.error('Failed to log progress:', error);
    }
  };

  const handleRangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRangeError('');

    if (!onLogProgressRange) return;

    const endPageNum = parseInt(rangeEnd);

    // Validation
    if (isNaN(endPageNum)) {
      setRangeError('Please enter a valid page number');
      return;
    }

    if (endPageNum <= currentPage) {
      setRangeError(`Must be greater than current page (${currentPage})`);
      return;
    }

    if (endPageNum > totalPages) {
      setRangeError(`Cannot exceed total pages (${totalPages})`);
      return;
    }

    setIsLogging(true);
    try {
      await onLogProgressRange(nextPage, endPageNum);
      setRangeEnd('');
      setIsExpanded(false);
      // Brief delay for user feedback
      setTimeout(() => setIsLogging(false), 500);
    } catch (error) {
      setIsLogging(false);
      console.error('Failed to log progress range:', error);
      setRangeError('Failed to log progress. Please try again.');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setRangeError('');
    setRangeEnd('');
  };

  return (
    <div className="fast-log-container">
      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleClick}
        disabled={isDisabled || isLogging}
        className="fast-log-button"
      >
        {isLogging ? (
          <>✓ Logged!</>
        ) : (
          <>✓ Finished Page {nextPage}</>
        )}
      </Button>

      {onLogProgressRange && (
        <button
          className="range-toggle"
          onClick={toggleExpanded}
          disabled={isDisabled || isLogging}
          type="button"
        >
          {isExpanded ? '▲ Less Options' : '▼ Log Multiple Pages'}
        </button>
      )}

      {isExpanded && onLogProgressRange && (
        <form className="range-input-form" onSubmit={handleRangeSubmit}>
          <div className="range-input-group">
            <label htmlFor="range-end" className="range-label">
              Log pages {nextPage} through:
            </label>
            <input
              id="range-end"
              type="number"
              className="range-input"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              placeholder={`${nextPage + 1}`}
              min={nextPage + 1}
              max={totalPages}
              disabled={isLogging}
            />
          </div>
          {rangeError && <div className="range-error">{rangeError}</div>}
          <Button
            type="submit"
            variant="secondary"
            size="medium"
            fullWidth
            disabled={isLogging || !rangeEnd}
          >
            {isLogging ? 'Logging...' : 'Log Range'}
          </Button>
        </form>
      )}
    </div>
  );
};
