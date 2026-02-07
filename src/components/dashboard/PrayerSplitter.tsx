import React from 'react';
import { splitByPrayers } from '@/core/algorithm/calculator';
import { Card } from '../common/Card';
import './Dashboard.css';

interface PrayerSplitterProps {
  dailyPages: number;
}

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_ICONS = ['🌅', '☀️', '🌤️', '🌆', '🌙'];

export const PrayerSplitter: React.FC<PrayerSplitterProps> = ({ dailyPages }) => {
  if (dailyPages === 0) {
    return null;
  }

  const prayerPages = splitByPrayers(dailyPages);

  return (
    <Card className="prayer-splitter">
      <h3 className="mb-2">Prayer Plan</h3>
      <p className="text-secondary mb-3">Split your reading across 5 daily prayers</p>

      <div className="prayer-list">
        {PRAYER_NAMES.map((name, index) => (
          <div key={name} className="prayer-item">
            <div className="prayer-item__icon">{PRAYER_ICONS[index]}</div>
            <div className="prayer-item__content">
              <span className="prayer-item__name">{name}</span>
              <span className="prayer-item__pages">
                {prayerPages[index]} {prayerPages[index] === 1 ? 'page' : 'pages'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
