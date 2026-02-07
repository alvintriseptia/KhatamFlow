import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import './NotificationSettings.css';

export const NotificationSettings: React.FC = () => {
  const {
    permission,
    settings,
    isSupported,
    requestPermission,
    updateSettings,
    sendTestNotification,
  } = useNotifications();

  if (!isSupported) {
    return (
      <div className="setting-card">
        <div className="setting-header">
          <h3>🔔 Notifications</h3>
          <p className="setting-description">Not supported in your browser</p>
        </div>
      </div>
    );
  }

  const handleEnableNotifications = async () => {
    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) {
        alert('Please allow notifications in your browser settings to use this feature.');
      }
    } else if (permission === 'granted') {
      updateSettings({ enabled: !settings.enabled });
    } else {
      alert('Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  return (
    <div className="setting-card">
      <div className="setting-header">
        <h3>🔔 Notifications</h3>
        <p className="setting-description">Get reminders to stay on track</p>
      </div>

      <div className="setting-content">
        {/* Master toggle */}
        <div className="setting-row">
          <div className="setting-label">
            <span>Enable Notifications</span>
            <small>
              {permission === 'denied' && 'Blocked by browser'}
              {permission === 'default' && 'Click to allow'}
              {permission === 'granted' && settings.enabled && 'Active'}
              {permission === 'granted' && !settings.enabled && 'Disabled'}
            </small>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.enabled && permission === 'granted'}
              onChange={handleEnableNotifications}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Settings only shown when notifications are enabled */}
        {settings.enabled && permission === 'granted' && (
          <>
            <div className="setting-divider"></div>

            {/* Daily Reminder */}
            <div className="setting-row">
              <div className="setting-label">
                <span>Daily Reminder</span>
                <small>Get a daily reading reminder</small>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.dailyReminder}
                  onChange={(e) =>
                    updateSettings({ dailyReminder: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Reminder Time */}
            {settings.dailyReminder && (
              <div className="setting-row">
                <div className="setting-label">
                  <span>Reminder Time</span>
                  <small>When to send the daily reminder</small>
                </div>
                <input
                  type="time"
                  className="time-input"
                  value={settings.dailyReminderTime}
                  onChange={(e) =>
                    updateSettings({ dailyReminderTime: e.target.value })
                  }
                />
              </div>
            )}

            <div className="setting-divider"></div>

            {/* Prayer Reminders */}
            <div className="setting-row">
              <div className="setting-label">
                <span>Prayer Reminders</span>
                <small>Reminders for each prayer time</small>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.prayerReminders}
                  onChange={(e) =>
                    updateSettings({ prayerReminders: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-divider"></div>

            {/* Milestone Celebrations */}
            <div className="setting-row">
              <div className="setting-label">
                <span>Milestone Celebrations</span>
                <small>Celebrate 25%, 50%, 75% completion</small>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.milestones}
                  onChange={(e) =>
                    updateSettings({ milestones: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-divider"></div>

            {/* Test Button */}
            <button
              className="test-notification-btn"
              onClick={sendTestNotification}
            >
              📱 Send Test Notification
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
