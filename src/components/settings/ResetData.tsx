import React, { useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { useNavigationStore } from '@/store/navigationStore';
import { Button } from '../common/Button';
import './Settings.css';

const ResetData: React.FC = () => {
  const { resetProgress } = useProgressStore();
  const { navigate } = useNavigationStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    await resetProgress();
    setShowConfirm(false);
    // Navigate to dashboard (which will show onboarding since goal is reset)
    navigate('dashboard');
    // Reload the page to ensure clean state
    window.location.reload();
  };

  return (
    <div className="settings-item settings-item--column settings-item--danger">
      <div className="settings-item__info">
        <div className="settings-item__label">Reset All Data</div>
        <div className="settings-item__description">
          Delete all progress, logs, and settings. This cannot be undone.
        </div>
      </div>

      {showConfirm ? (
        <div className="reset-confirm">
          <p className="reset-confirm__warning">⚠️ Are you sure? This will delete everything!</p>
          <div className="reset-confirm__actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleReset}
            >
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="danger"
          size="medium"
          onClick={() => setShowConfirm(true)}
        >
          Reset Data
        </Button>
      )}
    </div>
  );
};

export default ResetData;
