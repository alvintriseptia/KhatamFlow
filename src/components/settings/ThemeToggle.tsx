import React from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import './Settings.css';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettingsStore();

  const handleToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  return (
    <div className="settings-item">
      <div className="settings-item__info">
        <div className="settings-item__label">Theme</div>
        <div className="settings-item__description">
          {theme === 'dark' ? 'Dark mode (OLED)' : 'Light mode'}
        </div>
      </div>
      <button
        className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
        onClick={handleToggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span className="theme-toggle__icon">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
        <span className="theme-toggle__slider"></span>
      </button>
    </div>
  );
};

export default ThemeToggle;
