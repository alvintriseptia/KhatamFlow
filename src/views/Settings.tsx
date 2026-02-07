import React from 'react';
import ThemeToggle from '@/components/settings/ThemeToggle';
import MaghribTimePicker from '@/components/settings/MaghribTimePicker';
import NotificationSettings from '@/components/settings/NotificationSettings';
import ExportData from '@/components/settings/ExportData';
import ResetData from '@/components/settings/ResetData';
import './Views.css';

export const Settings: React.FC = () => {
  return (
    <div className="view-container">
      <div className="settings-container">
        <header className="settings-header">
          <h1>Settings</h1>
          <p className="subtitle">Customize your experience</p>
        </header>
        <main className="settings-content">
          <NotificationSettings />
          <ThemeToggle />
          <MaghribTimePicker />
          <ExportData />
          <ResetData />
        </main>
      </div>
    </div>
  );
};
