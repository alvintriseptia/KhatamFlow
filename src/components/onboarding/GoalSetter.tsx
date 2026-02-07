import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import './Onboarding.css';

interface GoalSetterProps {
  targetDate: Date;
  onDateChange: (date: Date) => void;
}

export const GoalSetter: React.FC<GoalSetterProps> = ({ targetDate, onDateChange }) => {
  const [dateString, setDateString] = useState(format(targetDate, 'yyyy-MM-dd'));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = e.target.value;
    setDateString(newDateString);
    const newDate = new Date(newDateString);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  const handleQuickSelect = (days: number) => {
    const newDate = addDays(new Date(), days);
    setDateString(format(newDate, 'yyyy-MM-dd'));
    onDateChange(newDate);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="goal-setter">
      <h2 className="mb-2">Set Your Goal</h2>
      <p className="text-secondary mb-3">When do you want to complete your Khatam?</p>

      <div className="form-group mb-3">
        <label htmlFor="target-date" className="form-label">
          Target Date
        </label>
        <input
          type="date"
          id="target-date"
          className="form-input"
          value={dateString}
          onChange={handleDateChange}
          min={today}
        />
      </div>

      <div className="quick-select">
        <p className="text-secondary mb-2">Quick select:</p>
        <div className="quick-select__buttons">
          <button
            type="button"
            className="quick-select__button"
            onClick={() => handleQuickSelect(30)}
          >
            30 Days
          </button>
          <button
            type="button"
            className="quick-select__button"
            onClick={() => handleQuickSelect(60)}
          >
            60 Days
          </button>
          <button
            type="button"
            className="quick-select__button"
            onClick={() => handleQuickSelect(90)}
          >
            90 Days
          </button>
        </div>
      </div>
    </div>
  );
};
