import React from 'react';
import { Card } from '../common/Card';
import './Dashboard.css';

interface ResumeCardProps {
  nextPage: number;
  totalPages: number;
  surah?: string;
  juz?: number;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  nextPage,
  totalPages,
  surah,
  juz
}) => {
  const progressPercent = Math.round((nextPage / totalPages) * 100);

  return (
    <Card className="resume-card">
      <div className="resume-card__header">
        <h3>Continue Reading</h3>
        <span className="resume-card__badge">{progressPercent}%</span>
      </div>

      <div className="resume-card__content">
        <div className="resume-card__page">
          Page <strong>{nextPage}</strong> of {totalPages}
        </div>

        {surah && (
          <div className="resume-card__details">
            <span>{surah}</span>
            {juz && <span> • Juz {juz}</span>}
          </div>
        )}

        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
