import React, { useState } from 'react';
import { Button } from '../common/Button';
import './Dashboard.css';

interface FastLogButtonProps {
  currentPage: number;
  onLogProgress: (page: number) => void;
  isDisabled?: boolean;
}

export const FastLogButton: React.FC<FastLogButtonProps> = ({
  currentPage,
  onLogProgress,
  isDisabled
}) => {
  const [isLogging, setIsLogging] = useState(false);
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

  return (
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
  );
};
