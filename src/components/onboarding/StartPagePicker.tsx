import React from 'react';
import './Onboarding.css';

interface StartPagePickerProps {
  startPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const StartPagePicker: React.FC<StartPagePickerProps> = ({
  startPage,
  totalPages,
  onPageChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  return (
    <div className="start-page-picker">
      <h2 className="mb-2">Starting Page</h2>
      <p className="text-secondary mb-3">
        Which page will you start from? (Default is page 1)
      </p>

      <div className="form-group">
        <label htmlFor="start-page" className="form-label">
          Page Number
        </label>
        <input
          type="number"
          id="start-page"
          className="form-input"
          value={startPage}
          onChange={handleChange}
          min={1}
          max={totalPages}
        />
        <p className="form-hint">Enter a page between 1 and {totalPages}</p>
      </div>
    </div>
  );
};
