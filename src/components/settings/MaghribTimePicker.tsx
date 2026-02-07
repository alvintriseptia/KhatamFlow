import React, { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useProgressStore } from '@/store/progressStore';
import { Button } from '../common/Button';
import './Settings.css';

const MaghribTimePicker: React.FC = () => {
  const { maghribTime, setMaghribTime } = useSettingsStore();
  const { recalculateDailyGoal } = useProgressStore();
  const [localTime, setLocalTime] = useState(maghribTime);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await setMaghribTime(localTime);
    await recalculateDailyGoal(); // Recalculate with new Maghrib time
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTime(maghribTime);
    setIsEditing(false);
  };

  return (
    <div className="settings-item settings-item--column">
      <div className="settings-item__info">
        <div className="settings-item__label">Maghrib Time</div>
        <div className="settings-item__description">
          Islamic day starts at Maghrib (sunset)
        </div>
      </div>

      {isEditing ? (
        <div className="maghrib-time-picker">
          <input
            type="time"
            className="maghrib-time-picker__input"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
          />
          <div className="maghrib-time-picker__actions">
            <Button variant="secondary" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="maghrib-time-display">
          <span className="maghrib-time-display__value">{maghribTime}</span>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaghribTimePicker;
